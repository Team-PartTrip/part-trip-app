import { CATEGORIES, PlaceCategory, PlanCity } from './types';

/**
 * 카테고리별 확정 장소 수 (명세 Func-005-08, 서버 #128).
 *
 * 그룹장은 카테고리마다 "이번 여행에서 몇 곳" 하나만 정한다. 서버는 도시별로
 * 받지만 확정할 때는 어차피 합으로 센다 — 투표에 도시 구분이 없다. 그래서
 * 화면은 합만 묻고, 보낼 때 도시별 머무는 일수에 비례해 나눈다.
 *
 * 나누는 데는 서버 규칙 두 개가 걸린다.
 * - 앱은 늘 cities 를 보내는데, 그러면 서버는 최상위 placeCounts 를 보지 않는다
 * - 도시마다 1 ~ 20 곳이어야 한다. 벗어나면 400 이다
 */

/** 서버 PlannerCategoryCountService.MAX_COUNT_PER_CITY */
export const MAX_PER_CITY = 20;

/** 숙소는 서버가 여행 전체 1곳으로 고정한다. 그룹장이 정하지 않는다 */
export const COUNTED_CATEGORIES: PlaceCategory[] = CATEGORIES.filter(
  category => category !== 'ACCOMMODATION',
);

/**
 * 그룹장이 안 건드렸을 때의 개수. 서버 defaultCount 와 같은 계산이다.
 * 맛집은 하루 두 곳, 나머지는 하루 한 곳.
 */
export function defaultCount(category: PlaceCategory, days: number[]): number {
  const total = days.reduce((sum, d) => sum + d, 0);
  return category === 'RESTAURANT' ? total * 2 : total;
}

/** 도시마다 1 ~ 20 곳이라 합으로는 도시 수 ~ 20 × 도시 수 */
export function countRange(cityCount: number): { min: number; max: number } {
  const n = Math.max(1, cityCount);
  return { min: n, max: n * MAX_PER_CITY };
}

export function clampCount(count: number, cityCount: number): number {
  const { min, max } = countRange(cityCount);
  return Math.min(max, Math.max(min, count));
}

/**
 * 합을 도시별로 나눈다. 머무는 일수에 비례하고, 도시마다 1 ~ 20 곳이며,
 * 나눈 값을 더하면 반드시 total 이다.
 *
 * 끝수는 소수점 아래가 큰 도시부터 준다(최대 나머지). 그냥 반올림하면 합이
 * 하나 모자라거나 넘친다.
 */
export function splitCount(total: number, days: number[]): number[] {
  const n = days.length;
  const clamped = clampCount(total, n);
  const sumDays = days.reduce((sum, d) => sum + d, 0) || n;
  const exact = days.map(d => (clamped * (d || 1)) / sumDays);
  const shares = exact.map(x =>
    Math.min(MAX_PER_CITY, Math.max(1, Math.floor(x))),
  );

  let diff = clamped - shares.reduce((sum, x) => sum + x, 0);
  // 더 줘야 하면 소수점 아래가 큰 순서로, 빼야 하면 작은 순서로
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => (diff > 0 ? b.frac - a.frac : a.frac - b.frac))
    .map(item => item.i);

  while (diff !== 0) {
    let moved = false;
    for (const i of order) {
      if (diff > 0 && shares[i] < MAX_PER_CITY) {
        shares[i] += 1;
        diff -= 1;
        moved = true;
      } else if (diff < 0 && shares[i] > 1) {
        shares[i] -= 1;
        diff += 1;
        moved = true;
      }
      if (diff === 0) {
        break;
      }
    }
    // clampCount 로 범위 안에 넣었으니 여기까지 오지 않는다. 끝없이 돌지 않게 막아둔다
    if (!moved) {
      break;
    }
  }
  return shares;
}

/** 여행 일수. 시작일과 종료일을 포함한다 */
function daysOf(city: PlanCity): number {
  const start = Date.parse(`${city.startDate}T00:00:00Z`);
  const end = Date.parse(`${city.endDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000) + 1;
}

/**
 * 그룹장이 정한 합을 도시별 placeCounts 로 붙인다.
 *
 * 건드리지 않은 카테고리는 보내지 않는다. 서버가 일수로 기본값을 계산하므로,
 * 개수를 안 정한 플래너는 이 기능이 생기기 전과 똑같이 확정된다.
 */
export function withPlaceCounts(
  cities: PlanCity[],
  totals: Partial<Record<PlaceCategory, number>>,
): (PlanCity & { placeCounts?: Partial<Record<PlaceCategory, number>> })[] {
  const touched = COUNTED_CATEGORIES.filter(c => totals[c] !== undefined);
  if (touched.length === 0) {
    return cities;
  }
  const days = cities.map(daysOf);
  const perCity = cities.map(() => ({}) as Partial<Record<PlaceCategory, number>>);
  for (const category of touched) {
    splitCount(totals[category] as number, days).forEach((share, i) => {
      perCity[i][category] = share;
    });
  }
  return cities.map((city, i) => ({ ...city, placeCounts: perCity[i] }));
}
