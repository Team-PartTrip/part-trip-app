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

export interface CharacterInfo {
  characterName: string;
  characterType: string;
  characterDescription: string;
  imgUrl: string;
}

/** 내 캐릭터 정보 조회 (심리테스트로 캐릭터가 배정되지 않은 유저는 실패함) */
export function getMyCharacter(): Promise<CharacterInfo> {
  return authRequest<CharacterInfo>('/api/profile/character', {
    method: 'GET',
  });
}
