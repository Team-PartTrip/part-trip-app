import { authRequest } from './http';

/** 캐릭터 조회 */
export function getCharacter<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/missions/character', { method: 'GET' });
}
/** 출석 체크 보상 */
export function checkAttendance<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/missions/attendance', { method: 'POST' });
}
/** 여행 유형별 캐릭터 설정 */
export function setCharacterType<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/missions/character/type', {
    method: 'POST',
    body,
  });
}
/** 캐릭터 성장 단계 조회 */
export function getCharacterLevel<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/missions/character/level', { method: 'GET' });
}
/** 일반 미션 목록 조회 */
export function getMissions<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/missions', { method: 'GET' });
}
/** 해설 카메라 미션 목록 조회 */
export function getGuideCameraMissions<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/missions/guide-camera', { method: 'GET' });
}
