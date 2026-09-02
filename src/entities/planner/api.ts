// 여행 플래너(Func-005) API.
//
// 서버 planner 패키지의 DTO 를 그대로 옮겼다. 필드 이름이 다르면
// 화면에서 헷갈리므로 임의로 줄이거나 바꾸지 않는다.
//

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
  /** 초대 링크. 서버가 코드가 아니라 링크로 내려준다(server f248378) */
  inviteLink: string;
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
  /** 다른 멤버가 참여할 때 여는 초대 링크 */
  inviteLink: string;
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

/** 후보 빼기 (담은 사람 또는 OWNER) */
export function deleteVoteOption(
  plannerId: number,
  voteId: number,
  optionId: number,
): Promise<void> {
  return authRequest<void>(
    `/api/planners/${plannerId}/votes/${voteId}/options/${optionId}`,
    { method: 'DELETE' },
  );
}

/**
 * 멤버 내보내기 (API-005-22).
 *
 * 그룹장만 부를 수 있고, 그룹장 자신은 뺄 수 없다.
 */
export function removePlannerMember(
  plannerId: number,
  memberUserId: string,
): Promise<void> {
  return authRequest<void>(
    `/api/planners/${plannerId}/members/${encodeURIComponent(memberUserId)}`,
    { method: 'DELETE' },
  );
}

export interface VoteReminder {
  /** 알림을 받은 사람 수. 전원이 투표를 마쳤으면 0 */
  notifiedCount: number;
  message: string;
}

/**
 * 투표 독촉 알림 (API-005-29).
 *
 * 열린 투표에 아직 참여하지 않은 멤버에게만 알림이 간다.
 * 그룹장만 부를 수 있고, 열린 투표가 없으면 서버가 거부한다.
 */
export function remindVotes(plannerId: number): Promise<VoteReminder> {
  return authRequest<VoteReminder>(`/api/planners/${plannerId}/votes/remind`, {
    method: 'POST',
  });
}

// ── 장바구니 (C4 · C6) ────────────────────────────────────

/**
 * 고른 관광지를 한 번에 담는다 (C4).
 *
 * 서버가 카테고리별로 알아서 투표를 만들고 그 후보로 넣어준다.
 * 그래서 담긴 목록을 다시 볼 때는 getVotes 를 쓰면 된다.
 * 이미 담긴 장소는 건너뛰고, 성공 문구("N개 장소를 …")를 돌려준다.
 */
export function addCartPlaces(
  plannerId: number,
  placeIds: number[],
): Promise<string> {
  return authRequest<string>(`/api/planners/${plannerId}/cart`, {
    method: 'POST',
    body: { placeIds },
  });
}

export interface RandomPlace {
  placeId: number;
  placeName: string;
}

/** 담은 후보 중 하나를 서버가 무작위로 뽑아준다 (C6 랜덤 뽑기) */
export function drawRandomPlace(plannerId: number): Promise<RandomPlace> {
  return authRequest<RandomPlace>(`/api/planners/${plannerId}/cart/random`, {
    method: 'POST',
  });
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

export interface PlannerConfirmed {
  plannerId: number;
  confirmedSchedule: ConfirmedPlace[];
  /** 확정과 함께 만들어진 여행 카드. 기록 탭이 이걸로 채워진다 */
  tripCardId: number | null;
}

/**
 * 일정 확정 (API-005-09).
 *
 * 열린 투표를 모두 마감·확정하고 여행 카드를 만든다.
 * 방장만 부를 수 있고, 담긴 장소가 하나도 없으면 서버가 거부한다.
 */
export function confirmPlanner(plannerId: number): Promise<PlannerConfirmed> {
  return authRequest<PlannerConfirmed>(
    `/api/planners/${plannerId}/confirm`,
    { method: 'POST' },
  );
}

/**
 * 플래너 삭제 (API-005-12).
 *
 * 그룹장만 부를 수 있다. 투표·멤버·초대까지 함께 지워진다.
 * 확정으로 만들어진 여행 카드는 남고 플래너와의 연결만 끊긴다.
 */
export function deletePlanner(plannerId: number): Promise<void> {
  return authRequest<void>(`/api/planners/${plannerId}`, { method: 'DELETE' });
}

/** 확정된 장소 목록 (C8) */
export function getConfirmedPlaces(plannerId: number): Promise<PlannerFinal> {
  return authRequest<PlannerFinal>(
    `/api/planners/${plannerId}/confirmed-places`,
    { method: 'GET' },
  );
}

/** 인기 여행지 한 줄 (API-005-11). 서버는 이모지를 들고 있지 않다 */
export interface PopularCityResponse {
  cityName: string;
  countryName: string;
  /** 이 도시로 만들어진 여행 계획 수 */
  planCount: number;
}

/** 인기 여행지 (API-005-11) — 여행 계획이 많이 만들어진 도시 순 */
export function getPopularCities(limit = 8): Promise<PopularCityResponse[]> {
  return authRequest<PopularCityResponse[]>(
    `/api/main/popular-cities?limit=${limit}`,
    { method: 'GET' },
  );
}
