import { monthsBetween, shiftIso } from '../src/pages/FestivalScreen/FestivalScreen';

// 여행 기간 ±1주는 달·해를 자주 넘는다. 여기서 틀리면 화면에는
// "축제가 없어요" 로만 보여서 알아채기 어렵다.

test('날짜를 앞뒤로 옮긴다', () => {
  expect(shiftIso('2026-09-10', -7)).toBe('2026-09-03');
  expect(shiftIso('2026-09-14', 7)).toBe('2026-09-21');
});

test('달을 넘겨도 맞는다', () => {
  expect(shiftIso('2026-09-03', -7)).toBe('2026-08-27');
  expect(shiftIso('2026-09-28', 7)).toBe('2026-10-05');
});

test('해를 넘겨도 맞는다', () => {
  expect(shiftIso('2027-01-03', -7)).toBe('2026-12-27');
  expect(shiftIso('2026-12-28', 7)).toBe('2027-01-04');
});

test('윤년 2월을 넘겨도 맞는다', () => {
  expect(shiftIso('2028-03-03', -7)).toBe('2028-02-25');
  expect(shiftIso('2026-03-03', -7)).toBe('2026-02-24');
});

test('한 달 안이면 한 번만 조회한다', () => {
  expect(monthsBetween('2026-09-03', '2026-09-21')).toEqual([
    { year: 2026, month: 9 },
  ]);
});

test('달을 걸치면 걸친 달을 모두 조회한다', () => {
  expect(monthsBetween('2026-08-27', '2026-10-05')).toEqual([
    { year: 2026, month: 8 },
    { year: 2026, month: 9 },
    { year: 2026, month: 10 },
  ]);
});

test('해를 걸쳐도 순서대로 조회한다', () => {
  expect(monthsBetween('2026-12-27', '2027-01-04')).toEqual([
    { year: 2026, month: 12 },
    { year: 2027, month: 1 },
  ]);
});
