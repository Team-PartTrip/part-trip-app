import { authRequest } from './http';

/** D-day 카운트 조회 */
export function getDday<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/main/dday', { method: 'GET' });
}
/** 여행지 설정 */
export function setTravelDestination<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/main/travel-destination', {
    method: 'POST',
    body,
  });
}
/** 국가 정보 제공 */
export function getCountryInfo<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/main/country-info', { method: 'GET' });
}
/** 하루 암기 조회 */
export function getDailyPhrase<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/main/daily-phrase', { method: 'GET' });
}
/** 캐릭터 랭킹 조회 */
export function getCharacterRanking<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/main/character-ranking', { method: 'GET' });
}
/** 축제 이벤트 캘린더 조회 */
export function getFestivals<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/main/festivals', { method: 'GET' });
}
