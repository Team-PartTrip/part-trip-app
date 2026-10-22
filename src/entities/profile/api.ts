import { authRequest } from '../../shared/api/http';

export interface UserProfile {
  userId: string;
  /** 카카오는 동의를 안 했거나 중복이면 null. 서버 #263 배포 전에는 없다 */
  email?: string | null;
  nickName: string;
  imgUrl: string | null;
}

/** 내 프로필 조회 */
export function getMyProfile(): Promise<UserProfile> {
  return authRequest<UserProfile>('/api/profile/myInfo', { method: 'GET' });
}

/** 마이 탭 상단의 "여행 · 지역 · 기록" 3칸*/
export interface ProfileStats {
  tripCount: number;
  regionCount: number;
  recordCount: number;
}

/**
 * 내 여행 통계.
 * 여행 카드·세계지도 쓰기 API 가 아직 없어서 지금은 전부 0 이 온다.
 * 서버가 null 대신 0 을 주므로 화면은 그대로 그리면 된다.
 */
export function getProfileStats(): Promise<ProfileStats> {
  return authRequest<ProfileStats>('/api/profile/stats', { method: 'GET' });
}

export interface ProfileUpdatePayload {
  nickName: string;
  imgUrl?: string | null;
}

/** 내 프로필 수정 (닉네임/프로필 이미지) */
export function updateProfile(
  payload: ProfileUpdatePayload,
): Promise<UserProfile> {
  return authRequest<UserProfile>('/api/profile', {
    method: 'PUT',
    body: payload,
  });
}

/** 회원 탈퇴. 계정과 여행 · 기록 · 사진이 모두 지워진다 */
export function deleteAccount(): Promise<void> {
  return authRequest<void>('/api/profile', { method: 'DELETE' });
}

export type PreferredTransport = 'WALKING' | 'PUBLIC_TRANSIT' | 'TAXI' | 'CAR';

/** 여행 편의 설정. AI 가 일정을 짤 때 쓴다. 저장한 적이 없으면 서버 기본값이 온다 */
export interface TravelPreference {
  preferredTransport: PreferredTransport;
  dailyScheduleCount: number;
  canUseStairs: boolean;
  /** 여행 첫날 출발지 기본값. 등록하지 않았으면 null */
  home?: Home | null;
  /** AI 가 맛집을 고를 때 피한다. null 이면 아직 묻지 않았고, 빼고 보내면 서버가 그대로 둔다 */
  avoidFoods?: AvoidFood[] | null;
  /** 둘 다 null 이면 아직 묻지 않았다. 빼고 보내면 서버가 그대로 둔다 */
  usesWheelchair?: boolean | null;
  limitedWalking?: boolean | null;
  maxWalkingMinutes?: number | null;
}

export const WALKING_MINUTES = [10, 30, 60] as const;

export const WALKING_LABEL: Record<number, string> = {
  10: '10분 이내',
  30: '30분 이내',
  60: '1시간 이상',
};

export function walkingMinutesOf(pref: TravelPreference): number | null {
  if (pref.maxWalkingMinutes != null) {
    return pref.maxWalkingMinutes;
  }
  if (pref.limitedWalking === true) {
    return 30;
  }
  return pref.limitedWalking === false ? 60 : null;
}

export type AvoidFood = 'SEAFOOD' | 'SPICY' | 'HARD' | 'MEAT' | 'DAIRY';

export const AVOID_FOODS: { value: AvoidFood; label: string }[] = [
  { value: 'SEAFOOD', label: '해산물' },
  { value: 'SPICY', label: '매운 음식' },
  { value: 'HARD', label: '딱딱하거나 질긴 음식' },
  { value: 'MEAT', label: '고기' },
  { value: 'DAIRY', label: '유제품' },
];

/** 메뉴 정보 없이 식당 이름으로만 거르므로 늘 함께 보여준다 */
export const AVOID_FOODS_NOTICE =
  '식당 종류만 참고해요. 알레르기가 있으면 식당에 꼭 확인하세요.';

export function toggleAvoidFood(
  list: AvoidFood[] | null | undefined,
  food: AvoidFood,
): AvoidFood[] {
  const current = list ?? [];
  return current.includes(food)
    ? current.filter(f => f !== food)
    : [...current, food];
}

export interface Home {
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
}

export function getTravelPreference(): Promise<TravelPreference> {
  return authRequest<TravelPreference>('/api/profile/travel-preferences', {
    method: 'GET',
  });
}

export function saveTravelPreference(
  payload: TravelPreference,
): Promise<TravelPreference> {
  return authRequest<TravelPreference>('/api/profile/travel-preferences', {
    method: 'PUT',
    body: payload,
  });
}

/** 집 등록 · 변경. 이동수단 등 다른 설정은 그대로 둔다 */
export function saveHome(home: Home): Promise<TravelPreference> {
  return authRequest<TravelPreference>('/api/profile/home', {
    method: 'PUT',
    body: home,
  });
}

export function deleteHome(): Promise<TravelPreference> {
  return authRequest<TravelPreference>('/api/profile/home', {
    method: 'DELETE',
  });
}
