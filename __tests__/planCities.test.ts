// 도시별 일수를 날짜로 펴는 계산만 본다.
//
// 서버는 도시별 기간이 여행 기간을 빈틈 없이 이어 덮는지 보고, 하루라도
// 비면 400 을 준다. 여기서 틀리면 사용자가 그 400 을 본다.
import { toCities } from '../src/pages/PlannerScreen/PlanCitiesView';

test('일수를 이어지는 날짜 구간으로 편다', () => {
  const cities = toCities(
    [
      { countryName: '일본', cityName: '오사카', days: 3 },
      { countryName: '일본', cityName: '교토', days: 2 },
    ],
    '2026-08-23',
  );

  expect(cities).toEqual([
    {
      countryName: '일본',
      cityName: '오사카',
      startDate: '2026-08-23',
      endDate: '2026-08-25',
    },
    {
      countryName: '일본',
      cityName: '교토',
      startDate: '2026-08-26',
      endDate: '2026-08-27',
    },
  ]);
});

test('앞 도시의 끝 다음 날에 다음 도시가 시작한다 - 빈틈이 생길 수 없다', () => {
  const cities = toCities(
    [
      { countryName: '일본', cityName: '도쿄', days: 1 },
      { countryName: '일본', cityName: '하코네', days: 1 },
      { countryName: '일본', cityName: '오사카', days: 1 },
    ],
    '2026-08-23',
  );

  cities.slice(1).forEach((city, i) => {
    const prevEnd = Date.parse(`${cities[i].endDate}T00:00:00Z`);
    const start = Date.parse(`${city.startDate}T00:00:00Z`);
    expect(start - prevEnd).toBe(86_400_000);
  });
});

test('달을 넘어가도 맞다', () => {
  const cities = toCities(
    [
      { countryName: '일본', cityName: '오사카', days: 2 },
      { countryName: '일본', cityName: '교토', days: 2 },
    ],
    '2026-08-30',
  );

  expect(cities[0].endDate).toBe('2026-08-31');
  expect(cities[1].startDate).toBe('2026-09-01');
  expect(cities[1].endDate).toBe('2026-09-02');
});
