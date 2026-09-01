import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TokenResponse } from '../../entities/auth/api';

const ACCESS_KEY = 'parttrip.accessToken';
const REFRESH_KEY = 'parttrip.refreshToken';
const PROVIDER_KEY = 'parttrip.provider';

// 로그인·로그아웃마다 올라간다. "누가 쓰고 있는가" 를 가리키는 번호다.
// 토큰 갱신은 같은 세션이라 올리지 않는다.
//
// 오래 걸린 요청이 끝났을 때 그 사이 사용자가 바뀌었는지 알아보는 데 쓴다.
// 안 보면 갱신 응답이 뒤늦게 도착해 새로 로그인한 사람의 토큰을 덮어쓴다.
let sessionGeneration = 0;

export function getSessionGeneration(): number {
  return sessionGeneration;
}

/** 로그인 제공자 저장 ('EMAIL' | 'GOOGLE') */
export async function saveProvider(
  provider: 'EMAIL' | 'GOOGLE',
): Promise<void> {
  await AsyncStorage.setItem(PROVIDER_KEY, provider);
}

/**
 * 토큰 저장.
 *
 * 로그인이면 세션이 새로 시작되므로 세대를 올린다.
 * 토큰 갱신은 같은 사람이 계속 쓰는 것이라 올리지 않는다.
 */
export async function saveTokens(
  tokens: TokenResponse,
  options: { newSession?: boolean } = {},
): Promise<void> {
  if (options.newSession !== false) {
    sessionGeneration += 1;
  }
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
  sessionGeneration += 1;
  await AsyncStorage.removeMany([ACCESS_KEY, REFRESH_KEY, PROVIDER_KEY]);
}
