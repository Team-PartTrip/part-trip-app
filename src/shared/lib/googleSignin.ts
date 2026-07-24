import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Google Cloud Console에서 발급한 OAuth 클라이언트 ID
export const GOOGLE_WEB_CLIENT_ID =
  '435960620705-5uibarcji65pchitd8febbesrfgeel55.apps.googleusercontent.com';
export const GOOGLE_IOS_CLIENT_ID =
  '435960620705-3b0jrp59qdl7ek72q8m9sektthfuuths.apps.googleusercontent.com';

/** 로그인 화면 진입 시 1회 호출 */
export function configureGoogleSignin() {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID, // 백엔드가 검증할 idToken의 audience
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    offlineAccess: true,
  });
}

/** 구글 로그인 → idToken 반환 */
export async function signInWithGoogle(): Promise<string> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const res: any = await GoogleSignin.signIn();
  const idToken = res?.data?.idToken ?? res?.idToken;
  if (!idToken) {
    throw new Error('Google 인증 토큰을 가져오지 못했습니다.');
  }
  return idToken;
}
