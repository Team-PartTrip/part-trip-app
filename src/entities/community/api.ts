import { authRequest } from '../../shared/api/http';
import type { TripDto } from '../trip/api';

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

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
  images: string[];
  likeCount: number;
  liked: boolean;
  commentCount: number;
  createDate: string;
}

export interface ReviewPayload {
  countryInfoId: number;
  title: string;
  rating: number;
  content: string;
  images?: string[];
}

/** 여행지 별점 리뷰 작성 */
export function createReview(payload: ReviewPayload): Promise<ReviewDto> {
  return authRequest<ReviewDto>('/api/community/reviews', {
    method: 'POST',
    body: payload,
  });
}

/** 리뷰 목록 조회 (countryInfoId 생략 시 전체 조회, 페이지네이션) */
export function getReviews(
  countryInfoId?: number,
  page = 0,
  size = 20,
): Promise<PageResponse<ReviewDto>> {
  const params = new URLSearchParams();
  if (countryInfoId) params.set('countryInfoId', String(countryInfoId));
  params.set('page', String(page));
  params.set('size', String(size));
  return authRequest<PageResponse<ReviewDto>>(
    `/api/community/reviews?${params.toString()}`,
    { method: 'GET' },
  );
}

/** 내가 쓴 리뷰 목록 */
export function getMyReviews(
  page = 0,
  size = 20,
): Promise<PageResponse<ReviewDto>> {
  return authRequest<PageResponse<ReviewDto>>(
    `/api/community/reviews/mine?page=${page}&size=${size}`,
    { method: 'GET' },
  );
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

/** 공유된 일정 목록 (커뮤니티 피드, 페이지네이션) */
export function getSharedTrips(
  page = 0,
  size = 20,
): Promise<PageResponse<TripDto>> {
  return authRequest<PageResponse<TripDto>>(
    `/api/community/shared-trips?page=${page}&size=${size}`,
    { method: 'GET' },
  );
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
  images: string[];
  likeCount: number;
  liked: boolean;
  commentCount: number;
  createDate: string;
  updateDate: string | null;
}

export interface BoardPayload {
  title: string;
  content: string;
  images?: string[];
}

export interface CommentDto {
  commentId: number;
  targetType: 'BOARD' | 'REVIEW' | 'TRIP';
  targetId: number;
  parentCommentId: number | null;
  userId: string;
  nickName: string;
  content: string;
  createDate: string;
}

export interface CommentPayload {
  content: string;
  parentCommentId?: number;
}

/** 자유게시판 글 작성 */
export function createBoard(payload: BoardPayload): Promise<BoardDto> {
  return authRequest<BoardDto>('/api/community/boards', {
    method: 'POST',
    body: payload,
  });
}

/** 자유게시판 글 목록 조회 (페이지네이션) */
export function getBoards(
  page = 0,
  size = 20,
): Promise<PageResponse<BoardDto>> {
  return authRequest<PageResponse<BoardDto>>(
    `/api/community/boards?page=${page}&size=${size}`,
    { method: 'GET' },
  );
}

/** 내가 쓴 글 목록 */
export function getMyBoards(
  page = 0,
  size = 20,
): Promise<PageResponse<BoardDto>> {
  return authRequest<PageResponse<BoardDto>>(
    `/api/community/boards/mine?page=${page}&size=${size}`,
    { method: 'GET' },
  );
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

/** 자유게시판 댓글(또는 대댓글) 작성 */
export function createBoardComment(
  boardId: number,
  payload: CommentPayload,
): Promise<CommentDto> {
  return authRequest<CommentDto>(`/api/community/boards/${boardId}/comments`, {
    method: 'POST',
    body: payload,
  });
}

/** 자유게시판 댓글 목록 조회 */
export function getBoardComments(boardId: number): Promise<CommentDto[]> {
  return authRequest<CommentDto[]>(
    `/api/community/boards/${boardId}/comments`,
    { method: 'GET' },
  );
}

/** 여행 후기 댓글(또는 대댓글) 작성 */
export function createReviewComment(
  reviewId: number,
  payload: CommentPayload,
): Promise<CommentDto> {
  return authRequest<CommentDto>(
    `/api/community/reviews/${reviewId}/comments`,
    { method: 'POST', body: payload },
  );
}

/** 여행 후기 댓글 목록 조회 */
export function getReviewComments(reviewId: number): Promise<CommentDto[]> {
  return authRequest<CommentDto[]>(
    `/api/community/reviews/${reviewId}/comments`,
    { method: 'GET' },
  );
}

/** 일정 댓글(또는 대댓글) 작성 */
export function createTripComment(
  tripId: number,
  payload: CommentPayload,
): Promise<CommentDto> {
  return authRequest<CommentDto>(
    `/api/community/shared-trips/${tripId}/comments`,
    { method: 'POST', body: payload },
  );
}

/** 일정 댓글 목록 조회 */
export function getTripComments(tripId: number): Promise<CommentDto[]> {
  return authRequest<CommentDto[]>(
    `/api/community/shared-trips/${tripId}/comments`,
    { method: 'GET' },
  );
}

/** 댓글 수정 (본인 댓글만 가능) */
export function updateComment(
  commentId: number,
  payload: CommentPayload,
): Promise<CommentDto> {
  return authRequest<CommentDto>(`/api/community/comments/${commentId}`, {
    method: 'PUT',
    body: payload,
  });
}

/** 댓글 삭제 (본인 댓글만 가능) */
export function deleteComment(commentId: number): Promise<string> {
  return authRequest<string>(`/api/community/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export type LikeTargetType = 'BOARD' | 'REVIEW' | 'TRIP';

export interface LikeResult {
  liked: boolean;
  likeCount: number;
}

/** 좋아요 토글 (게시글/리뷰/일정 공통) */
export function toggleLike(
  targetType: LikeTargetType,
  targetId: number,
): Promise<LikeResult> {
  return authRequest<LikeResult>('/api/community/likes', {
    method: 'POST',
    body: { targetType, targetId },
  });
}