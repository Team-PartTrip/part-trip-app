import { isLockedSource } from '../src/entities/record/api';

test('EXIF 와 카메라 값은 잠긴다', () => {
  expect(isLockedSource('EXIF')).toBe(true);
  expect(isLockedSource('CAMERA')).toBe(true);
});

test('직접 고른 값과 비어 있는 값은 고칠 수 있다', () => {
  expect(isLockedSource('MANUAL')).toBe(false);
  expect(isLockedSource(null)).toBe(false);
  expect(isLockedSource(undefined)).toBe(false);
});
