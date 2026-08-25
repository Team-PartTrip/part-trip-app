import { authRequest } from '../../shared/api/http';

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

/**
 * 등록된 여행 일정이 없으면 서버가 에러 대신
 * 모든 값이 null 이고 dday 만 "쉬는 중" 인 응답을 내려준다.
 * (TravelPlanService.getDday 참고) — 그래서 날짜까지 null 이 될 수 있다.
 */
export interface DdayInfo {
  countryName: string | null;
  cityName: string | null;
  startDate: string | null;
  endDate: string | null;
  /** 여행 그룹 인원. 일정이 없으면 null */
  headcount: number | null;
  dday: string;
}

/** D-Day 조회. 일정이 없으면 "쉬는 중" 응답이 온다 */
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



export interface TourPlace {
  tourPlaceId: number;
  placeName: string;
  /** 맛집 / 명소 / 숙소 / 카페 / 액티비티 / 쇼핑. 미분류면 null */
  category: string | null;
  description: string | null;
  address: string | null;
  /** 데이터 소스에 평점이 없으면 null */
  rating: number | null;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
}

/** 관광 장소 카테고리. 서버는 한글·영문키를 모두 받는다 */
export type TourPlaceCategory =
  | '맛집'
  | '명소'
  | '숙소'
  | '카페'
  | '액티비티'
  | '쇼핑';

/**
 * 관광 장소 조회
 * cityName, category 는 선택. 생략하면 해당 국가 전체를 반환한다.
 */
export function getTourPlaces(
  countryName: string,
  options?: { cityName?: string; category?: TourPlaceCategory },
): Promise<TourPlace[]> {
  const params = new URLSearchParams({ countryName });

  if (options?.cityName) {
    params.append('cityName', options.cityName);
  }
  if (options?.category) {
    params.append('category', options.category);
  }

  return authRequest<TourPlace[]>(`/api/main/tour-place?${params.toString()}`, {
    method: 'GET',
  });
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

/**
 * 축제/이벤트 조회
 *
 * 서버는 year, month 를 생략하면 '조회 시점의 월' 만 돌려준다.
 * 다른 달을 보려면 반드시 year, month 를 함께 넘겨야 한다.
 */
export function getFestivals(
  countryName: string,
  options?: { year?: number; month?: number },
): Promise<Festival[]> {
  const params = new URLSearchParams({ countryName });

  if (options?.year != null) {
    params.append('year', String(options.year));
  }
  if (options?.month != null) {
    params.append('month', String(options.month));
  }

  return authRequest<Festival[]>(`/api/main/festivals?${params.toString()}`, {
    method: 'GET',
  });
}
