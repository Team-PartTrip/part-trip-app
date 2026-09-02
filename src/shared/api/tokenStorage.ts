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

/**
 * 저장과 삭제를 한 줄로 세운다.
 *
 * setMany 와 removeMany 는 각각 별개의 네이티브 작업이라 호출 순서가
 * 끝나는 순서를 보장하지 않는다. 로그아웃 도중 저장이 늦게 끝나면
 * 지워진 자리에 토큰이 되살아난다.
 */
let writeQueue: Promise<unknown> = Promise.resolve();

function serialize<T>(job: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(job, job);
  // 앞 작업이 실패해도 뒤가 막히면 안 된다
  writeQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
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
  options: { newSession?: boolean; generation?: number } = {},
): Promise<void> {
  const newSession = options.newSession !== false;
  await serialize(async () => {
    if (newSession) {
      sessionGeneration += 1;
    } else if (
      options.generation !== undefined &&
      options.generation !== sessionGeneration
    ) {
      // 갱신 결과인데 기다리는 사이 세션이 바뀌었다. 지금 쓰는 사람의
      // 토큰을 옛 것으로 덮지 않는다.
      return;
    }
    await AsyncStorage.setMany({
      [ACCESS_KEY]: tokens.accessToken,
      [REFRESH_KEY]: tokens.refreshToken,
    });
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
  await serialize(async () => {
    sessionGeneration += 1;
    await AsyncStorage.removeMany([ACCESS_KEY, REFRESH_KEY, PROVIDER_KEY]);
  });
}
