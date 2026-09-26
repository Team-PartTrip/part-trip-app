import { visitedDistricts } from '../src/pages/RegionMapView/districts';

const trip = (regionCode: string, cityName: string, points: [number, number][] = []) => ({
  tripCardId: 1,
  regionCode,
  cityName,
  points,
});

test('좌표로 시 · 군 · 구를 찾는다', () => {
  const v = visitedDistricts([
    trip('48', '통영', [[34.8544, 128.4332]]),
    trip('27', '대구', [[35.8858, 128.5828]]),
    trip('11', '서울', [[37.5509, 126.8495]]),
    trip('41', '수원', [[37.2636, 127.0286]]),
  ]);
  expect([...v].sort()).toEqual(['11-강서구', '27-북구', '41-수원시', '48-통영시']);
});

test('좌표가 없으면 도는 도시 이름으로 찾고 광역시는 칠하지 않는다', () => {
  const v = visitedDistricts([trip('48', '거제시'), trip('27', '대구'), trip('36', '세종')]);
  expect([...v].sort()).toEqual(['36-세종시', '48-거제시']);
});
