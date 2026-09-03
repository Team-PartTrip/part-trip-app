// 세계지도(Func-009) API.
//
// 서버 worldmap 패키지의 DTO 를 그대로 옮겼다. 화면이 원하는 모양으로
// 미리 바꿔두면 서버가 안 주는 값을 있는 것처럼 쓰게 된다.
// 모양을 맞추는 일은 toSummary 같은 변환 함수에서만 한다.

import { authRequest } from '../../shared/api/http';
import type { Continent, ContinentCode, WorldMapSummary } from './types';

/** 서버 worldmap/enums/Continent */
export type ServerContinent =
  | 'AFRICA'
  | 'ASIA'
  | 'EUROPE'
  | 'NORTH_AMERICA'
  | 'SOUTH_AMERICA'
  | 'OCEANIA'
  | 'ANTARCTICA'
  | 'OTHER';

/** 서버가 주는 방문 국가. 이름과 코드뿐이다 */
export interface VisitedCountryResponse {
  countryCode: string;
  countryName: string;
}

export interface WorldMapResponse {
  totalCountries: number;
  visited: VisitedCountryResponse[];
}

/** 지도에 채워진 국가 목록 (API-006-01) */
export function getWorldMap(): Promise<WorldMapResponse> {
  return authRequest<WorldMapResponse>('/api/world-map', { method: 'GET' });
}

export interface ContinentStats {
  continent: ServerContinent;
  acquiredCount: number;
  totalCount: number;
}

export interface WorldMapStats {
  acquiredCount: number;
  totalCount: number;
  /** 서버가 BigDecimal 로 내려준다. JSON 에서는 숫자 */
  percentage: number;
  byContinent: ContinentStats[];
}

/** 대륙별 달성률 (API-006-04) */
export function getWorldMapStats(): Promise<WorldMapStats> {
  return authRequest<WorldMapStats>('/api/world-map/stats', { method: 'GET' });
}

export interface CountryTrip {
  tripCardId: number;
  cityName: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
}

export interface CountryTravelHistory {
  countryCode: string;
  countryName: string;
  visitCount: number;
  cities: string[];
  trips: CountryTrip[];
}

/** 국가별 여행 기록 (API-006-03) */
export function getCountryHistory(
  countryCode: string,
): Promise<CountryTravelHistory> {
  return authRequest<CountryTravelHistory>(
    `/api/world-map/countries/${encodeURIComponent(countryCode)}`,
    { method: 'GET' },
  );
}

export interface CountryAcquired {
  countryCode: string;
  isNew: boolean;
}

/** 여행 카드로 국가 획득 (API-006-02) */
export function acquireCountry(tripId: number): Promise<CountryAcquired> {
  return authRequest<CountryAcquired>('/api/world-map/countries', {
    method: 'POST',
    body: { tripId },
  });
}

// ── 화면 모양으로 바꾸기 ────────────────────────────────────

/** 서버 enum → 화면이 쓰는 두 글자 코드. 남극·기타는 화면에 칸이 없다 */
const CONTINENT_CODE: Partial<Record<ServerContinent, ContinentCode>> = {
  ASIA: 'AS',
  EUROPE: 'EU',
  NORTH_AMERICA: 'NA',
  SOUTH_AMERICA: 'SA',
  OCEANIA: 'OC',
  AFRICA: 'AF',
};

const CONTINENT_NAME: Record<ContinentCode, string> = {
  AS: '아시아',
  EU: '유럽',
  NA: '북아메리카',
  SA: '남아메리카',
  OC: '오세아니아',
  AF: '아프리카',
};

/** 화면이 쓰는 순서. 서버가 안 준 대륙도 0 으로 자리를 채운다 */
const CONTINENT_ORDER: ContinentCode[] = ['AS', 'EU', 'NA', 'SA', 'OC', 'AF'];

/**
 * 지도 + 통계를 한 번에 받아 화면이 쓰는 모양으로 만든다.
 *
 * 서버는 국가별 방문 횟수·첫 방문일을 목록에 담아주지 않는다.
 * 그 값이 필요한 화면은 getCountryHistory 로 따로 받아야 한다.
 */
export async function getSummary(): Promise<WorldMapSummary> {
  const [map, stats] = await Promise.all([getWorldMap(), getWorldMapStats()]);

  const statsByCode = new Map<ContinentCode, ContinentStats>();
  stats.byContinent.forEach(item => {
    const code = CONTINENT_CODE[item.continent];
    if (code) {
      statsByCode.set(code, item);
    }
  });

  const continents: Continent[] = CONTINENT_ORDER.map(code => ({
    code,
    name: CONTINENT_NAME[code],
    visited: statsByCode.get(code)?.acquiredCount ?? 0,
    total: statsByCode.get(code)?.totalCount ?? 0,
  }));

  return {
    visitedCount: stats.acquiredCount,
    totalCount: stats.totalCount || map.totalCountries,
    continents,
    countries: map.visited.map(country => ({
      countryCode: country.countryCode,
      countryName: country.countryName,
    })),
  };
}
