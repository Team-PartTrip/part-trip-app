// 여행 플래너(Func-005) API.
//
// 서버 planner 패키지의 DTO 를 그대로 옮겼다. 필드 이름이 다르면
// 화면에서 헷갈리므로 임의로 줄이거나 바꾸지 않는다.
//
// 아직 없는 것: 투표 후보 등록·삭제 (서버 PR #79 대기).
// 그래서 C4 장소 담기 · C6 장바구니는 예시 데이터를 계속 쓴다.

import { authRequest } from '../../shared/api/http';
import type { GroupRole, GroupStatus, PlaceCategory, VoteStatus } from './types';

// ── 플래너 ────────────────────────────────────────────────

export interface PlannerListItem {
  plannerId: number;
  title: string;
  countryName: string | null;
  cityName: string | null;
  /** YYYY-MM-DD. 여행지·기간을 아직 안 정했으면 null */
  startDate: string | null;
  endDate: string | null;
  status: GroupStatus;
  role: GroupRole;
  /** 모집하려는 인원 */
  memberCount: number;
  /** 실제로 참여한 인원 */
  joinedMemberCount: number;
}

/** 내 플래너 목록 (C1) */
export function getPlanners(): Promise<PlannerListItem[]> {
  return authRequest<PlannerListItem[]>('/api/planners', { method: 'GET' });
}

export interface PlannerDetail extends PlannerListItem {
  inviteCode: string;
}

/** 플래너 상세 (C7 헤더) */
export function getPlanner(plannerId: number): Promise<PlannerDetail> {
  return authRequest<PlannerDetail>(`/api/planners/${plannerId}`, {
    method: 'GET',
  });
}

export interface CreatePlannerPayload {
  title: string;
  memberCount: number;
  /** 혼자 가는 여행이면 true. 그러면 초대 없이 바로 진행한다 */
  isSolo: boolean;
  countryName?: string;
  cityName?: string;
  startDate?: string;
  endDate?: string;
}

export interface PlannerCreated {
  plannerId: number;
  title: string;
  status: GroupStatus;
  memberCount: number;
  startDate: string | null;
  endDate: string | null;
  countryName: string | null;
  cityName: string | null;
  /** 다른 멤버가 참여할 때 쓰는 코드 */
  inviteCode: string;
}

/** 플래너(여행 그룹) 만들기 (C2) */
export function createPlanner(
  payload: CreatePlannerPayload,
): Promise<PlannerCreated> {
  return authRequest<PlannerCreated>('/api/planners', {
    method: 'POST',
    body: payload,
  });
}

export interface PlannerJoined {
  plannerId: number;
  title: string;
  role: GroupRole;
  status: GroupStatus;
  memberCount: number;
  joinedMemberCount: number;
}

/** 초대 코드로 참여 (C2) */
export function joinPlanner(inviteCode: string): Promise<PlannerJoined> {
  return authRequest<PlannerJoined>('/api/planners/join', {
    method: 'POST',
    body: { inviteCode },
  });
}

export interface PlannerMember {
  userId: string;
  nickName: string;
  role: GroupRole;
  /** ISO-8601 */
  joinedAt: string;
}

/** 플래너 멤버 목록 (C2 · C7) */
export function getPlannerMembers(
  plannerId: number,
): Promise<PlannerMember[]> {
  return authRequest<PlannerMember[]>(`/api/planners/${plannerId}/members`, {
    method: 'GET',
  });
}

export interface SaveTravelPlanPayload {
  countryName: string;
  cityName: string;
  startDate: string;
  endDate: string;
}

export interface PlannerTravelPlan {
  plannerId: number;
  planId: number;
  title: string;
  countryName: string;
  cityName: string;
  startDate: string;
  endDate: string;
}

/** 여행지 · 기간 정하기 (C3) */
export function saveTravelPlan(
  plannerId: number,
  payload: SaveTravelPlanPayload,
): Promise<PlannerTravelPlan> {
  return authRequest<PlannerTravelPlan>(
    `/api/planners/${plannerId}/travel-plan`,
    { method: 'PUT', body: payload },
  );
}

// ── 투표 ──────────────────────────────────────────────────

export interface VoteOptionStatus {
  optionId: number;
  tourPlaceId: number | null;
  placeName: string;
  imageUrl: string | null;
  address: string | null;
  rating: number | null;
  /** 이 후보를 담은 사람 */
  addedByUserId: string;
  voteCount: number;
  /** 내가 이 후보를 골랐는지 */
  selectedByMe: boolean;
  confirmed: boolean;
}

