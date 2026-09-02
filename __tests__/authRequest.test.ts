// 모듈을 테스트마다 새로 부르므로 ApiError 도 그때 같이 받아온다.
// 예전 인스턴스를 쓰면 http.ts 안의 instanceof 가 어긋난다.
let ApiError: typeof import('../src/shared/api/client').ApiError;

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
let mockGeneration = 0;
jest.mock('../src/shared/api/tokenStorage', () => ({
  getAccessToken: () => Promise.resolve(mockAccess),
  getRefreshToken: () => Promise.resolve(mockRefreshToken),
  getSessionGeneration: () => mockGeneration,
  saveTokens: (t: any, o: any = {}) => {
    mockSaveTokens(t, o);
    // 로그인만 세션이 바뀐 것이다. 갱신은 같은 세션이라 올리지 않는다.
    if (o.newSession !== false) {
      mockGeneration += 1;
    }
    mockAccess = t.accessToken;
    return Promise.resolve();
  },
  clearTokens: () => {
    mockClearTokens();
    mockGeneration += 1;
    return Promise.resolve();
  },
}));

// http.ts 는 진행 중인 갱신을 모듈 변수로 들고 있다. mockGeneration 만
// 되돌리면 갱신이 안 끝난 테스트 뒤에 옛 프로미스를 그대로 물려받는다.
// 테스트마다 모듈을 새로 불러 그 상태까지 초기화한다.
let authRequest: any;
let setSessionExpiredHandler: any;

beforeEach(() => {
  jest.resetModules();
  ({ ApiError } = require('../src/shared/api/client'));
  ({ authRequest, setSessionExpiredHandler } = require('../src/shared/api/http'));
  mockRequest.mockReset();
  mockSaveTokens.mockReset();
  mockClearTokens.mockReset();
  mockAccess = 'old';
  mockRefreshToken = 'refresh-1';
  mockGeneration = 0;
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

test('갱신 중에 다른 세션이 로그인하면 그 토큰을 덮어쓰지 않는다', async () => {
  mockRequest
    .mockImplementationOnce(unauthorized)
    .mockImplementationOnce(
      () =>
        new Promise(resolve =>
          setTimeout(() => {
            // 갱신이 오가는 사이 사용자가 다시 로그인했다
            mockGeneration += 1;
            mockAccess = 'other-session';
            resolve({ accessToken: 'stale', refreshToken: 'stale-r' });
          }, 10),
        ),
    )
    .mockImplementationOnce(() => Promise.resolve({ ok: true }));

  await expect(authRequest('/api/x')).rejects.toMatchObject({ status: 401 });

  // 옛 응답을 저장하면 새 세션이 망가진다
  expect(mockSaveTokens).not.toHaveBeenCalled();
  // 새 세션 토큰으로 재시도하면 남의 계정으로 요청이 나간다
  expect(mockRequest).toHaveBeenCalledTimes(2);
  // 그 사람을 쫓아내서도 안 된다
  expect(mockClearTokens).not.toHaveBeenCalled();
});

test('갱신이 실패해도 다른 세션이 시작됐으면 쫓아내지 않는다', async () => {
  const onExpired = jest.fn();
  setSessionExpiredHandler(onExpired);
  mockRequest.mockImplementationOnce(unauthorized).mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) =>
        setTimeout(() => {
          mockGeneration += 1; // 그 사이 로그인
          reject(new ApiError(401, '만료'));
        }, 10),
      ),
  );

  await expect(authRequest('/api/x')).rejects.toMatchObject({ status: 401 });
  expect(mockClearTokens).not.toHaveBeenCalled();
  expect(onExpired).not.toHaveBeenCalled();
});

test('네트워크 오류로 갱신이 실패하면 토큰을 지우지 않는다', async () => {
  let expired = false;
  setSessionExpiredHandler(() => {
    expired = true;
  });
  mockRequest
    .mockImplementationOnce(unauthorized)
    .mockImplementationOnce(() =>
      Promise.reject(new TypeError('Network request failed')),
    );

  await expect(authRequest('/api/x')).rejects.toThrow('Network request failed');
  expect(mockClearTokens).not.toHaveBeenCalled();
  expect(expired).toBe(false);
});

test('리프레시 토큰이 거부되면(400) 세션을 끝낸다', async () => {
  // 서버는 만료·미등록 리프레시 토큰을 IllegalArgumentException 으로 던지고
  // GlobalExceptionHandler 가 400 으로 내보낸다. 이걸 일시적 오류로 보면
  // 만료된 세션이 정리되지 않아 앱이 계속 실패한다.
  const onExpired = jest.fn();
  setSessionExpiredHandler(onExpired);
  mockRequest
    .mockImplementationOnce(unauthorized)
    .mockImplementationOnce(() =>
      Promise.reject(new ApiError(400, 'Refresh Token이 만료되었습니다.')),
    );

  await expect(authRequest('/api/x')).rejects.toThrow('로그인이 만료');
  expect(mockClearTokens).toHaveBeenCalledTimes(1);
  expect(onExpired).toHaveBeenCalledTimes(1);
});

