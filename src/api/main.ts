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

export interface CountryInfo {
  countryInfoId: number;
  countryName: string;
  cityName: string;
  imageUrl: string;
  summary: string;
}

/** 여행지(국가/도시) 전체 목록 조회 (여행지 선택 화면에서 사용) */
export function getCountries(): Promise<CountryInfo[]> {
  return authRequest<CountryInfo[]>('/api/main/countries', { method: 'GET' });
}
