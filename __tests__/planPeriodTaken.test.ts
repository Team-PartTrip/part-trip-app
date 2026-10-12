// 이미 다른 여행이 있는 기간을 막는 판정만 본다.
//
// 서버는 겹치는 여행이 있으면 플래너 만들기를 거부한다
// (existsOverlappingPlanForUser: p.startDate <= end AND p.endDate >= start).
// 달력의 판정이 이와 다르면, 달력에서는 골라지는데 저장할 때 거부당한다.
import {
  crossesBlocked,
  isBlockedDay,
} from '../src/pages/PlannerScreen/PlanPeriodView';

const osaka = [{ startDate: '2026-08-23', endDate: '2026-08-27' }];

test('다른 여행의 첫날과 마지막 날도 막는다 - 서버가 양끝을 포함한다', () => {
  expect(isBlockedDay('2026-08-23', osaka)).toBe(true);
  expect(isBlockedDay('2026-08-25', osaka)).toBe(true);
  expect(isBlockedDay('2026-08-27', osaka)).toBe(true);
});

test('다른 여행의 앞뒤 날은 고를 수 있다', () => {
  expect(isBlockedDay('2026-08-22', osaka)).toBe(false);
  expect(isBlockedDay('2026-08-28', osaka)).toBe(false);
});

test('다른 여행을 사이에 끼고 기간을 잡으면 겹친다', () => {
  // 앞뒤 날은 비어 있어도 사이에 오사카 여행이 통째로 들어간다
  expect(crossesBlocked('2026-08-20', '2026-08-30', osaka)).toBe(true);
});

test('다른 여행이 끝나는 날 새 여행을 시작하면 겹친다', () => {
  expect(crossesBlocked('2026-08-27', '2026-08-29', osaka)).toBe(true);
});

test('다른 여행 바로 다음 날부터면 겹치지 않는다', () => {
  expect(crossesBlocked('2026-08-28', '2026-08-30', osaka)).toBe(false);
  expect(crossesBlocked('2026-08-18', '2026-08-22', osaka)).toBe(false);
});
