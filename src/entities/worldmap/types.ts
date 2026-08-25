// 세계지도(Func-009) 타입.
//
// 서버 API 는 아직 없다(이슈 #67). 필드 이름은 서버의
// VisitedCountryEntity / CountryInfoEntity 를 그대로 따라가서,
// 나중에 엔드포인트가 생기면 화면 수정 없이 붙일 수 있게 했다.

export type ContinentCode = 'AS' | 'EU' | 'NA' | 'SA' | 'OC' | 'AF';

export interface Continent {
  code: ContinentCode;
  name: string;
  /** 획득한 국가 수 */
  visited: number;
  /** 그 대륙의 전체 국가 수 */
  total: number;
}

export interface VisitedCountry {
  countryInfoId: number;
  countryName: string;
  /** 영문 국가명. E3 가 "일본 (Japan)" 처럼 같이 보여준다 */
  countryNameEn: string;
  /** ISO 3166-1 alpha-2. 서버 CountryCodeMapper 가 쓰는 코드와 같다 */
  countryCode: string;
  continent: ContinentCode;
  /** YYYY-MM-DD */
  firstVisitedAt: string;
  lastVisitedAt: string | null;
  visitCount: number;
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
