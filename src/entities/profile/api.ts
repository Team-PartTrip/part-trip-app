import { authRequest } from '../../shared/api/http';

export interface UserProfile {
  userId: string;
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
