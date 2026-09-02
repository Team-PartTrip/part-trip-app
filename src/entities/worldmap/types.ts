// 세계지도(Func-009) 타입.
//
// 서버 worldmap DTO 에 맞춰둔다. 서버가 안 주는 값을 여기 적어두면
// 화면이 있는 것처럼 쓰게 되므로 넣지 않는다.

export type ContinentCode = 'AS' | 'EU' | 'NA' | 'SA' | 'OC' | 'AF';

export interface Continent {
  code: ContinentCode;
  name: string;
  /** 획득한 국가 수 */
  visited: number;
  /** 그 대륙의 전체 국가 수 */
  total: number;
}

/**
 * 지도에 채워진 국가.
 *
 * 서버 WorldMapResponseDto.visited 가 이름과 코드만 준다. 방문 횟수·도시·
 * 여행 목록은 국가를 열 때 getCountryHistory 로 따로 받는다.
 */
export interface VisitedCountry {
  /** ISO 3166-1 alpha-2. 서버 CountryCodeMapper 가 쓰는 코드와 같다 */
  countryCode: string;
  countryName: string;
}

export interface WorldMapSummary {
  visitedCount: number;
  totalCount: number;
  continents: Continent[];
  countries: VisitedCountry[];
}

/** 국가별 여행 기록 한 건 (E4) */
export interface CountryTripRecord {
  recordId: number;
  title: string;
  cityName: string;
  /** 여행 시작일 YYYY-MM-DD */
  visitedAt: string;
  /** 여행 종료일 YYYY-MM-DD */
  endedAt: string;
  photoCount: number;
}

/** 국가 획득 축하 화면(E3) 에 필요한 값 */
export interface CountryAcquiredParams {
  countryInfoId: number;
  countryName: string;
  countryNameEn: string;
  countryCode: string;
  /** 몇 번째로 획득한 국가인지 */
  order: number;
  /** YYYY-MM-DD */
  acquiredAt: string;
  /** 획득의 근거가 된 여행 기록의 도시 */
  cityName: string;
  visitCount: number;
  continentName: string;
  /** 그 대륙에서 획득한 국가 수 / 전체 국가 수 */
  continentVisited: number;
  continentTotal: number;
}

/** "JP" → 🇯🇵 — 국기 이미지 없이 유니코드 지역표시 기호로 만든다 */
export function flagOf(countryCode: string): string {
  if (countryCode.length !== 2) {
    return '🏳️';
  }
  const base = 0x1f1e6 - 'A'.charCodeAt(0);
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split('')
      .map(c => base + c.charCodeAt(0)),
  );
}

/** "2026-08-21" → "2026.08.21" */
export function formatDate(date: string | null): string {
  return date ? date.replace(/-/g, '.') : '-';
}

/** "2026-08-23", "2026-08-27" → "2026.08.23 – 08.27" (해가 넘어가면 연도를 남긴다) */
export function formatDateRange(start: string, end: string): string {
  const from = start.split('-');
  const to = end.split('-');
  return `${from.join('.')} – ${(from[0] === to[0] ? to.slice(1) : to).join('.')}`;
}

/** 받침 유무에 따라 목적격 조사를 고른다. "일본" → "을", "대만" → "을", "프랑스" → "를" */
export function objectParticle(word: string): string {
  const last = word.charCodeAt(word.length - 1);
  // 한글 음절이 아니면 판단할 수 없으니 둘 다 적는다
  if (Number.isNaN(last) || last < 0xac00 || last > 0xd7a3) {
    return '을(를)';
  }
  return (last - 0xac00) % 28 === 0 ? '를' : '을';
}
