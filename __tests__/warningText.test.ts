import { warningText } from '../src/entities/planner/api';

test('경고가 없으면 null', () => {
  expect(warningText(undefined)).toBeNull();
  expect(warningText([])).toBeNull();
});

test('경고는 줄바꿈으로 이어 한 덩어리로 만든다', () => {
  expect(
    warningText([
      { tourPlaceId: 1, message: '무장애 정보가 없는 곳이에요 (경포대)' },
      { tourPlaceId: 2, message: '무장애 정보가 없는 곳이에요 (오죽헌)' },
    ]),
  ).toBe(
    '무장애 정보가 없는 곳이에요 (경포대)\n무장애 정보가 없는 곳이에요 (오죽헌)',
  );
});

test('빈 문구는 건너뛴다', () => {
  expect(warningText([{ tourPlaceId: null, message: '' }])).toBeNull();
});
