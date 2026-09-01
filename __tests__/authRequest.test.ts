import { ApiError } from '../src/shared/api/client';

// request 와 tokenStorage 를 대신 세운다. 네트워크와 저장소 없이
// 401 → 갱신 → 재시도 흐름만 본다.
const mockRequest = jest.fn();
jest.mock('../src/shared/api/client', () => {
  const actual = jest.requireActual('../src/shared/api/client');
  return { ...actual, request: (...a: any[]) => mockRequest(...a) };
});

let mockAccess = 'old';
const mockSaveTokens = jest.fn();
const mockClearTokens = jest.fn();
let mockRefreshToken: string | null = 'refresh-1';
jest.mock('../src/shared/api/tokenStorage', () => ({
  getAccessToken: () => Promise.resolve(mockAccess),
  getRefreshToken: () => Promise.resolve(mockRefreshToken),
  saveTokens: (t: any) => {
    mockSaveTokens(t);
    mockAccess = t.accessToken;
    return Promise.resolve();
  },
  clearTokens: () => {
    mockClearTokens();
    return Promise.resolve();
  },
}));

// mock 이 걸린 뒤에 불러와야 한다
const { authRequest, setSessionExpiredHandler } = require('../src/shared/api/http');

beforeEach(() => {
  mockRequest.mockReset();
  mockSaveTokens.mockReset();
  mockClearTokens.mockReset();
  mockAccess = 'old';
  mockRefreshToken = 'refresh-1';
  setSessionExpiredHandler(() => {});
});

const unauthorized = () => Promise.reject(new ApiError(401, '만료'));

test('401 이면 갱신하고 원래 요청을 다시 보낸다', async () => {
  mockRequest
    .mockImplementationOnce(unauthorized)
    .mockImplementationOnce(() =>
      Promise.resolve({ accessToken: 'new', refreshToken: 'refresh-2' }),
    )
    .mockImplementationOnce(() => Promise.resolve({ ok: true }));

  await expect(authRequest('/api/x')).resolves.toEqual({ ok: true });

  expect(mockRequest).toHaveBeenCalledTimes(3);
  expect(mockRequest.mock.calls[1][0]).toBe('/api/auth/refresh');
  // 재시도는 새 토큰으로 나가야 한다
  expect(mockRequest.mock.calls[2][1].token).toBe('new');
  expect(mockSaveTokens).toHaveBeenCalledTimes(1);
});

test('401 이 아니면 갱신하지 않는다', async () => {
  mockRequest.mockImplementationOnce(() =>
    Promise.reject(new ApiError(403, '권한 없음')),
  );

  await expect(authRequest('/api/x')).rejects.toMatchObject({ status: 403 });
  expect(mockRequest).toHaveBeenCalledTimes(1);
});

test('갱신이 실패하면 토큰을 지우고 세션 만료를 알린다', async () => {
  const onExpired = jest.fn();
  setSessionExpiredHandler(onExpired);
  mockRequest
    .mockImplementationOnce(unauthorized)
    .mockImplementationOnce(() => Promise.reject(new ApiError(401, '만료')));

  await expect(authRequest('/api/x')).rejects.toMatchObject({ status: 401 });
  expect(mockClearTokens).toHaveBeenCalledTimes(1);
  expect(onExpired).toHaveBeenCalledTimes(1);
});

test('리프레시 토큰이 없으면 갱신을 시도하지 않는다', async () => {
  mockRefreshToken = null;
  mockRequest.mockImplementationOnce(unauthorized);

  await expect(authRequest('/api/x')).rejects.toMatchObject({ status: 401 });
  // 원래 요청 한 번뿐. /api/auth/refresh 는 안 나간다
  expect(mockRequest).toHaveBeenCalledTimes(1);
  expect(mockClearTokens).toHaveBeenCalledTimes(1);
});

test('동시에 401 을 받아도 갱신은 한 번만 나간다', async () => {
  let refreshCalls = 0;
  mockRequest.mockImplementation((path: string) => {
    if (path === '/api/auth/refresh') {
      refreshCalls += 1;
      return new Promise(resolve =>
        setTimeout(
          () => resolve({ accessToken: 'new', refreshToken: 'refresh-2' }),
          10,
        ),
      );
    }
    // 옛 토큰이면 401, 새 토큰이면 성공
    return mockAccess === 'new'
      ? Promise.resolve({ ok: true })
      : Promise.reject(new ApiError(401, '만료'));
  });

  const results = await Promise.all([
    authRequest('/api/a'),
    authRequest('/api/b'),
    authRequest('/api/c'),
  ]);

  expect(results).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
  // 각자 갱신하면 서버가 리프레시 토큰을 회전시킬 때 서로를 무효화한다
  expect(refreshCalls).toBe(1);
});
