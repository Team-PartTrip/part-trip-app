// 플래너 API(Func-008) 가 나오기 전까지 화면 확인용으로 쓰는 예시 데이터.
// 컨트롤러가 생기면 이 파일을 지우고 api.ts 호출로 바꾸면 된다.

import {
  GroupMember,
  PlaceCategory,
  PopularCity,
  TourPlace,
  TravelPlan,
  Vote,
  today,
} from './types';

/** 마법사를 끝냈을 때 들어가 볼 예시 계획. 실제로는 서버가 만들어 준 planId 를 쓴다 */
export const SAMPLE_PLAN_ID = 1;

/** 로그인한 사람. 서버가 붙으면 프로필 API 의 userId 로 바꾼다 */
export const ME_USER_ID = 'u1';

const OSAKA_MEMBERS: GroupMember[] = [
  {
    groupMemberId: 1,
    userId: 'u1',
    nickname: '김찬우',
    role: 'OWNER',
    invite: 'ME',
  },
  {
    groupMemberId: 2,
    userId: 'u2',
    nickname: '이서준',
    role: 'MEMBER',
    invite: 'ACCEPTED',
  },
  {
    groupMemberId: 3,
    userId: 'u3',
    nickname: '박민지',
    role: 'MEMBER',
    invite: 'ACCEPTED',
  },
  {
    groupMemberId: 4,
    userId: 'u4',
    nickname: '최유진',
    role: 'MEMBER',
    invite: 'ACCEPTED',
  },
];

/** 그룹 만들기(C2) 를 열었을 때 처음 보이는 멤버 — 나 + 초대해 둔 두 명 */
export const sampleDraftMembers: GroupMember[] = [
  OSAKA_MEMBERS[0],
  OSAKA_MEMBERS[1],
  { ...OSAKA_MEMBERS[2], invite: 'PENDING' },
];

export const samplePlans: TravelPlan[] = [
  {
    planId: 1,
    groupId: 1,
    travelTitle: '오사카 4박 5일',
    countryName: '일본',
    cityName: '오사카',
    startDate: '2026-08-23',
    endDate: '2026-08-27',
    headcount: 4,
    status: 'VOTING',
    members: OSAKA_MEMBERS,
  },
  {
    planId: 2,
    groupId: 2,
    travelTitle: '도쿄 주말 여행',
    countryName: '일본',
    cityName: '도쿄',
    startDate: '2026-09-12',
    endDate: '2026-09-14',
    headcount: 2,
    status: 'CONFIRMED',
    members: [OSAKA_MEMBERS[0], OSAKA_MEMBERS[1]],
  },
  {
    planId: 3,
    groupId: 3,
    travelTitle: '제주 한 달 살기',
    countryName: '한국',
    cityName: '제주',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    headcount: 6,
    status: 'PLANNING',
    members: [OSAKA_MEMBERS[0]],
  },
  {
    planId: 4,
    groupId: 4,
    travelTitle: '후쿠오카 미식 여행',
    countryName: '일본',
    cityName: '후쿠오카',
    startDate: '2026-05-02',
    endDate: '2026-05-05',
    headcount: 3,
    status: 'DONE',
    members: OSAKA_MEMBERS.slice(0, 3),
  },
];

export function samplePlanOf(planId: number): TravelPlan {
  return samplePlans.find(plan => plan.planId === planId) ?? samplePlans[0];
}

// 카페·액티비티 투표는 "오늘 21:00 마감" 으로 보이게 오늘 날짜를 붙인다
const TONIGHT = `${today()}T21:00:00`;

