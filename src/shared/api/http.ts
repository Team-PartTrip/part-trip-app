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

async function refreshAccessToken(): Promise<string | null> {
  if (refreshing) {
    return refreshing;
  }
  refreshing = (async () => {
    // 갱신이 오가는 동안 사용자가 로그아웃하고 다시 로그인할 수 있다.
    // 그때 이 응답을 저장하면 새 세션의 토큰을 옛 것으로 덮어쓴다.
    const generation = getSessionGeneration();
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
      if (getSessionGeneration() !== generation) {
        // 그 사이 세션이 바뀌었다. 새 세션의 토큰을 덮어쓰지 않는다.
        return null;
      }
      await saveTokens(tokens, { newSession: false });
      return tokens.accessToken;
    } catch {
      return null;
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
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
