// 서버가 받는 사진 형식은 jpeg · png · webp 뿐이다. 갤러리가 주는 값이 달라도 맞춰 보내야 한다.

import { normalizePhoto } from '../src/entities/record/api';

test('iPhone 갤러리의 image/jpg 는 image/jpeg 로 보낸다', () => {
  const photo = normalizePhoto(
    {
      uri: 'file:///a/IMG_0001.JPG',
      fileName: 'IMG_0001.JPG',
      type: 'image/jpg',
    },
    'photo',
  );
  expect(photo.mimeType).toBe('image/jpeg');
  expect(photo.fileName).toBe('IMG_0001.jpg');
});

test('형식이 비어 있으면 확장자를 보고, 모르면 jpeg 다', () => {
  expect(
    normalizePhoto({ uri: 'file:///a/b.png', fileName: 'b.png' }, 'photo')
      .mimeType,
  ).toBe('image/png');
  expect(normalizePhoto({ uri: 'file:///a/b?x=1' }, 'photo-1').fileName).toBe(
    'photo-1.jpg',
  );
});

test('HEIC 로 와도 jpeg 로 보낸다(갤러리가 변환해 준 파일이다)', () => {
  const photo = normalizePhoto(
    {
      uri: 'file:///a/IMG_0002.HEIC',
      fileName: 'IMG_0002.HEIC',
      type: 'image/heic',
    },
    'photo',
  );
  expect(photo.mimeType).toBe('image/jpeg');
  expect(photo.fileName).toBe('IMG_0002.jpg');
});

test('png 와 webp 는 그대로 둔다', () => {
  expect(
    normalizePhoto(
      { uri: 'file:///c.webp', fileName: 'c.webp', type: 'image/webp' },
      'p',
    ).mimeType,
  ).toBe('image/webp');
});

import { isTripEnded } from '../src/entities/record/api';

test('종료일 다음 날부터 끝난 여행이다 (서버와 같다)', () => {
  const today = new Date(2026, 9, 20);
  expect(isTripEnded({ endDate: '2026-10-19' }, today)).toBe(true);
  expect(isTripEnded({ endDate: '2026-10-20' }, today)).toBe(false);
  expect(isTripEnded({ endDate: '2026-10-21' }, today)).toBe(false);
  expect(isTripEnded(null, today)).toBe(false);
});
