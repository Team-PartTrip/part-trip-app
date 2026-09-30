import { clampPan, visibleBox } from '../src/shared/ui/ZoomableView';

test('확대 전에는 움직이지 않는다', () => {
  const { x, y } = clampPan(1, 300, 360, 50, -40);
  expect(Math.abs(x) + Math.abs(y)).toBe(0);
});

test('두 배면 가로 · 세로 절반까지만 옮긴다', () => {
  expect(clampPan(2, 300, 360, 500, -500)).toEqual({ x: 150, y: -180 });
  expect(clampPan(2, 300, 360, 20, 30)).toEqual({ x: 20, y: 30 });
});

test('확대하지 않으면 그림 전체가 보인다', () => {
  expect(visibleBox({ scale: 1, x: 0, y: 0 }, 300, 360, 600, 720)).toEqual({
    x: 0,
    y: 0,
    width: 600,
    height: 720,
  });
});

test('두 배 확대하면 가운데 절반이, 오른쪽으로 끌면 왼쪽이 보인다', () => {
  expect(visibleBox({ scale: 2, x: 0, y: 0 }, 300, 360, 600, 720)).toEqual({
    x: 150,
    y: 180,
    width: 300,
    height: 360,
  });
  expect(visibleBox({ scale: 2, x: 150, y: 0 }, 300, 360, 600, 720).x).toBe(0);
});
