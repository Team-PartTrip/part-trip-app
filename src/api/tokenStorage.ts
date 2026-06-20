import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TokenResponse } from './auth';

const ACCESS_KEY = 'parttrip.accessToken';
const REFRESH_KEY = 'parttrip.refreshToken';

/** 로그인 성공 시 토큰 저장 */
export async function saveTokens(tokens: TokenResponse): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, tokens.accessToken],
    [REFRESH_KEY, tokens.refreshToken],
  ]);
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY);
}

/** 로그아웃 시 토큰 제거 */
export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
}
