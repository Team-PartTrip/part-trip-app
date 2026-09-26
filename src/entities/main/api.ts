import { authRequest } from '../../shared/api/http';
import type { ScheduleSlot } from '../planner/api';

/** 첫 화면 상태. 문구는 이걸 보고 앱이 정한다 (서버 #141) */
export type TripPhase = 'NO_TRIP' | 'BEFORE' | 'DURING' | 'ENDED';

/**
 * 등록된 여행 일정이 없으면 서버가 에러 대신 모든 값이 null 이고
 * status 가 'NO_TRIP' 인 응답을 내려준다.
 * (TravelPlanService.getDday 참고) — 그래서 날짜까지 null 이 될 수 있다.
 */
export interface DdayInfo {
  regionName: string | null;
  cityName: string | null;
  startDate: string | null;
  endDate: string | null;
  /** 여행 그룹 인원. 일정이 없으면 null */
  headcount: number | null;
  dday: string;
  status?: TripPhase;
  todaySchedule?: ScheduleSlot[];
}

/** D-Day 조회. 일정이 없으면 status 가 'NO_TRIP' 인 응답이 온다 */
export function getDday(): Promise<DdayInfo> {
  return authRequest<DdayInfo>('/api/main/dday', { method: 'GET' });
}

// 여행 일정 등록(POST /api/main/travel-plan)은 쓰지 않는다.
// 여행지 · 기간은 플래너(Func-005-02)에서만 정한다.

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

export interface MoreTourPlaces {
  /** 새로 받은 장소만 온다. 이미 있던 곳은 빠진다 */
  places: TourPlace[];
  /** 다음에 그대로 보낼 값. null 이면 구글이 더 줄 게 없다 */
  cursor: string | null;
}

export function getMoreTourPlaces(
  countryName: string,
  cityName: string,
  category: TourPlaceCategory,
  cursor: string | null,
): Promise<MoreTourPlaces> {
  const params = new URLSearchParams({ countryName, cityName, category });
  if (cursor) {
    params.append('cursor', cursor);
  }
  return authRequest<MoreTourPlaces>(
    `/api/main/tour-place/more?${params.toString()}`,
    { method: 'GET' },
  );
}

export interface CountryInfo {
  /** DB 에 있는 여행지면 id 가 있고, ISO 목록에서만 온 나라는 null */
  countryInfoId: number | null;
  countryName: string;
  /** 그 나라의 대표 도시(수도). ISO 에서만 온 나라는 null */
  cityName: string | null;
  imageUrl: string | null;
  summary: string | null;
}

/**
 * 나라 · 도시 검색 (API-002-03).
 *
 * 인기 여행지(popular-cities)는 관광지 데이터가 있는 도시만 준다. 지금은
 * 다섯 곳뿐이라 그 안에서 거르면 "파리" 를 쳐도 아무것도 안 나온다.
 * 이 API 는 DB 의 여행지 247곳에 ISO 전체 국가를 얹어서 찾아준다.
 *
 * 검색어를 주면 20개까지만 온다.
 */
export function getCountries(keyword: string): Promise<CountryInfo[]> {
  return authRequest<CountryInfo[]>(
    `/api/main/countries?keyword=${encodeURIComponent(keyword)}`,
    { method: 'GET' },
  );
}

export interface City {
  cityName: string;
  countryName: string;
  regionName?: string | null;
}

/**
 * 도시 검색.
 *
 * countries 는 나라당 대표 도시(수도) 하나만 준다. 오사카·교토처럼 수도가
 * 아닌 도시는 여기서 찾는다. 서버가 구글 자동완성을 대신 불러준다.
 *
 * countryName 을 주면 그 나라 안에서만 찾는다. 생략하면 전 세계에서 찾는다.
 * 두 글자 미만이면 서버가 빈 목록을 준다. 요청마다 돈이 나가서다.
 */
export function getCities(
  keyword: string,
  countryName?: string,
): Promise<City[]> {
  const params = new URLSearchParams({ keyword });
  if (countryName) {
    params.append('countryName', countryName);
  }
  return authRequest<City[]>(`/api/main/cities?${params.toString()}`, {
    method: 'GET',
  });
}

export interface Festival {
  festivalId: number;
  title: string;
  category: string;
  description: string;
  startDate: string;
  /** 하루짜리면 null */
  endDate: string | null;
  /** 시작 시각 정해지지 않은 축제가 많다 */
  startTime: string | null;
  location: string;
  /** 확보한 이미지가 없으면 null */
  imageUrl: string | null;
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
