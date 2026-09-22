import type {
  PlannerSchedule,
  SaveSchedulePayload,
  SchedulePlace,
} from './api';


// 아직 저장 안 한 새 칸. 서버 id 와 겹치지 않게 음수를 쓴다
let nextTempId = -1;
export function newSlotId(): number {
  return nextTempId--;
}

function mapDays(
  schedule: PlannerSchedule,
  fn: (
    slots: PlannerSchedule['days'][number]['slots'],
    date: string,
  ) => PlannerSchedule['days'][number]['slots'],
): PlannerSchedule {
  return {
    ...schedule,
    days: schedule.days.map(day => ({
      ...day,
      slots: fn(day.slots, day.date).map((slot, i) => ({
        ...slot,
        order: i + 1,
      })),
    })),
  };
}

/** 같은 날 안에서 from 번째 칸을 to 번째로 옮긴다 */
export function moveSlot(
  schedule: PlannerSchedule,
  date: string,
  from: number,
  to: number,
): PlannerSchedule {
  return mapDays(schedule, (slots, d) => {
    if (d !== date || from === to || to < 0 || to >= slots.length) {
      return slots;
    }
    const next = [...slots];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
  });
}

/** 두 칸의 장소를 맞바꾼다. 다른 날 칸끼리도 된다. 빈 칸과 바꾸면 옮긴 셈이다 */
export function swapPlaces(
  schedule: PlannerSchedule,
  a: number,
  b: number,
): PlannerSchedule {
  const placeOf = new Map<number, SchedulePlace | null>();
  schedule.days.forEach(day =>
    day.slots.forEach(slot => placeOf.set(slot.slotId, slot.place)),
  );
  if (!placeOf.has(a) || !placeOf.has(b) || a === b) {
    return schedule;
  }
  return mapDays(schedule, slots =>
    slots.map(slot =>
      slot.slotId === a
        ? { ...slot, place: placeOf.get(b) ?? null }
        : slot.slotId === b
        ? { ...slot, place: placeOf.get(a) ?? null }
        : slot,
    ),
  );
}

/** 칸에 장소를 넣는다. null 이면 비운다 */
export function setPlace(
  schedule: PlannerSchedule,
  slotId: number,
  place: SchedulePlace | null,
): PlannerSchedule {
  return mapDays(schedule, slots =>
    slots.map(slot => (slot.slotId === slotId ? { ...slot, place } : slot)),
  );
}

/** 칸을 지운다 */
export function removeSlot(
  schedule: PlannerSchedule,
  slotId: number,
): PlannerSchedule {
  return mapDays(schedule, slots =>
    slots.filter(slot => slot.slotId !== slotId),
  );
}

/** 그날 맨 끝에 빈 칸을 하나 더 둔다 */
export function addSlot(
  schedule: PlannerSchedule,
  date: string,
): PlannerSchedule {
  return mapDays(schedule, (slots, d) =>
    d === date
      ? [...slots, { slotId: newSlotId(), order: 0, place: null }]
      : slots,
  );
}

/** 저장 요청. 새 칸(음수 id)은 slotId 를 비워 보낸다 */
export function toSaveRequest(schedule: PlannerSchedule): SaveSchedulePayload {
  return {
    days: schedule.days.map(day => ({
      date: day.date,
      slots: day.slots.map(slot => ({
        slotId: slot.slotId > 0 ? slot.slotId : null,
        tourPlaceId: slot.place?.tourPlaceId ?? null,
      })),
    })),
  };
}
