import { login as kakaoSdkLogin } from '@react-native-seoul/kakao-login';

export async function signInWithKakao(): Promise<string> {
  const token = await kakaoSdkLogin();
  if (!token?.accessToken) {
    throw new Error('카카오 인증 토큰을 가져오지 못했습니다.');
  }
  return token.accessToken;
}

export function isKakaoCancelled(error: unknown): boolean {
  const message = (error as { message?: string } | null)?.message;
  return typeof message === 'string' && /cancel/i.test(message);
}
