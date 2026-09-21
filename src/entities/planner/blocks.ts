import type { PlannerBlock } from './api';

/**
 * 여행 지침 블록 (명세 Func-005-14, server #158).
 *
 * 블록 목록은 서버가 준다(48종). 앱은 어떤 걸 먼저 보여줄지와 고른 값을 보낼
 * 모양만 정한다.
 */

/** 처음부터 펼쳐 보여줄 블록. 나머지는 "더 자세히 정하기" 안에 둔다 */
export const FEATURED: string[] = [
  'TRAVEL_TYPE',
  'COMPANION',
  'WALKING',
  'DAILY_DENSITY',
  'FOOD_TYPE',
  'TASTE',
  'LODGING_TYPE',
];

/** 칩 대신 장소 이름을 적는 블록. 서버가 이름으로 관광지를 찾는다 */
export const PLACE_NAME_BLOCKS = ['MUST_INCLUDE', 'EXCLUDE'];

/** 블록 종류 → 고른 값들 */
export type Picked = Record<string, string[]>;

export function chipOptions(block: PlannerBlock): string[] {
  return block.options.filter(option => !option.startsWith('직접'));
}

/** 칩을 눌렀을 때. 하나만 고르는 블록은 바꾸고, 같은 걸 다시 누르면 끈다 */
export function toggle(
  picked: Picked,
  block: PlannerBlock,
  value: string,
): Picked {
  const current = picked[block.type] ?? [];
  const on = current.includes(value);
  const next = on
    ? current.filter(v => v !== value)
    : block.multiple
    ? [...current, value]
    : [value];
  return { ...picked, [block.type]: next };
}

/** "경포대, 오죽헌" → ["경포대", "오죽헌"] */
export function splitNames(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map(name => name.trim())
    .filter(name => name.length > 0);
}

/** 서버로 보낼 블록 목록. 고른 칩과 적은 장소 이름을 합친다 */
export function toPayload(
  picked: Picked,
  placeNames: Record<string, string>,
): { type: string; value: string }[] {
  const chips = Object.entries(picked).flatMap(([type, values]) =>
    values.map(value => ({ type, value })),
  );
  const names = Object.entries(placeNames).flatMap(([type, text]) =>
    splitNames(text).map(value => ({ type, value })),
  );
  return [...chips, ...names];
}
