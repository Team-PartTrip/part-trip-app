import { ApiError, request } from './client';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
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
      await saveTokens(tokens);
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
  try {
    return await request<T>(path, { ...options, token });
  } catch (e) {
    // 401 만 갱신 대상이다. 403 은 권한이 없는 것이라 다시 보내도 같다.
    if (!(e instanceof ApiError) || e.status !== 401) {
      throw e;
    }
    const fresh = await refreshAccessToken();
    if (!fresh) {
      await clearTokens();
      onSessionExpired?.();
      throw new ApiError(401, '로그인이 만료되었어요. 다시 로그인해주세요.');
    }
    return request<T>(path, { ...options, token: fresh });
  }
}
