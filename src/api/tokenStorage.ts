import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TokenResponse } from './auth';

const ACCESS_KEY = 'parttrip.accessToken';
const REFRESH_KEY = 'parttrip.refreshToken';
const PROVIDER_KEY = 'parttrip.provider';

/** 로그인 제공자 저장 ('EMAIL' | 'GOOGLE') */
export async function saveProvider(
  provider: 'EMAIL' | 'GOOGLE',
): Promise<void> {
  await AsyncStorage.setItem(PROVIDER_KEY, provider);
}

/** 저장된 로그인 제공자 조회 */
export async function getProvider(): Promise<string | null> {
  return AsyncStorage.getItem(PROVIDER_KEY);
}

/** 로그인 성공 시 토큰 저장 */
export async function saveTokens(tokens: TokenResponse): Promise<void> {
  await AsyncStorage.setMany({
    [ACCESS_KEY]: tokens.accessToken,
    [REFRESH_KEY]: tokens.refreshToken,
  });
}

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_KEY);
}

/** 로그아웃 시 토큰 제거 */
export async function clearTokens(): Promise<void> {
  await AsyncStorage.removeMany([ACCESS_KEY, REFRESH_KEY, PROVIDER_KEY]);
}