export interface VoteStatusInfo {
  voteId: number;
  plannerId: number;
  category: PlaceCategory;
  categoryLabel: string;
  status: VoteStatus;
  /** ISO-8601. 마감 시각을 안 정했으면 null */
  deadline: string | null;
  deadlinePassed: boolean;
  /** 투표할 수 있는 인원 */
  eligibleMemberCount: number;
  /** 실제로 투표한 인원 */
  votedMemberCount: number;
  confirmedOptionId: number | null;
  options: VoteOptionStatus[];
}

/** 카테고리별 투표 현황 전체 (C7) */
export function getVotes(plannerId: number): Promise<VoteStatusInfo[]> {
  return authRequest<VoteStatusInfo[]>(`/api/planners/${plannerId}/votes`, {
    method: 'GET',
  });
}

/** 투표 하나의 현황 (C5) */
export function getVote(
  plannerId: number,
  voteId: number,
): Promise<VoteStatusInfo> {
  return authRequest<VoteStatusInfo>(
    `/api/planners/${plannerId}/votes/${voteId}`,
    { method: 'GET' },
  );
}

export interface CreateVotePayload {
  category: PlaceCategory;
  /** ISO-8601. 생략하면 마감 없는 투표가 된다 */
  deadline?: string;
}

export interface VoteCreated {
  voteId: number;
  plannerId: number;
  planId: number;
  category: PlaceCategory;
  categoryLabel: string;
  status: VoteStatus;
  deadline: string | null;
  createdAt: string;
}

/** 카테고리 투표 만들기 */
export function createVote(
  plannerId: number,
  payload: CreateVotePayload,
): Promise<VoteCreated> {
  return authRequest<VoteCreated>(`/api/planners/${plannerId}/votes`, {
    method: 'POST',
    body: payload,
  });
}

export interface VoteBallot {
  voteRecordId: number;
  voteId: number;
  optionId: number;
  placeName: string;
  /** 이미 투표한 상태에서 다른 후보로 바꾼 경우 true */
  changed: boolean;
  votedAt: string;
}

/** 투표하기 · 선택 바꾸기 (C5) */
export function castBallot(
  plannerId: number,
  voteId: number,
  optionId: number,
): Promise<VoteBallot> {
  return authRequest<VoteBallot>(
    `/api/planners/${plannerId}/votes/${voteId}/ballot`,
    { method: 'PUT', body: { optionId } },
  );
}

export interface VoteClosed {
  voteId: number;
  status: VoteStatus;
  totalVoteCount: number;
  highestVoteCount: number;
  /** 1등이 여럿이면 여러 개가 온다 */
  topOptionIds: number[];
  tied: boolean;
}

/** 투표 마감 (OWNER) */
export function closeVote(
  plannerId: number,
  voteId: number,
): Promise<VoteClosed> {
  return authRequest<VoteClosed>(
    `/api/planners/${plannerId}/votes/${voteId}/close`,
    { method: 'POST' },
  );
}

export interface VoteConfirmed {
  voteId: number;
  voteStatus: VoteStatus;
  confirmedOptionId: number;
  tourPlaceId: number | null;
  placeName: string;
  voteCount: number;
  /** 모든 투표가 확정되면 플래너 상태도 함께 바뀐다 */
  plannerStatus: GroupStatus;
}

/** 최종 후보 확정 (OWNER). 동점이면 optionId 로 하나를 고른다 */
export function confirmVote(
  plannerId: number,
  voteId: number,
  optionId: number,
): Promise<VoteConfirmed> {
  return authRequest<VoteConfirmed>(
    `/api/planners/${plannerId}/votes/${voteId}/confirm`,
    { method: 'POST', body: { optionId } },
  );
}

// ── 최종 확인 (C8) ────────────────────────────────────────

export interface ConfirmedPlace {
  voteId: number;
  category: PlaceCategory;
  categoryLabel: string;
  optionId: number;
  tourPlaceId: number | null;
  placeName: string;
  imageUrl: string | null;
  address: string | null;
  rating: number | null;
  voteCount: number;
}

export interface PlannerFinal {
  plannerId: number;
  title: string;
  countryName: string;
  cityName: string;
  startDate: string;
  endDate: string;
  status: GroupStatus;
  places: ConfirmedPlace[];
}

/** 확정된 장소 목록 (C8) */
export function getConfirmedPlaces(plannerId: number): Promise<PlannerFinal> {
  return authRequest<PlannerFinal>(
    `/api/planners/${plannerId}/confirmed-places`,
    { method: 'GET' },
  );
}
