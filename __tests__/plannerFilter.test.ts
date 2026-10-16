import { matches } from '../src/pages/PlannerScreen/PlannerScreen';

// 한 계획은 칩 하나에만 나와야 한다. 겹치면 같은 여행이 두 번 보인다.
const NOW = '2026-10-16';
const plan = (startDate: string | null, endDate: string | null) => ({
  status: 'CONFIRMED' as const,
  startDate,
  endDate,
});
const where = (p: ReturnType<typeof plan>) =>
  (['upcoming', 'traveling', 'done'] as const).filter(f => matches(p, f, NOW));

test('출발 전이면 예정에만', () => {
  expect(where(plan('2026-11-10', '2026-11-11'))).toEqual(['upcoming']);
});

test('기간을 안 정했으면 예정에만', () => {
  expect(where(plan(null, null))).toEqual(['upcoming']);
});

test('오늘이 기간 안이면 여행 중에만', () => {
  expect(where(plan('2026-10-15', '2026-10-17'))).toEqual(['traveling']);
});

test('끝났으면 완료에만', () => {
  expect(where(plan('2026-10-01', '2026-10-03'))).toEqual(['done']);
});
