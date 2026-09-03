// 여행 플래너(Func-008) 타입.
//
// 서버 planner 패키지에는 엔티티(TravelGroupEntity · GroupTravelPlanEntity ·
// VoteEntity · VoteOptionEntity · VoteRecordEntity)만 있고 아직 컨트롤러가 없다.
// 그래서 세계지도(Func-009)와 같은 방식으로, 필드 이름을 서버 엔티티에 맞춰두고
// sampleData.ts 로 화면을 그린다. 엔드포인트가 생기면 sampleData 호출만
// api.ts 로 바꾸면 화면 코드는 그대로 쓸 수 있다.

/** 서버 GroupStatus */
export type GroupStatus =
  | 'PLANNING' // 그룹만 만들어진 상태
  | 'VOTING' // 카테고리별 투표 진행 중
  | 'CONFIRMED' // 투표가 끝나고 일정이 확정됨
  | 'TRAVELING'
  | 'DONE';

/** 서버 GroupRole */
export type GroupRole = 'OWNER' | 'MEMBER';

/** 서버 VoteStatus */
export type VoteStatus = 'OPEN' | 'CLOSED' | 'CONFIRMED';

/** 서버 TourPlaceCategory */
export type PlaceCategory =
  | 'RESTAURANT'
  | 'ATTRACTION'
  | 'ACCOMMODATION'
  | 'CAFE'
  | 'ACTIVITY'
  | 'SHOPPING';

/** 카테고리 칩·라벨에 쓰는 순서. 서버 enum 선언 순서와 같다 */
export const CATEGORIES: PlaceCategory[] = [
  'RESTAURANT',
  'ATTRACTION',
  'ACCOMMODATION',
  'CAFE',
  'ACTIVITY',
  'SHOPPING',
];

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  RESTAURANT: '맛집',
  ATTRACTION: '명소',
  ACCOMMODATION: '숙소',
  CAFE: '카페',
  ACTIVITY: '액티비티',
  SHOPPING: '쇼핑',
};

/** 썸네일 자리에 넣는 카테고리 아이콘 — 장소 이미지가 없을 때 쓴다 */
export const CATEGORY_EMOJI: Record<PlaceCategory, string> = {
  RESTAURANT: '🍜',
  ATTRACTION: '🏯',
  ACCOMMODATION: '🏨',
  CAFE: '☕',
  ACTIVITY: '🎡',
  SHOPPING: '🛍️',
};

/** 초대 진행 상태. 서버 GroupMemberEntity 에는 없고 그룹 만들기(C2)에서만 쓴다 */
export type InviteStatus = 'ME' | 'ACCEPTED' | 'PENDING';

export interface GroupMember {
  groupMemberId: number;
  userId: string;
  nickname: string;
  role: GroupRole;
  invite: InviteStatus;
}

/** TravelGroupEntity + GroupTravelPlanEntity 를 화면 한 장 기준으로 합친 것 */
export interface TravelPlan {
  planId: number;
  groupId: number;
  travelTitle: string;
  countryName: string;
  cityName: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  /** 나를 포함해 모집하려는 인원 */
  headcount: number;
  status: GroupStatus;
  members: GroupMember[];
}

export interface VoteOption {
  optionId: number;
  tourPlaceId: number | null;
  placeName: string;
  /** 이 후보를 찍은 멤버들. VoteRecordEntity 를 옵션 기준으로 모은 값 */
  voterIds: string[];
}

export interface Vote {
  voteId: number;
  planId: number;
  category: PlaceCategory;
  status: VoteStatus;
  /** ISO-8601. null 이면 마감 시각을 아직 안 정한 것 */
  deadline: string | null;
  confirmedOptionId: number | null;
  options: VoteOption[];
}

