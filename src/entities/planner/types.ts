// 여행 플래너(Func-008) 타입.
//
// 필드 이름은 서버 planner 패키지에 맞춘다.

/** 서버 GroupStatus */
export type GroupStatus =
  | 'PLANNING' // 그룹만 만들어진 상태
  // 투표를 없앴지만(server #161) 그 전에 만든 플래너는 아직 이 상태로 온다
  | 'VOTING'
  | 'CONFIRMED' // 일정이 확정됨
  | 'TRAVELING'
  | 'DONE';

/** 서버 GroupRole */
export type GroupRole = 'OWNER' | 'MEMBER';

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

/** 초대 진행 상태. 서버 GroupMemberEntity 에는 없고 그룹 만들기(C2)에서만 쓴다 */
export type InviteStatus = 'ME' | 'ACCEPTED' | 'PENDING';

export interface GroupMember {
  groupMemberId: number;
  userId: string;
  nickname: string;
  role: GroupRole;
  invite: InviteStatus;
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

/** 그룹 만들기 ~ 장소 담기까지 화면 사이로 들고 다니는 임시 값 */
/** 여행 만들기 단계 사이에 넘기는 값. 마지막 단계에서 AI 초안과 함께 플래너가 만들어진다 */
export interface PlanDraft {
  title: string;
  isSolo: boolean;
  headcount: number;
  /** YYYY-MM-DD. 아직 안 고른 단계에서는 빈 문자열 */
  startDate: string;
  endDate: string;
}

// ── 표시용 헬퍼 ──────────────────────────────────────────────

/** "2026-08-23" → "08.23" */
export function formatShortDate(date: string): string {
  return date.slice(5).replace('-', '.');
}

/** 시작일로부터 며칠차인지. 타임존에 안 흔들리게 UTC 로 센다 */
function dayNumber(startDate: string, date: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const day = Date.parse(`${date}T00:00:00Z`);
  return Math.max(1, Math.round((day - start) / 86_400_000) + 1);
}

/** "1일차 · 10.12" */
export function dayLabel(startDate: string, date: string): string {
  return `${dayNumber(startDate, date)}일차 · ${formatShortDate(date)}`;
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
      return '일정 만드는 중';
    case 'CONFIRMED':
      return '계획 확정';
    case 'TRAVELING':
      return '여행 중';
    default:
      return '여행 완료';
  }
}