const OSAKA_VOTES: Vote[] = [
  {
    voteId: 11,
    planId: 1,
    category: 'RESTAURANT',
    status: 'CONFIRMED',
    deadline: TONIGHT,
    confirmedOptionId: 101,
    options: [
      {
        optionId: 101,
        tourPlaceId: 1,
        placeName: '이치란 라멘',
        voterIds: ['u1', 'u2', 'u3'],
      },
      {
        optionId: 102,
        tourPlaceId: 2,
        placeName: '쿠시카츠 다루마',
        voterIds: ['u4'],
      },
      { optionId: 103, tourPlaceId: 3, placeName: '하리주 그릴', voterIds: [] },
      {
        optionId: 104,
        tourPlaceId: 4,
        placeName: '미즈노 오코노미야키',
        voterIds: [],
      },
    ],
  },
  {
    voteId: 12,
    planId: 1,
    category: 'ATTRACTION',
    status: 'CONFIRMED',
    deadline: TONIGHT,
    confirmedOptionId: 201,
    options: [
      {
        optionId: 201,
        tourPlaceId: 11,
        placeName: '오사카성',
        voterIds: ['u1', 'u2', 'u3', 'u4'],
      },
      {
        optionId: 202,
        tourPlaceId: 12,
        placeName: '우메다 스카이빌딩',
        voterIds: [],
      },
      { optionId: 203, tourPlaceId: 13, placeName: '구로몬 시장', voterIds: [] },
    ],
  },
  {
    voteId: 13,
    planId: 1,
    category: 'ACCOMMODATION',
    status: 'CONFIRMED',
    deadline: TONIGHT,
    confirmedOptionId: 301,
    options: [
      {
        optionId: 301,
        tourPlaceId: 21,
        placeName: '난바 호텔',
        voterIds: ['u1', 'u2', 'u3'],
      },
      {
        optionId: 302,
        tourPlaceId: 22,
        placeName: '우메다 스테이션 호텔',
        voterIds: ['u4'],
      },
    ],
  },
  {
    voteId: 14,
    planId: 1,
    category: 'CAFE',
    status: 'OPEN',
    deadline: TONIGHT,
    confirmedOptionId: null,
    options: [
      {
        optionId: 401,
        tourPlaceId: 31,
        placeName: '% 아라비카',
        voterIds: ['u1', 'u2'],
      },
      {
        optionId: 402,
        tourPlaceId: 32,
        placeName: '마루후쿠 커피',
        voterIds: ['u3'],
      },
      {
        optionId: 403,
        tourPlaceId: 33,
        placeName: '스타벅스 도톤보리',
        voterIds: [],
      },
    ],
  },
  {
    voteId: 15,
    planId: 1,
    category: 'ACTIVITY',
    status: 'OPEN',
    deadline: TONIGHT,
    confirmedOptionId: null,
    options: [
      {
        optionId: 501,
        tourPlaceId: 41,
        placeName: '유니버설 스튜디오 재팬',
        voterIds: ['u1'],
      },
      {
        optionId: 502,
        tourPlaceId: 42,
        placeName: '오사카 아쿠아리움',
        voterIds: ['u2'],
      },
      {
        optionId: 503,
        tourPlaceId: 43,
        placeName: '도톤보리 리버크루즈',
        voterIds: [],
      },
    ],
  },
  // 후보를 아무도 안 담은 카테고리 — C7 에서 "미정" 으로 보인다
  {
    voteId: 16,
    planId: 1,
    category: 'SHOPPING',
    status: 'OPEN',
    deadline: null,
    confirmedOptionId: null,
    options: [],
  },
];

const TOKYO_VOTES: Vote[] = [
  {
    voteId: 21,
    planId: 2,
    category: 'RESTAURANT',
    status: 'CONFIRMED',
    deadline: null,
    confirmedOptionId: 601,
    options: [
      {
        optionId: 601,
        tourPlaceId: 51,
        placeName: '스시 사이토',
        voterIds: ['u1', 'u2'],
      },
    ],
  },
  {
    voteId: 22,
    planId: 2,
    category: 'ATTRACTION',
    status: 'CONFIRMED',
    deadline: null,
    confirmedOptionId: 701,
    options: [
      {
        optionId: 701,
        tourPlaceId: 52,
        placeName: '센소지',
        voterIds: ['u1', 'u2'],
      },
    ],
  },
];

export function sampleVotesOf(planId: number): Vote[] {
  if (planId === 1) {
    return OSAKA_VOTES;
  }
  if (planId === 2) {
    return TOKYO_VOTES;
  }
  return [];
}

