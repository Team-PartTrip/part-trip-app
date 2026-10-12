import {
  login as kakaoSdkLogin,
  logout as kakaoSdkLogout,
} from '@react-native-seoul/kakao-login';

export async function signInWithKakao(): Promise<string> {
  const token = await kakaoSdkLogin();
  if (!token?.accessToken) {
    throw new Error('카카오 로그인을 마치지 못했어요. 다시 시도해주세요.');
  }
  return token.accessToken;
}

export function isKakaoCancelled(error: unknown): boolean {
  const message = (error as { message?: string } | null)?.message;
  return typeof message === 'string' && /cancel/i.test(message);
}

export async function signOutKakao(): Promise<void> {
  await kakaoSdkLogout().catch(() => {});
}
