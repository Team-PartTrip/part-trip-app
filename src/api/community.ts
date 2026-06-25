import { authRequest } from './http';

/** 여행지 별점 리뷰 작성 */
export function createReview<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/community/reviews', { method: 'POST', body });
}
/** 여행 경로/일정 공유 */
export function shareTrip<T = unknown>(body: unknown): Promise<T> {
  return authRequest<T>('/api/community/shared-trips', {
    method: 'POST',
    body,
  });
}
