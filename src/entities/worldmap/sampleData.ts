// 세계지도 API(#67) 가 나오기 전까지 화면 확인용으로 쓰는 예시 데이터.
// 엔드포인트가 생기면 이 파일을 지우고 api.ts 호출로 바꾸면 된다.

import {
  Continent,
  CountryAcquiredParams,
  CountryTripRecord,
  VisitedCountry,
  WorldMapSummary,
} from './types';

// 피그마 E5 의 수치(아시아 4 / 유럽 1, 나머지 0)에 맞춰둔다
const CONTINENTS: Continent[] = [
  { code: 'AS', name: '아시아', visited: 4, total: 48 },
  { code: 'EU', name: '유럽', visited: 1, total: 44 },
  { code: 'NA', name: '북아메리카', visited: 0, total: 23 },
  { code: 'SA', name: '남아메리카', visited: 0, total: 12 },
  { code: 'OC', name: '오세아니아', visited: 0, total: 14 },
  { code: 'AF', name: '아프리카', visited: 0, total: 54 },
];

const COUNTRIES: VisitedCountry[] = [
  {
    countryInfoId: 1,
    countryName: '일본',
    countryNameEn: 'Japan',
    countryCode: 'JP',
    continent: 'AS',
    firstVisitedAt: '2024-03-12',
    lastVisitedAt: '2026-08-02',
    visitCount: 3,
  },
  {
    countryInfoId: 2,
    countryName: '대만',
    countryNameEn: 'Taiwan',
    countryCode: 'TW',
    continent: 'AS',
    firstVisitedAt: '2024-11-04',
    lastVisitedAt: '2024-11-11',
    visitCount: 1,
  },
  {
    countryInfoId: 3,
    countryName: '태국',
    countryNameEn: 'Thailand',
    countryCode: 'TH',
    continent: 'AS',
    firstVisitedAt: '2025-01-20',
    lastVisitedAt: '2025-01-27',
    visitCount: 1,
  },
  {
    countryInfoId: 4,
    countryName: '프랑스',
    countryNameEn: 'France',
    countryCode: 'FR',
    continent: 'EU',
    firstVisitedAt: '2025-06-08',
    lastVisitedAt: '2025-06-19',
    visitCount: 1,
  },
  {
    countryInfoId: 5,
    countryName: '싱가포르',
    countryNameEn: 'Singapore',
    countryCode: 'SG',
    continent: 'AS',
    firstVisitedAt: '2026-02-14',
    lastVisitedAt: null,
    visitCount: 1,
  },
];

export const sampleSummary: WorldMapSummary = {
  visitedCount: COUNTRIES.length,
  totalCount: CONTINENTS.reduce((sum, c) => sum + c.total, 0),
  continents: CONTINENTS,
  countries: COUNTRIES,
};

const RECORDS_BY_COUNTRY: Record<number, CountryTripRecord[]> = {
  1: [
    {
      recordId: 11,
      title: '오사카 먹방 여행',
      cityName: '오사카',
      visitedAt: '2026-08-02',
      endedAt: '2026-08-06',
      photoCount: 42,
    },
    {
      recordId: 12,
      title: '교토 단풍 보러',
      cityName: '교토',
      visitedAt: '2025-11-18',
      endedAt: '2025-11-22',
      photoCount: 28,
    },
    {
      recordId: 13,
      title: '첫 해외여행, 도쿄',
      cityName: '도쿄',
      visitedAt: '2024-03-12',
      endedAt: '2024-03-16',
      photoCount: 61,
    },
  ],
  2: [
    {
      recordId: 21,
      title: '타이베이 야시장',
      cityName: '타이베이',
      visitedAt: '2024-11-04',
      endedAt: '2024-11-07',
      photoCount: 35,
    },
  ],
  3: [
    {
      recordId: 31,
      title: '방콕 야시장 투어',
      cityName: '방콕',
      visitedAt: '2025-01-20',
      endedAt: '2025-01-27',
      photoCount: 47,
    },
  ],
  4: [
    {
      recordId: 41,
      title: '파리 미술관 순례',
      cityName: '파리',
      visitedAt: '2025-06-08',
      endedAt: '2025-06-19',
      photoCount: 88,
    },
  ],
  5: [],
};

export function sampleRecordsOf(countryInfoId: number): CountryTripRecord[] {
  return RECORDS_BY_COUNTRY[countryInfoId] ?? [];
}

export function sampleCountryOf(
  countryInfoId: number,
): VisitedCountry | undefined {
  return COUNTRIES.find(c => c.countryInfoId === countryInfoId);
}

/** COUNTRY_ACQUIRED 알림에서 E3 로 넘길 값을 만든다 */
export function sampleAcquiredParamsOf(
  countryInfoId: number | null,
): CountryAcquiredParams {
  const country =
    COUNTRIES.find(c => c.countryInfoId === countryInfoId) ?? COUNTRIES[0];
  const continent = CONTINENTS.find(c => c.code === country.continent);
  const records = sampleRecordsOf(country.countryInfoId);
  return {
    countryInfoId: country.countryInfoId,
    countryName: country.countryName,
    countryNameEn: country.countryNameEn,
    countryCode: country.countryCode,
    order: COUNTRIES.indexOf(country) + 1,
    acquiredAt: country.firstVisitedAt,
    // 가장 최근 기록의 도시를 획득 근거로 보여준다
    cityName: records[0]?.cityName ?? '-',
    visitCount: country.visitCount,
    continentName: continent?.name ?? '-',
    continentVisited: continent?.visited ?? 0,
    continentTotal: continent?.total ?? 0,
  };
}
