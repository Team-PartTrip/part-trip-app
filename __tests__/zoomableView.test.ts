import { clampPan } from '../src/shared/ui/ZoomableView';

test('확대 전에는 움직이지 않는다', () => {
  const { x, y } = clampPan(1, 300, 360, 50, -40);
  expect(Math.abs(x) + Math.abs(y)).toBe(0);
});

test('두 배면 가로 · 세로 절반까지만 옮긴다', () => {
  expect(clampPan(2, 300, 360, 500, -500)).toEqual({ x: 150, y: -180 });
  expect(clampPan(2, 300, 360, 20, 30)).toEqual({ x: 20, y: 30 });
});
