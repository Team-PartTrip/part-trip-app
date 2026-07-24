import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TokenResponse } from '../../entities/auth/api';

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

/** JWT payload(가운데 segment)를 디코딩해서 커스텀 클레임을 꺼냄 (외부 라이브러리 없이 직접 구현) */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const clean = payload.replace(/-/g, '+').replace(/_/g, '/');

    let output = '';
    let buffer = 0;
    let bits = 0;
    for (let i = 0; i < clean.length; i++) {
      const value = chars.indexOf(clean[i]);
      if (value === -1) continue;
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
        bits -= 8;
        output += String.fromCharCode((buffer >> bits) & 0xff);
      }
    }

    return JSON.parse(output);
  } catch {
    return null;
  }
}

/** 액세스 토큰에서 현재 로그인한 사용자의 userId를 꺼냄 (서버가 'userId' 클레임에 저장) */
export async function getCurrentUserId(): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const userId = payload?.userId;
  return typeof userId === 'string' ? userId : null;
}

/** 액세스 토큰에서 현재 로그인한 사용자의 이메일을 꺼냄 (서버가 JWT의 subject로 저장) */
export async function getCurrentUserEmail(): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const email = payload?.sub;
  return typeof email === 'string' ? email : null;
}