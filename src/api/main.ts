import { authRequest } from './http';

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

/** 국가 상세 정보 조회 */
export function getCountryInfo(countryName: string): Promise<CountryInfo> {
  return authRequest<CountryInfo>(
    `/api/main/country-info?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}

export interface DdayInfo {
  countryName: string;
  cityName: string;
  startDate: string;
  endDate: string;
  dday: string;
}

/** 등록된 여행 일정의 D-Day 조회 (등록된 일정이 없으면 에러) */
export function getDday(): Promise<DdayInfo> {
  return authRequest<DdayInfo>('/api/main/dday', { method: 'GET' });
}

export interface TravelPlanPayload {
  countryName: string;
  cityName: string;
  startDate: string;
  endDate: string;
}

/** 여행 일정 등록 또는 수정 */
export function saveTravelPlan(payload: TravelPlanPayload): Promise<DdayInfo> {
  return authRequest<DdayInfo>('/api/main/travel-plan', {
    method: 'POST',
    body: payload,
  });
}

export interface PopulationInfo {
  nationCode: string;
  nationName: string;
  percent: number;
}

/** 국가별 인구 구성 조회 */
export function getPopulationInfo(
  countryName: string,
): Promise<PopulationInfo[]> {
  return authRequest<PopulationInfo[]>(
    `/api/main/population-info?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}

export interface TourPlace {
  placeName: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

/** 국가별 관광 장소 조회 */
export function getTourPlaces(countryName: string): Promise<TourPlace[]> {
  return authRequest<TourPlace[]>(
    `/api/main/tour-place?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}

export interface FoodInfo {
  foodName: string;
  description: string;
  imageUrl: string;
}

/** 국가별 대표 음식 조회 */
export function getFoodInfo(countryName: string): Promise<FoodInfo[]> {
  return authRequest<FoodInfo[]>(
    `/api/main/food-info?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}

export interface ExchangeRate {
  currencyCode: string;
  krwRate: number;
  date: string | null;
}

/** 국가별 환율 조회 (1 현지통화 = ? 원) */
export function getExchangeRate(countryName: string): Promise<ExchangeRate> {
  return authRequest<ExchangeRate>(
    `/api/main/exchange-rate?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}

export interface Festival {
  title: string;
  category: string;
  description: string;
  startDate: string;
  startTime: string;
  location: string;
  imageUrl: string;
}

/** 국가별 축제/이벤트 조회 */
export function getFestivals(countryName: string): Promise<Festival[]> {
  return authRequest<Festival[]>(
    `/api/main/festivals?countryName=${encodeURIComponent(countryName)}`,
    { method: 'GET' },
  );
}
