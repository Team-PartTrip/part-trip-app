import { authRequest } from './http';

/** 촬영 및 이미지 첨부 (※ 이미지 업로드는 multipart 필요할 수 있음 — 스펙 확정 후 조정) */
export function uploadImage<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/guide-camera/images', { method: 'POST', body });
}
/** AI 분석 결과 제공 */
export function getAnalysisResult<T = unknown>(
  imageId: string | number,
): Promise<T> {
  return authRequest<T>(`/api/guide-camera/results/${imageId}`, {
    method: 'GET',
  });
}
/** 근처 명소 추천 */
export function getRecommendations<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/guide-camera/recommendations', { method: 'GET' });
}
/** 기록 저장 */
export function saveRecord<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/guide-camera/records', { method: 'POST', body });
}
/** 해설 카메라 미션 추가 */
export function addMission<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/guide-camera/missions', { method: 'POST', body });
}
