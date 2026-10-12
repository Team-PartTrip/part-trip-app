import { request } from '../../shared/api/client';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/** 구글 로그인: idToken을 백엔드에 보내 우리 JWT 발급 */
export function googleLogin(idToken: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/google', {
    body: { idToken },
  });
}

/** 카카오 로그인: 카카오 액세스 토큰을 백엔드에 보내 우리 JWT 발급 */
export function kakaoLogin(accessToken: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/kakao', {
    body: { accessToken },
  });
}

/** accessToken 재발급 */
export function refresh(refreshToken: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/refresh', {
    body: { refreshToken },
  });
}

/** 로그아웃 (서버의 refreshToken 폐기) */
export function logout(refreshToken: string): Promise<string> {
  return request<string>('/api/auth/logout', {
    body: { refreshToken },
  });
}
