import { authRequest } from './http';

/** 내 프로필 정보 조회 */
export function getMyInfo<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/profile/myInfo', { method: 'GET' });
}
