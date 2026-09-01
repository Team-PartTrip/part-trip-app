import { ApiError, request } from './client';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getSessionGeneration,
  saveTokens,
} from './tokenStorage';

/**
 * 액세스 토큰이 만료되면 서버는 401 을 준다 (JwtAuthFilter).
 * 그때 리프레시 토큰으로 한 번 갱신하고 원래 요청을 다시 보낸다.
 *
 * 갱신까지 실패하면 저장된 토큰을 지우고 로그인 화면으로 돌린다.
 * 그대로 두면 모든 화면이 계속 401 을 받아 앱을 껐다 켜는 수밖에 없다.
 */

/** 세션이 끝났을 때 앱에 알리는 콜백. App.tsx 가 로그인 화면으로 보낸다 */
type SessionExpiredHandler = () => void;

let onSessionExpired: SessionExpiredHandler | null = null;

export function setSessionExpiredHandler(handler: SessionExpiredHandler): void {
  onSessionExpired = handler;
}

// 여러 요청이 동시에 401 을 받아도 갱신은 한 번만 나가게 공유한다.
// 각자 갱신하면 서버가 리프레시 토큰을 회전시킬 때 서로를 무효화한다.
let refreshing: Promise<string | null> | null = null;
// 그 갱신이 어느 세션에서 시작됐는지. 다른 세션이 시작한 것을 같이 기다리면
// 그쪽의 null(=세션이 바뀌어 저장을 건너뜀)을 이쪽의 "갱신 실패" 로 읽는다.
let refreshingGeneration = -1;

/**
 * 액세스 토큰 갱신.
 *
 * null 은 "리프레시 토큰이 거부됐다" 는 뜻만 갖는다.
 * 네트워크·서버 오류는 잠시 후 다시 되는 것이라 그대로 던진다.
 * 그걸 null 로 뭉치면 지하철에서 한 번 끊긴 것으로 로그아웃된다.
 */
async function refreshAccessToken(): Promise<string | null> {
  const generation = getSessionGeneration();
  if (refreshing && refreshingGeneration === generation) {
    return refreshing;
  }
  const mine = doRefresh(generation);
  refreshing = mine;
  refreshingGeneration = generation;
  // 옛 세대의 갱신이 늦게 끝나면서 새 세대의 것을 지우면, 같은 세대의 다음
  // 요청이 진행 중인 갱신을 놔두고 하나 더 띄운다. 서버가 리프레시 토큰을
  // 회전시키면 그 두 번째가 401 을 받아 새 세션을 끊는다.
  const release = () => {
    if (refreshing === mine) {
      refreshing = null;
      refreshingGeneration = -1;
    }
  };
  mine.then(release, release);
  return mine;
}

/** 갱신 한 번. 공유·해제는 refreshAccessToken 이 맡는다 */
async function doRefresh(generation: number): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    // entities 를 끌어오면 shared 가 상위 계층을 참조하게 되어 여기서 직접 부른다
    const tokens = await request<{
      accessToken: string;
      refreshToken: string;
    }>('/api/auth/refresh', { body: { refreshToken } });
    // 갱신이 오가는 사이 사용자가 로그아웃하고 다시 로그인할 수 있다.
    // 그때 이 응답을 저장하면 새 세션의 토큰을 옛 것으로 덮어쓴다.
    if (getSessionGeneration() !== generation) {
      return null;
    }
    await saveTokens(tokens, { newSession: false });
    return tokens.accessToken;
  } catch (e) {
    // 서버가 리프레시 토큰을 거부한 것만 세션의 끝이다.
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
      return null;
    }
    throw e;
  }
}

/**
 * 인증이 필요한 요청 헬퍼.
 * 저장된 accessToken을 자동으로 Authorization 헤더에 첨부한다.
 * (스펙상 `/api/auth/**` 를 제외한 모든 요청은 인증 필요)
 */
export async function authRequest<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getAccessToken();
  const generation = getSessionGeneration();
  try {
    return await request<T>(path, { ...options, token });
  } catch (e) {
    // 401 만 갱신 대상이다. 403 은 권한이 없는 것이라 다시 보내도 같다.
    if (!(e instanceof ApiError) || e.status !== 401) {
      throw e;
    }
    // 갱신 자체가 네트워크·서버 오류로 실패하면 그대로 올라간다.
    // 토큰은 아직 멀쩡하므로 지우지 않는다.
    const fresh = await refreshAccessToken();

    // 갱신을 기다리는 사이 다른 세션이 시작됐을 수 있다. 그때는
    //  - 새 세션의 토큰으로 재시도하면 남의 계정으로 요청이 나간다
    //  - 토큰을 지우거나 화면을 옮기면 그 사람을 쫓아낸다
    // 그래서 이 요청만 실패시키고 끝낸다.
    if (getSessionGeneration() !== generation) {
      throw new ApiError(401, '로그인 정보가 바뀌었어요. 다시 시도해주세요.');
    }

    if (!fresh) {
      await clearTokens();
      onSessionExpired?.();
      throw new ApiError(401, '로그인이 만료되었어요. 다시 로그인해주세요.');
    }
    return request<T>(path, { ...options, token: fresh });
  }
}
