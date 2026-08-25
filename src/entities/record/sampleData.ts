// 기록 · 여행 카드 API 가 나오기 전까지 화면 확인용으로 쓰는 예시 데이터.
// 컨트롤러가 생기면 이 파일을 지우고 api.ts 호출로 바꾸면 된다.

import {
  CommentRevision,
  Photo,
  PhotoSpot,
  TripCard,
  TripCardEntry,
} from './types';

export const sampleTripCards: TripCard[] = [
  {
    tripCardId: 1,
    planId: 1,
    title: '오사카 4박 5일',
    countryName: '일본',
    cityName: '오사카',
    cityNameEn: 'Osaka',
    startDate: '2026-08-23',
    endDate: '2026-08-27',
    companionCount: 4,
    placeCount: 11,
    photoCount: 24,
    distanceKm: 86,
  },
  {
    tripCardId: 2,
    planId: 2,
    title: '도쿄 주말 여행',
    countryName: '일본',
    cityName: '도쿄',
    cityNameEn: 'Tokyo',
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    companionCount: 2,
    placeCount: 6,
    photoCount: 18,
    distanceKm: 41,
  },
  {
    tripCardId: 3,
    planId: null,
    title: '제주 겨울 여행',
    countryName: '대한민국',
    cityName: '제주',
    cityNameEn: 'Jeju',
    startDate: '2025-12-20',
    endDate: '2025-12-24',
    companionCount: 3,
    placeCount: 9,
    photoCount: 42,
    distanceKm: 137,
  },
];

export function sampleTripCardOf(tripCardId: number): TripCard {
  return (
    sampleTripCards.find(card => card.tripCardId === tripCardId) ??
    sampleTripCards[0]
  );
}

const OSAKA_SPOTS: PhotoSpot[] = [
  {
    tripCardPlaceId: 11,
    tripCardId: 1,
    placeName: '도톤보리',
    address: '오사카 주오구',
    visitedDate: '2026-08-23',
    photoCount: 3,
    x: 0.66,
    y: 0.36,
  },
  {
    tripCardPlaceId: 12,
    tripCardId: 1,
    placeName: '오사카성',
    address: '오사카 주오구 오사카조',
    visitedDate: '2026-08-24',
    photoCount: 5,
    x: 0.55,
    y: 0.51,
  },
  {
    tripCardPlaceId: 13,
    tripCardId: 1,
    placeName: '구로몬 시장',
    address: '오사카 주오구 니혼바시',
    visitedDate: '2026-08-25',
    photoCount: 2,
    x: 0.33,
    y: 0.4,
  },
  {
    tripCardPlaceId: 14,
    tripCardId: 1,
    placeName: '우메다 스카이빌딩',
    address: '오사카 기타구',
    visitedDate: '2026-08-26',
    photoCount: 1,
    x: 0.4,
    y: 0.66,
  },
];

export function sampleSpotsOf(tripCardId: number): PhotoSpot[] {
  return tripCardId === 1 ? OSAKA_SPOTS : [];
}

const OSAKA_PHOTOS: Photo[] = [
  {
    photoId: 101,
    tripCardId: 1,
    tripCardPlaceId: 11,
    commTitle: '도톤보리 글리코 사인',
    commContent:
      '밤에 본 글리코 사인. 사람이 정말 많았지만 그만큼 활기찬 분위기였다. 다음엔 강 건너편에서 찍어봐야지.',
    areaName: '오사카 주오구',
    takenAt: '2026-08-23T19:42:00',
    aiSummary: '1935년부터 자리를 지킨 오사카의 상징입니다.',
    tags: ['야경', '오사카', '맛집'],
    commentUpdatedAt: '2026-08-24T09:12:00',
  },
  {
    photoId: 102,
    tripCardId: 1,
    tripCardPlaceId: 11,
    commTitle: '도톤보리 강변',
    commContent: '',
    areaName: '오사카 주오구',
    takenAt: '2026-08-23T20:05:00',
    aiSummary: '도톤보리강을 따라 이어지는 오사카의 대표 번화가입니다.',
    tags: [],
    commentUpdatedAt: null,
  },
  {
    photoId: 103,
    tripCardId: 1,
    tripCardPlaceId: 12,
    commTitle: '오사카성 천수각',
    commContent: '',
    areaName: '오사카 주오구 오사카조',
    takenAt: '2026-08-24T11:20:00',
    aiSummary: '1583년 도요토미 히데요시가 세운 성입니다.',
    tags: [],
    commentUpdatedAt: null,
  },
];

export function samplePhotosOf(tripCardId: number): Photo[] {
  return tripCardId === 1 ? OSAKA_PHOTOS : [];
}

export function samplePhotoOf(photoId: number): Photo {
  return (
    OSAKA_PHOTOS.find(photo => photo.photoId === photoId) ?? OSAKA_PHOTOS[0]
  );
}

/** 코멘트 수정 이력(D5). 한 번도 안 고친 사진은 최초 작성만 남는다 */
export function sampleRevisionsOf(photo: Photo): CommentRevision[] {
  const first: CommentRevision = {
    photoCommentHistoryId: photo.photoId * 10,
    revision: 0,
    createdAt: '2026-08-23T19:50:00',
  };
  if (!photo.commentUpdatedAt) {
    return [first];
  }
  return [
    first,
    {
      photoCommentHistoryId: photo.photoId * 10 + 1,
      revision: 1,
      createdAt: photo.commentUpdatedAt,
    },
  ];
}

/** 여행 카드 상세(D10) — 장소 방문과 사진을 시간순으로 섞어 놓은 타임라인 */
const OSAKA_ENTRIES: TripCardEntry[] = [
  {
    kind: 'place',
    id: 11,
    date: '2026-08-23',
    imageCaption: '도톤보리',
    title: '도톤보리',
    subtitle: '오사카 주오구 · 사진 3장',
  },
  {
    kind: 'photo',
    id: 101,
    date: '2026-08-23',
    imageCaption: '도톤보리 글리코 사인',
    title: '2026.08.23  |  19:42',
    subtitle: '오사카 주오구',
  },
  {
    kind: 'place',
    id: 12,
    date: '2026-08-24',
    imageCaption: '오사카성',
    title: '오사카성',
    subtitle: '오사카 주오구 오사카조 · 사진 5장',
  },
  {
    kind: 'photo',
    id: 103,
    date: '2026-08-24',
    imageCaption: '오사카성 천수각',
    title: '2026.08.24  |  11:20',
    subtitle: '오사카 주오구 오사카조',
  },
  {
    kind: 'place',
    id: 13,
    date: '2026-08-25',
    imageCaption: '구로몬 시장',
    title: '구로몬 시장',
    subtitle: '오사카 주오구 니혼바시 · 사진 2장',
  },
];

export function sampleEntriesOf(tripCardId: number): TripCardEntry[] {
  return tripCardId === 1 ? OSAKA_ENTRIES : [];
}
