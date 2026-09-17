// 우리 여행 계획(Func-005-06)은 확정 전후로 같은 화면이다. 확정됐는지를
// 틀리게 보면 일정표 대신 투표 현황이 나오고, 날짜 묶기가 틀리면 장소가
// 엉뚱한 날에 붙거나 빠진다.

jest.mock('@react-navigation/native', () => ({ useFocusEffect: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: 'View' }));

import {
  groupByDay,
  isSchedule,
} from '../src/pages/PlannerScreen/PlanStatusView';
import type { ConfirmedPlace } from '../src/entities/planner/api';

function place(optionId: number, visitedDate?: string): ConfirmedPlace {
  return {
    voteId: 1,
    category: 'RESTAURANT',
    categoryLabel: '맛집',
    optionId,
    tourPlaceId: optionId,
    placeName: `장소${optionId}`,
    imageUrl: null,
    address: null,
    rating: null,
    voteCount: 1,
    visitedDate,
  } as ConfirmedPlace;
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
  expect(days[1].places.map(p => p.optionId)).toEqual([1, 3]);
});

test('날짜가 빠진 장소는 사라지지 않고 첫날에 붙는다', () => {
  const days = groupByDay([place(1, '2026-10-02'), place(2)], '2026-10-01');
  expect(days[0].label).toBe('1일차 · 10.01');
  expect(days[0].places.map(p => p.optionId)).toEqual([2]);
});
