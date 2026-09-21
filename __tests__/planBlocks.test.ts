// 여행 지침 블록. 고른 값이 틀리게 나가면 AI 가 엉뚱한 조건으로 일정을 짠다.

import {
  chipOptions,
  splitNames,
  toggle,
  toPayload,
} from '../src/entities/planner/blocks';
import type { PlannerBlock } from '../src/entities/planner/api';

const multi: PlannerBlock = {
  type: 'TRAVEL_TYPE',
  label: '여행 타입',
  multiple: true,
  options: ['자연', '힐링', '역사'],
};
const single: PlannerBlock = {
  type: 'WALKING',
  label: '걷기 부담',
  multiple: false,
  options: ['걷기 최소화', '조금 걷기', '직접 지정'],
};

test('여러 개 고르는 블록은 쌓이고, 다시 누르면 빠진다', () => {
  let picked = toggle({}, multi, '자연');
  picked = toggle(picked, multi, '역사');
  expect(picked.TRAVEL_TYPE).toEqual(['자연', '역사']);
  expect(toggle(picked, multi, '자연').TRAVEL_TYPE).toEqual(['역사']);
});

test('하나만 고르는 블록은 새로 누른 것으로 바뀐다', () => {
  const picked = toggle(toggle({}, single, '걷기 최소화'), single, '조금 걷기');
  expect(picked.WALKING).toEqual(['조금 걷기']);
});

test('자유 입력 칩은 보여주지 않는다', () => {
  expect(chipOptions(single)).toEqual(['걷기 최소화', '조금 걷기']);
});

test('장소 이름은 쉼표와 줄바꿈으로 나누고 빈 값은 버린다', () => {
  expect(splitNames(' 경포대, 오죽헌,,\n 안목해변 ')).toEqual([
    '경포대',
    '오죽헌',
    '안목해변',
  ]);
});

test('고른 칩과 적은 장소를 블록 목록으로 합친다', () => {
  expect(
    toPayload(
      { TRAVEL_TYPE: ['자연'], WALKING: [] },
      { MUST_INCLUDE: '경포대', EXCLUDE: '' },
    ),
  ).toEqual([
    { type: 'TRAVEL_TYPE', value: '자연' },
    { type: 'MUST_INCLUDE', value: '경포대' },
  ]);
});
