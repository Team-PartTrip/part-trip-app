import { authRequest } from '../../shared/api/http';

export interface Mission {
  missionId: number;
  missionTitle: string;
  missionDescription: string;
  completed: boolean;
  missionCountry: string;
  missionCategory: string;
  missionPoint: number;
  imgUrl: string | null;
}

/** 내 미션 전체 조회 (완료/미완료 포함) */
export function getMissions(): Promise<Mission[]> {
  return authRequest<Mission[]>('/api/mission', { method: 'GET' });
}

/** 완료한 미션만 조회 */
export function getCompletedMissions(): Promise<Mission[]> {
  return authRequest<Mission[]>('/api/mission/completed', { method: 'GET' });
}

/** 미션 완료 처리 */
export function completeMission(missionId: number): Promise<void> {
  return authRequest<void>(`/api/mission/${missionId}`, { method: 'PATCH' });
}
