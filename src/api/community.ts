import { authRequest } from './http';
import type { TripDto } from './trip';

export interface ReviewDto {
  reviewId: number;
  countryInfoId: number;
  countryName: string | null;
  cityName: string | null;
  userId: string;
  nickName: string;
  title: string;
  rating: number;
  content: string;
  createDate: string;
}

export interface ReviewPayload {
  countryInfoId: number;
  title: string;
  rating: number;
  content: string;
}

/** 여행지 별점 리뷰 작성 */
export function createReview(payload: ReviewPayload): Promise<ReviewDto> {
  return authRequest<ReviewDto>('/api/community/reviews', {
    method: 'POST',
    body: payload,
  });
}

/** 리뷰 목록 조회 (countryInfoId 생략 시 전체 조회) */
export function getReviews(countryInfoId?: number): Promise<ReviewDto[]> {
  const query = countryInfoId ? `?countryInfoId=${countryInfoId}` : '';
  return authRequest<ReviewDto[]>(`/api/community/reviews${query}`, {
    method: 'GET',
  });
}

/** 리뷰 수정 (본인 리뷰만 가능) */
export function updateReview(
  reviewId: number,
  payload: ReviewPayload,
): Promise<ReviewDto> {
  return authRequest<ReviewDto>(`/api/community/reviews/${reviewId}`, {
    method: 'PUT',
    body: payload,
  });
}

/** 리뷰 삭제 (본인 리뷰만 가능) */
export function deleteReview(reviewId: number): Promise<string> {
  return authRequest<string>(`/api/community/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

/** 리뷰 단건 조회 */
export function getReview(reviewId: number): Promise<ReviewDto> {
  return authRequest<ReviewDto>(`/api/community/reviews/${reviewId}`, {
    method: 'GET',
  });
}

/** 여행 경로/일정 공유 (내가 만든 일정을 커뮤니티에 공개) */
export function shareTrip(tripId: number): Promise<TripDto> {
  return authRequest<TripDto>('/api/community/shared-trips', {
    method: 'POST',
    body: { tripId },
  });
}

/** 공유된 일정 목록 (커뮤니티 피드) */
export function getSharedTrips(): Promise<TripDto[]> {
  return authRequest<TripDto[]>('/api/community/shared-trips', {
    method: 'GET',
  });
}

/** 공유된 일정 상세 */
export function getSharedTripDetail(tripId: number): Promise<TripDto> {
  return authRequest<TripDto>(`/api/community/shared-trips/${tripId}`, {
    method: 'GET',
  });
}

/** 다른 사람의 공유 일정을 내 일정으로 가져오기 */
export function importTrip(tripId: number): Promise<TripDto> {
  return authRequest<TripDto>(`/api/community/shared-trips/${tripId}/import`, {
    method: 'POST',
  });
}

export interface BoardDto {
  boardId: number;
  userId: string;
  nickName: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createDate: string;
  updateDate: string | null;
}

export interface BoardPayload {
  title: string;
  content: string;
}

export interface CommentDto {
  commentId: number;
  boardId: number;
  userId: string;
  nickName: string;
  content: string;
  createDate: string;
}

export interface CommentPayload {
  content: string;
}

/** 자유게시판 글 작성 */
export function createBoard(payload: BoardPayload): Promise<BoardDto> {
  return authRequest<BoardDto>('/api/community/boards', {
    method: 'POST',
    body: payload,
  });
}

/** 자유게시판 글 목록 조회 */
export function getBoards(): Promise<BoardDto[]> {
  return authRequest<BoardDto[]>('/api/community/boards', { method: 'GET' });
}

/** 자유게시판 글 단건 조회 */
export function getBoard(boardId: number): Promise<BoardDto> {
  return authRequest<BoardDto>(`/api/community/boards/${boardId}`, {
    method: 'GET',
  });
}

/** 자유게시판 글 수정 (본인 글만 가능) */
export function updateBoard(
  boardId: number,
  payload: BoardPayload,
): Promise<BoardDto> {
  return authRequest<BoardDto>(`/api/community/boards/${boardId}`, {
    method: 'PUT',
    body: payload,
  });
}

/** 자유게시판 글 삭제 (본인 글만 가능) */
export function deleteBoard(boardId: number): Promise<string> {
  return authRequest<string>(`/api/community/boards/${boardId}`, {
    method: 'DELETE',
  });
}

/** 댓글 작성 */
export function createComment(
  boardId: number,
  payload: CommentPayload,
): Promise<CommentDto> {
  return authRequest<CommentDto>(`/api/community/boards/${boardId}/comments`, {
    method: 'POST',
    body: payload,
  });
}

/** 댓글 목록 조회 */
export function getComments(boardId: number): Promise<CommentDto[]> {
  return authRequest<CommentDto[]>(
    `/api/community/boards/${boardId}/comments`,
    { method: 'GET' },
  );
}

/** 댓글 삭제 (본인 댓글만 가능) */
export function deleteComment(commentId: number): Promise<string> {
  return authRequest<string>(`/api/community/comments/${commentId}`, {
    method: 'DELETE',
  });
}
