import { authRequest } from '../../shared/api/http';

/** 지도상 해설 카메라 위치 표시 */
export function getMap<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/records/map', { method: 'GET' });
}
/** 여행별 기록 관리(조회) */
export function getTripRecords<T = unknown>(
  tripId: string | number,
): Promise<T> {
  return authRequest<T>(`/api/records/trips/${tripId}`, { method: 'GET' });
}
/** 촬영 기록 상세 조회 */
export function getRecord<T = unknown>(recordId: string | number): Promise<T> {
  return authRequest<T>(`/api/records/${recordId}`, { method: 'GET' });
}
/** 코멘트 작성 */
export function createComment<T = unknown>(
  recordId: string | number,
  body: unknown,
): Promise<T> {
  return authRequest<T>(`/api/records/${recordId}/comments`, {
    method: 'POST',
    body,
  });
}
/** 코멘트 수정 */
export function updateComment<T = unknown>(
  commentId: string | number,
  body: unknown,
): Promise<T> {
  return authRequest<T>(`/api/records/comments/${commentId}`, {
    method: 'PATCH',
    body,
  });
}
/** 기록 삭제 */
export function deleteRecord<T = unknown>(
  recordId: string | number,
): Promise<T> {
  return authRequest<T>(`/api/records/${recordId}`, { method: 'DELETE' });
}
/** 축제 & 이벤트 캘린더 */
export function getFestivals<T = unknown>(): Promise<T> {
  return authRequest<T>('/api/records/festivals', { method: 'GET' });
}
/** 여행 리포트 */
export function getTripReport<T = unknown>(
  tripId: string | number,
): Promise<T> {
  return authRequest<T>(`/api/records/trips/${tripId}/report`, {
    method: 'GET',
  });
}
