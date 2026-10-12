// 우리 여행 계획(Func-005-06)은 확정 전후로 같은 화면이다. 확정됐는지를
// 틀리게 보면 일정표가 안 나오고, 날짜 묶기가 틀리면 장소가
// 엉뚱한 날에 붙거나 빠진다.

jest.mock('@react-navigation/native', () => ({ useFocusEffect: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'View' }));

import { dayLabel } from '../src/entities/planner/types';
import { dayOrigins } from '../src/pages/PlannerScreen/ScheduleDays';
import {
  filledCount,
  groupByDay,
  isSchedule,
} from '../src/pages/PlannerScreen/PlanStatusView';
import type { ConfirmedPlace } from '../src/entities/planner/api';

function place(id: number, visitedDate?: string): ConfirmedPlace {
  return {
    category: 'RESTAURANT',
    categoryLabel: '맛집',
    tourPlaceId: id,
    placeName: `장소${id}`,
    imageUrl: null,
    address: null,
    rating: null,
    visitedDate,
  };
}

test('확정 이후 상태에서만 일정표가 된다', () => {
  expect(isSchedule('PLANNING')).toBe(false);
  expect(isSchedule('VOTING')).toBe(false);
  expect(isSchedule('CONFIRMED')).toBe(true);
  expect(isSchedule('TRAVELING')).toBe(true);
  expect(isSchedule('DONE')).toBe(true);
});

test('날짜가 하나도 없으면 묶지 않는다', () => {
  const days = groupByDay([place(1), place(2)], '2026-10-01');
  expect(days).toHaveLength(1);
  expect(days[0].label).toBeNull();
  expect(days[0].places).toHaveLength(2);
});

test('날짜별로 묶고 순서대로 몇일차를 붙인다', () => {
  const days = groupByDay(
    [place(1, '2026-10-02'), place(2, '2026-10-01'), place(3, '2026-10-02')],
    '2026-10-01',
  );
  expect(days.map(d => d.label)).toEqual(['1일차 · 10.01', '2일차 · 10.02']);
  expect(days[1].places.map(p => p.tourPlaceId)).toEqual([1, 3]);
});

test('날짜가 빠진 장소는 사라지지 않고 첫날에 붙는다', () => {
  const days = groupByDay([place(1, '2026-10-02'), place(2)], '2026-10-01');
  expect(days[0].label).toBe('1일차 · 10.01');
  expect(days[0].places.map(p => p.tourPlaceId)).toEqual([2]);
});

test('며칠차 제목은 시작일부터 센다', () => {
  expect(dayLabel('2026-10-01', '2026-10-01')).toBe('1일차 · 10.01');
  expect(dayLabel('2026-10-01', '2026-10-03')).toBe('3일차 · 10.03');
});

test('빈 칸은 확정할 장소로 세지 않는다', () => {
  const spot = {
    tourPlaceId: 1,
    name: '경포대',
    category: null,
    categoryLabel: null,
    imageUrl: null,
    address: null,
    rating: null,
    latitude: null,
    longitude: null,
  };
  const schedule = {
    plannerId: 1,
    title: '강릉',
    cityName: '강릉',
    startDate: '2026-10-01',
    endDate: '2026-10-02',
    days: [
      {
        date: '2026-10-01',
        slots: [
          { slotId: 1, order: 1, place: spot },
          { slotId: 2, order: 2, place: null },
        ],
      },
      { date: '2026-10-02', slots: [{ slotId: 3, order: 1, place: null }] },
    ],
  };
  expect(filledCount(schedule)).toBe(1);
  expect(filledCount(null)).toBe(0);
});

describe('날짜별 출발지 (0번째 칸)', () => {
  const spot = (name: string, category: string | null) => ({
    tourPlaceId: 1,
    name,
    category,
    categoryLabel: null,
    imageUrl: null,
    address: null,
    rating: null,
    latitude: 35.8,
    longitude: 128.6,
  });
  const slot = (p: ReturnType<typeof spot> | null) =>
    ({ slotId: 1, order: 1, place: p } as never);

  test('첫날은 출발지, 전날이 숙소로 끝나면 숙소, 아니면 다시 출발지', () => {
    const origins = dayOrigins({
      plannerId: 1,
      title: '',
      cityName: '대구',
      startDate: '2026-11-10',
      endDate: '2026-11-12',
      departure: { name: '우리 집', latitude: 35.9, longitude: 128.5 },
      days: [
        {
          date: '2026-11-10',
          slots: [
            slot(spot('서문시장', 'ATTRACTION')),
            slot(spot('메리어트', 'ACCOMMODATION')),
            slot(null),
          ],
        },
        { date: '2026-11-11', slots: [slot(spot('수목원', 'ATTRACTION'))] },
        { date: '2026-11-12', slots: [] },
      ],
    });
    expect(origins.map(o => o?.name)).toEqual([
      '우리 집',
      '메리어트',
      '우리 집',
    ]);
    expect(origins[1]?.lodging).toBe(true);
  });

  test('출발지를 안 정한 옛 일정은 첫날 칸이 없다', () => {
    expect(
      dayOrigins({
        plannerId: 1,
        title: '',
        cityName: '대구',
        startDate: '2026-11-10',
        endDate: '2026-11-10',
        days: [{ date: '2026-11-10', slots: [] }],
      }),
    ).toEqual([null]);
  });
});
