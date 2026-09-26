// 여행 플래너(Func-005) API.
//
// 서버 planner 패키지의 DTO 를 그대로 옮겼다. 필드 이름이 다르면
// 화면에서 헷갈리므로 임의로 줄이거나 바꾸지 않는다.
//

import { authRequest } from '../../shared/api/http';
import type { GroupRole, GroupStatus, PlaceCategory } from './types';

// ── 플래너 ────────────────────────────────────────────────

export interface PlannerListItem {
  plannerId: number;
  title: string;
  regionCode: string | null;
  regionName: string | null;
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
export function getPlannerMembers(plannerId: number): Promise<PlannerMember[]> {
  return authRequest<PlannerMember[]>(`/api/planners/${plannerId}/members`, {
    method: 'GET',
  });
}

/** 블록 한 종류. 서버가 목록을 들고 있고 앱은 받아서 그린다 */
export interface PlannerBlock {
  /** 서버 PlannerBlockType. 예) TRAVEL_TYPE */
  type: string;
  label: string;
  /** 여러 값을 같이 고를 수 있는지 */
  multiple: boolean;
  /** 고르기 쉽게 보여주는 예시 값 */
  options: string[];
}

/** 블록 목록 (GET /api/planners/blocks) */
export function getBlocks(): Promise<PlannerBlock[]> {
  return authRequest<PlannerBlock[]>('/api/planners/blocks', { method: 'GET' });
}

export interface GeneratePlannerPayload {
  title: string;
  memberCount: number;
  isSolo: boolean;
  regionCode: string;
  cityName: string;
  /** YYYY-MM-DD. 최대 14일 */
  startDate: string;
  endDate: string;
  blocks: { type: string; value: string }[];
}

export interface SchedulePlace {
  tourPlaceId: number;
  name: string;
  category: PlaceCategory | null;
  categoryLabel: string | null;
  imageUrl: string | null;
  address: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ScheduleSlot {
  slotId: number;
  order: number;
  /** AI 가 못 채운 칸은 null. 앱은 + 버튼을 띄운다 */
  place: SchedulePlace | null;
}

export interface PlannerSchedule {
  plannerId: number;
  title: string;
  cityName: string;
  startDate: string;
  endDate: string;
  days: { date: string; slots: ScheduleSlot[] }[];
}

export function generatePlanner(
  payload: GeneratePlannerPayload,
): Promise<PlannerSchedule> {
  return authRequest<PlannerSchedule>('/api/planners/generate', {
    method: 'POST',
    body: payload,
  });
}

/** 날짜별 일정 카드 (GET /api/planners/{id}/schedule) */
export function getSchedule(plannerId: number): Promise<PlannerSchedule> {
  return authRequest<PlannerSchedule>(`/api/planners/${plannerId}/schedule`, {
    method: 'GET',
  });
}

export interface SaveSchedulePayload {
  days: {
    date: string;
    /** 배열 순서가 카드 순서다. 새 칸은 slotId 가 null, 빈 칸은 tourPlaceId 가 null */
    slots: { slotId: number | null; tourPlaceId: number | null }[];
  }[];
}

export function saveSchedule(
  plannerId: number,
  payload: SaveSchedulePayload,
): Promise<PlannerSchedule> {
  return authRequest<PlannerSchedule>(`/api/planners/${plannerId}/schedule`, {
    method: 'PUT',
    body: payload,
  });
}

/** 빈 칸에 넣을 장소 검색. 그날 이미 들어간 곳은 서버가 뺀다 */
export function getScheduleCandidates(
  plannerId: number,
  date: string,
  query: string,
): Promise<SchedulePlace[]> {
  const params = new URLSearchParams({ date, q: query });
  return authRequest<SchedulePlace[]>(
    `/api/planners/${plannerId}/schedule/candidates?${params.toString()}`,
    { method: 'GET' },
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
  regionCode: string | null;
  regionName: string | null;
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