/** TourPlaceResponseDto 를 화면에서 쓰는 만큼만 옮긴 것 */
export interface TourPlace {
  tourPlaceId: number;
  placeName: string;
  category: PlaceCategory;
  /** 목록에 "★ 4.6 · 도톤보리" 로 붙는 지역 이름 */
  area: string;
  rating: number;
}

/** 인기 여행지(C3) 한 칸 */
export interface PopularCity {
  cityName: string;
  countryName: string;
  emoji: string;
}

/** 그룹 만들기 ~ 장소 담기까지 화면 사이로 들고 다니는 임시 값 */
export interface PlanDraft {
  /**
   * 서버에 만들어진 플래너 id. 아직 안 만들었으면 null 이다.
   *
   * 예전에는 '다음' 을 누르는 순간 만들었다. 그래서 여행지도 기간도 안 정하고
   * 나가면 "기간 미정" 플래너가 목록에 남았다. 지금은 투표를 시작할 때
   * (장소를 실제로 담을 때) 만든다. 초대하기를 먼저 누르면 링크가 필요해서
   * 그때 만들어지고, 그 뒤로는 이 값을 그대로 쓴다.
   */
  plannerId: number | null;
  /** 아직 안 만들었을 때 만들 재료 */
  title: string;
  isSolo: boolean;
  headcount: number;
  countryName: string;
  cityName: string;
  /** YYYY-MM-DD. 아직 안 고른 단계에서는 빈 문자열 */
  startDate: string;
  endDate: string;
}

// ── 표시용 헬퍼 ──────────────────────────────────────────────

/** "2026-08-23" → "08.23" */
export function formatShortDate(date: string): string {
  return date.slice(5).replace('-', '.');
}

/** "2026-08-23", "2026-08-27" → "08.23 – 08.27" */
export function formatRange(startDate: string, endDate: string): string {
  return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
}

/** 두 날짜 사이를 "4박 5일" 로 */
export function formatNights(startDate: string, endDate: string): string {
  const nights = Math.max(0, diffDays(startDate, endDate));
  return `${nights}박 ${nights + 1}일`;
}

/** endDate - startDate (일). 로컬 타임존 영향을 안 받게 UTC 로 계산한다 */
function diffDays(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

/** 오늘 날짜를 YYYY-MM-DD 로 */
export function today(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 마감 시각을 "오늘 21:00" / "08.26 21:00" 로 */
// '마감' 을 여기서 붙인다. 부르는 쪽에서 붙이면 마감이 없을 때
// '마감 미정 마감' 이 된다.
export function formatDeadline(deadline: string | null): string {
  if (!deadline) {
    return '마감 미정';
  }
  const [date, time = ''] = deadline.split('T');
  const hhmm = time.slice(0, 5);
  return date === today()
    ? `오늘 ${hhmm} 마감`
    : `${formatShortDate(date)} ${hhmm} 마감`;
}

/** 아바타에 넣을 한 글자 */
export function initialOf(nickname: string): string {
  return nickname.trim().charAt(0) || '?';
}

/** 아바타 색은 파랑 · 주황을 번갈아 쓴다 (피그마 C1 · C5 · C8) */
export function avatarTone(index: number): 'primary' | 'accent' {
  return index % 2 === 0 ? 'primary' : 'accent';
}

/** 계획 카드 상단 띠 · 상태 배지에 쓰는 문구 */
export function planStatusLabel(status: GroupStatus): string {
  switch (status) {
    case 'PLANNING':
      return '그룹 모집 중';
    case 'VOTING':
      return '투표 진행 중';
    case 'CONFIRMED':
      return '계획 확정';
    case 'TRAVELING':
      return '여행 중';
    default:
      return '여행 완료';
  }
}

/** 투표에 한 번이라도 참여한 멤버 수 */
export function votedMemberCount(votes: Vote[]): number {
  const voters = new Set<string>();
  votes.forEach(vote =>
    vote.options.forEach(option =>
      option.voterIds.forEach(userId => voters.add(userId)),
    ),
  );
  return voters.size;
}
