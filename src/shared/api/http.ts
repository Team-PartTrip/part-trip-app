import { request } from './client';
import { getAccessToken } from './tokenStorage';

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
  return request<T>(path, { ...options, token });
}
