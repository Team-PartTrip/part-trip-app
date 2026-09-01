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

/** 저장된 로그인 제공자 조회 */
export async function getProvider(): Promise<string | null> {
  return AsyncStorage.getItem(PROVIDER_KEY);
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