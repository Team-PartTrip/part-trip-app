// 국가 획득 축하 화면(E3) 전용 예시 데이터.
//
// 지도·달성 현황·국가별 기록은 서버(api.ts)로 붙였다. 축하 화면만 남았는데,
// POST /api/world-map/countries 가 { countryCode, isNew } 만 돌려줘서
// 이 화면이 필요한 값(몇 번째 획득인지 · 획득일 · 대륙 달성 수)을 채울 수 없다.
// 서버가 그 값을 주기 시작하면 이 파일을 지운다.

import { CountryAcquiredParams } from './types';

const COUNTRIES: CountryAcquiredParams[] = [
  {
    countryInfoId: 1,
    countryName: '일본',
    countryNameEn: 'Japan',
    countryCode: 'JP',
    continentName: '아시아',
    continentVisited: 4,
    continentTotal: 48,
    acquiredAt: '2024-03-12',
    cityName: '오사카',
    visitCount: 3,
    order: 1,
  },
  {
    countryInfoId: 2,
    countryName: '대만',
    countryNameEn: 'Taiwan',
    countryCode: 'TW',
    continentName: '아시아',
    continentVisited: 4,
    continentTotal: 48,
    acquiredAt: '2024-11-04',
    cityName: '타이베이',
    visitCount: 1,
    order: 2,
  },
  {
    countryInfoId: 3,
    countryName: '베트남',
    countryNameEn: 'Vietnam',
    countryCode: 'VN',
    continentName: '아시아',
    continentVisited: 4,
    continentTotal: 48,
    acquiredAt: '2026-06-18',
    cityName: '다낭',
    visitCount: 1,
    order: 3,
  },
];

/** COUNTRY_ACQUIRED 알림에서 E3 로 넘길 값을 만든다 */
export function sampleAcquiredParamsOf(
  countryInfoId: number | null,
): CountryAcquiredParams {
  const country =
    COUNTRIES.find(c => c.countryInfoId === countryInfoId) ?? COUNTRIES[0];
  return { ...country };
}