test('다른 세션이 시작한 갱신을 재사용해 새 세션을 쫓아내지 않는다', async () => {
  // A(세대 0)가 갱신을 시작한다. 그 응답이 오기 전에 사용자가 재로그인해
  // 세대가 1 이 된다. 그때 들어온 B 가 A 의 갱신을 같이 기다리면, A 의
  // null(=세션이 바뀌어 저장 생략)을 자기 갱신 실패로 읽고 새 세션을 끊는다.
  let releaseA: (v: any) => void = () => {};
  let aRefreshStarted: () => void = () => {};
  let bRefreshStarted: () => void = () => {};
  const aRefreshing = new Promise<void>(res => (aRefreshStarted = res));
  const bRefreshing = new Promise<void>(res => (bRefreshStarted = res));
  let refreshCount = 0;

  mockRequest.mockImplementation((path: string) => {
    if (path === '/api/auth/refresh') {
      refreshCount += 1;
      if (refreshCount === 1) {
        aRefreshStarted();
        return new Promise(res => (releaseA = res));
      }
      bRefreshStarted();
      return Promise.resolve({
        accessToken: 'b-new',
        refreshToken: 'refresh-b',
      });
    }
    if (path === '/api/a') {
      return unauthorized();
    }
    // B 는 처음 한 번만 401, 갱신 뒤에는 성공한다
    return mockAccess === 'b-new'
      ? Promise.resolve({ ok: 'b' })
      : unauthorized();
  });

  const a = authRequest('/api/a').catch((e: unknown) => e);
  await aRefreshing;

  mockGeneration = 1; // 재로그인

  const b = authRequest('/api/b');
  await bRefreshing;
  releaseA({ accessToken: 'a-new', refreshToken: 'refresh-a' });

  await expect(b).resolves.toEqual({ ok: 'b' });
  await a;
  expect(refreshCount).toBe(2); // B 가 A 의 갱신을 재사용하지 않았다
  expect(mockClearTokens).not.toHaveBeenCalled();
});

test('먼저 끝난 옛 세대의 갱신이 진행 중인 새 세대의 갱신을 지우지 않는다', async () => {
  // A(세대 0)가 아직 진행 중일 때 B(세대 1)가 자기 갱신을 시작한다.
  // 그 뒤 A 가 끝나며 뒷정리로 B 의 자리를 지우면, 같은 세대의 C 가 갱신을
  // 하나 더 띄운다. 서버가 리프레시 토큰을 회전시키면 그 두 번째가 401 을
  // 받아 방금 로그인한 세션이 끊긴다.
  let releaseA: (v: any) => void = () => {};
  let releaseB: (v: any) => void = () => {};
  const started: (() => void)[] = [];
  const startedAt = (n: number) => new Promise<void>(res => (started[n] = res));
  const aRefreshing = startedAt(1);
  const bRefreshing = startedAt(2);
  let refreshCount = 0;

  mockRequest.mockImplementation((path: string) => {
    if (path === '/api/auth/refresh') {
      refreshCount += 1;
      started[refreshCount]?.();
      if (refreshCount === 1) {
        return new Promise(res => (releaseA = res));
      }
      return new Promise(res => (releaseB = res));
    }
    return mockAccess === 'b-new'
      ? Promise.resolve({ ok: true })
      : unauthorized();
  });

  const a = authRequest('/api/a').catch((e: unknown) => e);
  await aRefreshing;

  mockGeneration = 1; // 재로그인

  const b = authRequest('/api/b');
  await bRefreshing; // B 가 자기 갱신을 시작해 자리를 차지했다

  // 이제 A 가 끝난다. 이 뒷정리가 B 의 자리를 지우면 안 된다.
  releaseA({ accessToken: 'a-new', refreshToken: 'r-a' });
  await a;

  // C 는 B 와 같은 세대다. 진행 중인 B 의 갱신을 같이 기다려야 한다.
  const c = authRequest('/api/c');
  // C 가 진행 중인 B 의 갱신에 도달할 때까지 마이크로태스크를 모두 비운다.
  // 한 틱만 흘리면 C 가 아직 도착 전일 수 있어 테스트가 엉뚱하게 실패한다.
  await new Promise<void>(res => {
    setImmediate(res);
  });
  releaseB({ accessToken: 'b-new', refreshToken: 'r-b' });

  await expect(b).resolves.toEqual({ ok: true });
  await expect(c).resolves.toEqual({ ok: true });
  expect(refreshCount).toBe(2); // C 가 세 번째 갱신을 띄우지 않았다
  expect(mockClearTokens).not.toHaveBeenCalled();
});
