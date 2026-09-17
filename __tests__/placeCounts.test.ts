// 카테고리별 확정 장소 수를 도시별로 나누는 계산. 서버는 도시마다 1 ~ 20 곳을
// 요구하고 확정할 때 합을 쓴다. 나눈 값이 범위를 벗어나면 400, 합이 틀리면
// 그룹장이 정한 것과 다른 수가 확정된다.

import {
  clampCount,
  countRange,
  defaultCount,
  splitCount,
  withPlaceCounts,
} from '../src/entities/planner/placeCounts';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

test('기본값은 서버 계산과 같다 — 맛집은 하루 두 곳, 나머지는 한 곳', () => {
  expect(defaultCount('RESTAURANT', [3, 2])).toBe(10);
  expect(defaultCount('ATTRACTION', [3, 2])).toBe(5);
});

test('나눈 합은 늘 정한 수와 같고 도시마다 1 ~ 20 곳이다', () => {
  const cases: [number, number[]][] = [
    [6, [3, 2]],
    [7, [1, 1, 1]],
    [3, [5, 1, 1]],
    [40, [2, 2]],
    [23, [10, 1]],
    [2, [1, 1]],
  ];
  for (const [total, days] of cases) {
    const shares = splitCount(total, days);
    expect(sum(shares)).toBe(total);
    shares.forEach(x => {
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(20);
    });
  }
});

test('머무는 날이 긴 도시에 더 준다', () => {
  expect(splitCount(10, [3, 2])).toEqual([6, 4]);
  expect(splitCount(5, [4, 1])).toEqual([4, 1]);
});

test('기본값을 그대로 나누면 도시별 기본값이 된다', () => {
  // 안 건드린 값을 보내더라도 서버 기본 계산과 어긋나지 않는다
  expect(splitCount(defaultCount('RESTAURANT', [3, 2]), [3, 2])).toEqual([6, 4]);
});

test('범위를 벗어난 합은 도시 수 ~ 20 × 도시 수 로 잘린다', () => {
  expect(countRange(3)).toEqual({ min: 3, max: 60 });
  expect(clampCount(1, 3)).toBe(3);
  expect(clampCount(99, 2)).toBe(40);
  expect(sum(splitCount(1, [1, 1, 1]))).toBe(3);
});

test('건드리지 않은 카테고리는 보내지 않는다', () => {
  const cities = [
    { countryName: '일본', cityName: '오사카', startDate: '2026-10-01', endDate: '2026-10-03' },
    { countryName: '일본', cityName: '교토', startDate: '2026-10-04', endDate: '2026-10-05' },
  ];
  expect(withPlaceCounts(cities, {})).toBe(cities);

  const sent = withPlaceCounts(cities, { RESTAURANT: 5 });
  expect(sent[0].placeCounts).toEqual({ RESTAURANT: 3 });
  expect(sent[1].placeCounts).toEqual({ RESTAURANT: 2 });
});
