// 여행 플래너(Func-005) API.
//
// 서버 planner 패키지의 DTO 를 그대로 옮겼다. 필드 이름이 다르면
// 화면에서 헷갈리므로 임의로 줄이거나 바꾸지 않는다.
//

import { authRequest } from '../../shared/api/http';
import type {
  GroupRole,
  GroupStatus,
  PlaceCategory,
  PlanCity,
} from './types';

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
  cities?: PlanCity[];
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
  /**
   * 도는 도시들 (C4). 생략하면 countryName / cityName 한 곳만 쓰는 여행이다.
   *
   * 서버는 여행 기간을 빈틈 없이 이어 덮는지 본다. 하루라도 비면 400 이다 —
   * AI 가 그날 어느 도시에서 일정을 짤지 알 수 없기 때문이다.
   */
  cities?: PlanCity[];
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

// ── 최종 확인 (C8) ────────────────────────────────────────

/**
 * 확정된 장소 한 곳.
 *
 * 서버는 아직 voteId · optionId · voteCount 도 보내지만 투표를 없애면서(server
 * #161) 사라질 값이라 읽지 않는다. 일정은 서버 #131 의 일정 카드로 옮겨간다.
 */
export interface ConfirmedPlace {
  category: PlaceCategory;
  categoryLabel: string;
  tourPlaceId: number | null;
  placeName: string;
  imageUrl: string | null;
  address: string | null;
  rating: number | null;
  /**
   * 며칠차에 가는 곳인지 (YYYY-MM-DD).
   *
   * 지금 서버(confirmed-places)는 안 준다. 없으면 화면이 날짜 없이 한 목록으로
   * 그린다.
   */
  visitedDate?: string | null;
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
 * 일정 확정 (API-005-09). 여행 카드를 만든다.
 * 방장만 부를 수 있고, 장소가 하나도 없으면 서버가 거부한다.
 */
export function confirmPlanner(plannerId: number): Promise<PlannerConfirmed> {
  return authRequest<PlannerConfirmed>(`/api/planners/${plannerId}/confirm`, {
    method: 'POST',
  });
}

/**
 * 플래너 삭제 (API-005-12).
 *
 * 그룹장만 부를 수 있다. 멤버·초대까지 함께 지워진다.
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
