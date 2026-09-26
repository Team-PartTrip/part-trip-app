// 일정 카드 고치기. 순서가 틀리게 저장되거나 새 칸에 가짜 id 가 나가면 서버가 거부한다.

import {
  addSlot,
  moveSlot,
  removeSlot,
  setPlace,
  swapPlaces,
  toSaveRequest,
} from '../src/entities/planner/scheduleEdit';
import type {
  PlannerSchedule,
  SchedulePlace,
} from '../src/entities/planner/api';

const place = (id: number): SchedulePlace => ({
  tourPlaceId: id,
  name: `장소${id}`,
  category: null,
  categoryLabel: null,
  imageUrl: null,
  address: null,
  rating: null,
  latitude: null,
  longitude: null,
});

const schedule: PlannerSchedule = {
  plannerId: 1,
  title: '강릉',
  cityName: '강릉',
  startDate: '2026-10-10',
  endDate: '2026-10-11',
  days: [
    {
      date: '2026-10-10',
      slots: [
        { slotId: 1, order: 1, place: place(10) },
        { slotId: 2, order: 2, place: place(20) },
        { slotId: 3, order: 3, place: null },
      ],
    },
    { date: '2026-10-11', slots: [{ slotId: 4, order: 1, place: place(40) }] },
  ],
};

const ids = (s: PlannerSchedule, day: number) =>
  s.days[day].slots.map(x => x.slotId);
const orders = (s: PlannerSchedule, day: number) =>
  s.days[day].slots.map(x => x.order);

test('옮기면 순서 번호를 다시 매긴다', () => {
  const moved = moveSlot(schedule, '2026-10-10', 2, 0);
  expect(ids(moved, 0)).toEqual([3, 1, 2]);
  expect(orders(moved, 0)).toEqual([1, 2, 3]);
  // 다른 날은 그대로
  expect(ids(moved, 1)).toEqual([4]);
});

test('범위를 벗어나게 옮기면 아무것도 안 바뀐다', () => {
  expect(ids(moveSlot(schedule, '2026-10-10', 0, 5), 0)).toEqual([1, 2, 3]);
});

test('다른 날 칸과 장소를 바꿀 수 있고, 빈 칸과 바꾸면 옮겨진다', () => {
  const swapped = swapPlaces(schedule, 1, 4);
  expect(swapped.days[0].slots[0].place?.tourPlaceId).toBe(40);
  expect(swapped.days[1].slots[0].place?.tourPlaceId).toBe(10);
  const moved = swapPlaces(schedule, 2, 3);
  expect(moved.days[0].slots[1].place).toBeNull();
  expect(moved.days[0].slots[2].place?.tourPlaceId).toBe(20);
});

test('비우기 · 넣기 · 지우기', () => {
  expect(setPlace(schedule, 1, null).days[0].slots[0].place).toBeNull();
  expect(
    setPlace(schedule, 3, place(30)).days[0].slots[2].place?.tourPlaceId,
  ).toBe(30);
  const removed = removeSlot(schedule, 1);
  expect(ids(removed, 0)).toEqual([2, 3]);
  expect(orders(removed, 0)).toEqual([1, 2]);
});

test('새 칸은 저장할 때 slotId 를 비워 보낸다', () => {
  const added = addSlot(schedule, '2026-10-11');
  expect(added.days[1].slots).toHaveLength(2);
  expect(toSaveRequest(added).days[1].slots).toEqual([
    { slotId: 4, tourPlaceId: 40 },
    { slotId: null, tourPlaceId: null },
  ]);
});

describe('끌어서 놓은 자리', () => {
  // dropIndex 는 ScheduleDays 에 있다. 칸 높이가 달라도 이웃 칸 절반을 넘어야 한 칸 옮긴다
  const { dropIndex } = require('../src/pages/PlannerScreen/ScheduleDays');
  const heights = [70, 70, 56, 70];

  test('절반을 안 넘으면 그 자리', () => {
    expect(dropIndex(0, 30, heights)).toBe(0);
  });
  test('아래로 두 칸', () => {
    expect(dropIndex(0, 70 + 30, heights)).toBe(2);
  });
  test('위로 한 칸, 맨 위를 넘지 않는다', () => {
    expect(dropIndex(2, -40, heights)).toBe(1);
    expect(dropIndex(1, -500, heights)).toBe(0);
  });
  test('맨 아래를 넘지 않는다', () => {
    expect(dropIndex(2, 500, heights)).toBe(3);
  });
});
