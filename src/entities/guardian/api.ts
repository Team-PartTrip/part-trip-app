// 보호자 (명세 Func-012, server #159 · #160).
//
// 시니어가 코드를 만들어 가족에게 보내고, 가족이 코드를 넣으면 연결된다.
// 보호자는 시니어의 일정과 여행 중 위치를 보기만 한다.

import { authRequest } from '../../shared/api/http';

export interface GuardianInvite {
  /** 6자리. 헷갈리는 글자(0 · O · 1 · I · L)는 없다 */
  code: string;
  /** ISO-8601. 24시간 뒤 */
  expiresAt: string;
}

/** 연결된 상대. 시니어가 보면 보호자, 보호자가 보면 시니어다 */
export interface GuardianLink {
  linkId: number;
  userId: string;
  nickName: string;
  /** ISO-8601 */
  linkedAt: string;
}

/** 시니어: 보호자 초대 코드 만들기. 24시간 동안 한 번 쓸 수 있다 */
export function createGuardianInvite(): Promise<GuardianInvite> {
  return authRequest<GuardianInvite>('/api/guardians/invite', {
    method: 'POST',
  });
}

/** 시니어: 나를 보호하는 사람 */
export function getMyGuardians(): Promise<GuardianLink[]> {
  return authRequest<GuardianLink[]>('/api/guardians/me', { method: 'GET' });
}

/** 시니어 · 보호자: 연결 끊기 */
export function unlinkGuardian(linkId: number): Promise<void> {
  return authRequest<void>(`/api/guardians/${linkId}`, { method: 'DELETE' });
}
