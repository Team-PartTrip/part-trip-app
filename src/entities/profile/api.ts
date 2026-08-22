import { authRequest } from '../../shared/api/http';

export interface UserProfile {
  userId: string;
  nickName: string;
  imgUrl: string | null;
  /** 여행 타입 (Func-007-01). 아직 고르지 않았으면 전부 null */
  themeId: number | null;
  themeName: string | null;
  themeDescription: string | null;
}

/** 내 프로필 조회 */
export function getMyProfile(): Promise<UserProfile> {
  return authRequest<UserProfile>('/api/profile/myInfo', { method: 'GET' });
}

export interface ProfileUpdatePayload {
  nickName: string;
  imgUrl?: string | null;
  /** 생략하면 기존 여행 타입을 유지한다 */
  themeId?: number | null;
}

export interface TravelTheme {
  themeId: number;
  themeCode: string;
  themeName: string;
  description: string | null;
  imageUrl: string | null;
}

/** 여행 타입 목록 조회 — 프로필 수정 화면의 선택지 */
export function getTravelThemes(): Promise<TravelTheme[]> {
  return authRequest<TravelTheme[]>('/api/profile/themes', { method: 'GET' });
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