const OSAKA_PLACES: TourPlace[] = [
  { tourPlaceId: 1, placeName: '이치란 라멘', category: 'RESTAURANT', area: '도톤보리', rating: 4.6 },
  { tourPlaceId: 2, placeName: '쿠시카츠 다루마', category: 'RESTAURANT', area: '신세카이', rating: 4.4 },
  { tourPlaceId: 3, placeName: '하리주 그릴', category: 'RESTAURANT', area: '난바', rating: 4.7 },
  { tourPlaceId: 4, placeName: '미즈노 오코노미야키', category: 'RESTAURANT', area: '도톤보리', rating: 4.5 },
  { tourPlaceId: 11, placeName: '오사카성', category: 'ATTRACTION', area: '주오구', rating: 4.6 },
  { tourPlaceId: 12, placeName: '우메다 스카이빌딩', category: 'ATTRACTION', area: '기타구', rating: 4.5 },
  { tourPlaceId: 13, placeName: '구로몬 시장', category: 'ATTRACTION', area: '니혼바시', rating: 4.3 },
  { tourPlaceId: 14, placeName: '시텐노지', category: 'ATTRACTION', area: '덴노지', rating: 4.2 },
  { tourPlaceId: 21, placeName: '난바 호텔', category: 'ACCOMMODATION', area: '난바', rating: 4.4 },
  { tourPlaceId: 22, placeName: '우메다 스테이션 호텔', category: 'ACCOMMODATION', area: '우메다', rating: 4.5 },
  { tourPlaceId: 23, placeName: '신사이바시 캡슐', category: 'ACCOMMODATION', area: '신사이바시', rating: 4.0 },
  { tourPlaceId: 31, placeName: '% 아라비카', category: 'CAFE', area: '나카노시마', rating: 4.6 },
  { tourPlaceId: 32, placeName: '마루후쿠 커피', category: 'CAFE', area: '신사이바시', rating: 4.3 },
  { tourPlaceId: 33, placeName: '스타벅스 도톤보리', category: 'CAFE', area: '도톤보리', rating: 4.1 },
  { tourPlaceId: 41, placeName: '유니버설 스튜디오 재팬', category: 'ACTIVITY', area: '고노하나구', rating: 4.7 },
  { tourPlaceId: 42, placeName: '오사카 아쿠아리움', category: 'ACTIVITY', area: '미나토구', rating: 4.5 },
  { tourPlaceId: 43, placeName: '도톤보리 리버크루즈', category: 'ACTIVITY', area: '도톤보리', rating: 4.2 },
  { tourPlaceId: 51, placeName: '신사이바시스지', category: 'SHOPPING', area: '신사이바시', rating: 4.4 },
  { tourPlaceId: 52, placeName: '돈키호테 도톤보리', category: 'SHOPPING', area: '도톤보리', rating: 4.1 },
  { tourPlaceId: 53, placeName: '링쿠 프리미엄 아울렛', category: 'SHOPPING', area: '이즈미사노', rating: 4.3 },
];

export function samplePlacesOf(category: PlaceCategory): TourPlace[] {
  return OSAKA_PLACES.filter(place => place.category === category);
}

/** 장바구니(C6) 를 열었을 때 이미 담겨 있는 장소 */
export function sampleCartPlaces(): TourPlace[] {
  const ids = [1, 11, 13, 12];
  return ids
    .map(id => OSAKA_PLACES.find(place => place.tourPlaceId === id))
    .filter((place): place is TourPlace => !!place);
}

export const POPULAR_CITIES: PopularCity[] = [
  { cityName: '오사카', countryName: '일본', emoji: '🏯' },
  { cityName: '방콕', countryName: '태국', emoji: '🛕' },
  { cityName: '다낭', countryName: '베트남', emoji: '🏖️' },
  { cityName: '타이베이', countryName: '대만', emoji: '🏙️' },
  { cityName: '도쿄', countryName: '일본', emoji: '🗼' },
  { cityName: '후쿠오카', countryName: '일본', emoji: '🍜' },
  { cityName: '제주', countryName: '한국', emoji: '🍊' },
  { cityName: '파리', countryName: '프랑스', emoji: '🥐' },
];
