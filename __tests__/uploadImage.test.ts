import { ApiError } from '../src/shared/api/client';

jest.mock('@env', () => ({ BASE_URL: 'http://test' }), { virtual: true });
let mockGeneration = 0;
const mockGetAccessToken = jest.fn(() => Promise.resolve('token'));
jest.mock('../src/shared/api/tokenStorage', () => ({
  getAccessToken: () => mockGetAccessToken(),
  getSessionGeneration: () => mockGeneration,
}));
const mockRefresh = jest.fn();
jest.mock('../src/shared/api/http', () => ({
  refreshAccessToken: () => mockRefresh(),
}));

const { uploadImage } = require('../src/shared/api/image');

function respond(body: string, ok = true, status = 200) {
  (globalThis as any).fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    text: () => Promise.resolve(body),
  });
}

const upload = () => uploadImage('file:///a.jpg', 'a.jpg', 'image/jpeg');

beforeEach(() => {
  mockGeneration = 0;
  mockGetAccessToken.mockReset();
  mockGetAccessToken.mockResolvedValue('token');
  mockRefresh.mockReset();
});

// 서버(ProfileController)는 ResponseEntity<String> 이라 경로를 평문으로 준다.
// 예전에는 data.url 을 읽어 늘 undefined 였고, 사진을 골라도 아무 일이 없었다.
test('평문 경로를 그대로 돌려준다', async () => {
  respond('/uploads/profile/abc.jpg');
  await expect(upload()).resolves.toBe('/uploads/profile/abc.jpg');
});

test('앞뒤 공백이 있어도 경로만 남긴다', async () => {
  respond('  /uploads/profile/abc.jpg\n');
  await expect(upload()).resolves.toBe('/uploads/profile/abc.jpg');
});

test('JSON 으로 주는 경우도 받는다', async () => {
  respond('{"url":"/uploads/profile/abc.jpg"}');
  await expect(upload()).resolves.toBe('/uploads/profile/abc.jpg');
});

test('본문이 비면 조용히 성공시키지 않는다', async () => {
  respond('');
  await expect(upload()).rejects.toBeInstanceOf(ApiError);
});

test('실패 응답은 서버 문구를 그대로 올린다', async () => {
  respond('이미지 저장에 실패했습니다.', false, 400);
  await expect(upload()).rejects.toThrow('이미지 저장에 실패했습니다.');
});

test('401 이면 토큰을 갱신하고 한 번 다시 올린다', async () => {
  // multipart 라 authRequest 를 못 쓴다. 갱신이 없으면 토큰이 만료된 뒤로
  // 사진만 계속 올라가지 않는다.
  mockRefresh.mockResolvedValueOnce('new-token');
  const fetchMock = jest
    .fn()
    .mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve(''),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve('/uploads/profile/abc.jpg'),
    });
  (globalThis as any).fetch = fetchMock;

  await expect(upload()).resolves.toBe('/uploads/profile/abc.jpg');
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe(
    'Bearer new-token',
  );
});

test('갱신이 실패하면 다시 올리지 않는다', async () => {
  mockRefresh.mockResolvedValueOnce(null);
  const fetchMock = jest
    .fn()
    .mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve('만료'),
    });
  (globalThis as any).fetch = fetchMock;

  await expect(upload()).rejects.toBeInstanceOf(ApiError);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('갱신 중 세션이 바뀌면 새 토큰으로 다시 올리지 않는다', async () => {
  mockRefresh.mockImplementationOnce(async () => {
    mockGeneration += 1;
    return 'other-session-token';
  });
  const fetchMock = jest
    .fn()
    .mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve(''),
    });
  (globalThis as any).fetch = fetchMock;

  await expect(upload()).rejects.toMatchObject({ status: 401 });
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('토큰을 읽는 중 세션이 바뀌면 업로드를 시작하지 않는다', async () => {
  mockGetAccessToken.mockImplementationOnce(async () => {
    mockGeneration += 1;
    return 'other-session-token';
  });
  const fetchMock = jest.fn();
  (globalThis as any).fetch = fetchMock;

  await expect(upload()).rejects.toMatchObject({ status: 401 });
  expect(fetchMock).not.toHaveBeenCalled();
});
