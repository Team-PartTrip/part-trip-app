import { request } from '../../shared/api/client';
import { authRequest } from '../../shared/api/http';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  /** 여행 취향 설문을 완료했는지 여부 (false면 로그인 직후 설문 화면으로 안내) */
  surveyCompleted: boolean;
}

export interface SignUpPayload {
  userId: string;
  userPwd: string;
  userMail: string;
  /** 가입 구분 (기본 'EMAIL') */
  signUpDivision?: string;
  /** 국가 코드 (기본 'KR') */
  myCountry?: string;
}

/** 로그인 → accessToken / refreshToken 발급 */
export function login(userId: string, userPwd: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/login', {
    body: { userId, userPwd },
  });
}

/** 구글 로그인: idToken을 백엔드에 보내 우리 JWT 발급 */
export function googleLogin(idToken: string): Promise<TokenResponse> {
  return request<TokenResponse>('/api/auth/google', {
    body: { idToken },
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

/** 회원가입 시작: 임시 저장 + 이메일 인증번호 발송 */
export function startSignUp(payload: SignUpPayload): Promise<string> {
  return request<string>('/api/auth/signup', {
    body: {
      signUpDivision: 'EMAIL',
      myCountry: 'KR',
      ...payload,
    },
  });
}

/** 이메일 인증번호 재발송 */
export function sendEmailCode(email: string): Promise<string> {
  return request<string>('/api/auth/email/send', {
    body: { email },
  });
}

/** 이메일 인증번호 검증 + 회원가입 완료 (가입된 회원 정보 반환) */
export function verifyEmailCode(email: string, code: string): Promise<unknown> {
  return request('/api/auth/email/verify', {
    body: { email, code },
  });
}

/** [비밀번호 찾기] 가입된 이메일 확인 후 인증번호 발송 */
export function sendPasswordResetCode(email: string): Promise<string> {
  return request<string>('/api/auth/password/send-code', {
    body: { email },
  });
}

/** [비밀번호 찾기] 이메일 인증번호 확인 */
export function verifyPasswordResetCode(
  email: string,
  code: string,
): Promise<string> {
  return request<string>('/api/auth/password/verify-code', {
    body: { email, code },
  });
}

/** [비밀번호 찾기] 새 비밀번호로 변경 */
export function resetPassword(
  email: string,
  newPassword: string,
  confirmPassword: string,
): Promise<string> {
  return request<string>('/api/auth/password/reset', {
    body: { email, newPassword, confirmPassword },
  });
}

/** 여행 취향 설문 완료 처리 */
export function completeSurvey(): Promise<string> {
  return authRequest<string>('/api/users/survey-complete', { method: 'POST' });
}