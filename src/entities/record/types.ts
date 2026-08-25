// 기록 탭(Func-005) · 여행 카드(Func-003) 타입.
//
// 서버에는 엔티티(PhotoEntity · PhotoCommentHistoryEntity · TripCardEntity ·
// TripCardPlaceEntity · TripCardPhotoEntity)만 있고 /api/records ·
// /api/trip-cards 컨트롤러는 아직 없다. api.ts 의 함수들도 그래서 아직 못 쓴다.
// 플래너·세계지도와 같은 방식으로 필드 이름을 서버 엔티티에 맞춰두고
// sampleData.ts 로 화면을 그린다.

/** TripCardEntity — 여행 하나당 카드 한 장 */
export interface TripCard {
  tripCardId: number;
  planId: number | null;
  title: string;
  countryName: string;
  cityName: string;
  /**
   * 카드 앞면에 크게 넣는 로마자 도시명(D9). 서버 trip_card 에는 없는 값이라
   * 없으면 cityName 을 그대로 쓴다.
   */
  cityNameEn?: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  companionCount: number;
  placeCount: number;
  photoCount: number;
  distanceKm: number;
}

/** TripCardPlaceEntity + 그 장소에서 찍은 사진 수 (D1 촬영 위치) */
export interface PhotoSpot {
  tripCardPlaceId: number;
  tripCardId: number;
  placeName: string;
  address: string;
  /** YYYY-MM-DD */
  visitedDate: string;
  photoCount: number;
  /** 지도 핀 위치를 0~1 비율로. 지도 SDK 를 붙이면 위/경도로 바꾼다 */
  x: number;
  y: number;
}

/** PhotoEntity (+ PhotoAnalysisEntity 의 해설) */
export interface Photo {
  photoId: number;
  tripCardId: number;
  tripCardPlaceId: number;
  /** 사진 제목 — 서버 comm_title */
  commTitle: string;
  /** 코멘트 — 서버 comm_content. 아직 안 쓴 사진은 빈 문자열 */
  commContent: string;
  /** 촬영 위치 이름 ("오사카 주오구") */
  areaName: string;
  /** ISO-8601 로컬 시각 */
  takenAt: string;
  /** AI 해설. 분석 결과가 없으면 null */
  aiSummary: string | null;
  tags: string[];
  /** 코멘트를 마지막으로 고친 시각. 한 번도 안 고쳤으면 null */
  commentUpdatedAt: string | null;
}

/** PhotoCommentHistoryEntity — 코멘트 수정 이력(D5) */
export interface CommentRevision {
  photoCommentHistoryId: number;
  revision: number;
  createdAt: string;
}

/** 여행 카드 상세(D10) 타임라인 한 칸 */
export interface TripCardEntry {
  /** 장소 방문인지 사진 한 장인지 */
  kind: 'place' | 'photo';
  id: number;
  /** YYYY-MM-DD — 날짜가 바뀌는 지점에 구분선을 넣는다 */
  date: string;
  /** 이미지 자리에 넣을 설명 (실제 이미지가 붙기 전까지) */
  imageCaption: string;
  title: string;
  subtitle: string;
}

// ── 표시용 헬퍼 ──────────────────────────────────────────────

/** "2026-08-23" → "2026.08.23" */
export function formatDotDate(date: string): string {
  return date.replace(/-/g, '.');
}

/** "2026-08-23" → "08.23" */
export function formatShortDate(date: string): string {
  return date.slice(5).replace('-', '.');
}

/** 시작·종료를 "2026.08.23 – 08.27" 로. 해가 바뀌면 뒤에도 연도를 붙인다 */
export function formatTripRange(startDate: string, endDate: string): string {
  const tail =
    startDate.slice(0, 4) === endDate.slice(0, 4)
      ? formatShortDate(endDate)
      : formatDotDate(endDate);
  return `${formatDotDate(startDate)} – ${tail}`;
}

/** "2026-08-23T19:42:00" → "2026.08.23 19:42" */
export function formatDateTime(iso: string): string {
  const [date, time = ''] = iso.split('T');
  return `${formatDotDate(date)} ${time.slice(0, 5)}`;
}

/** 오늘 날짜를 YYYY-MM-DD 로 */
export function today(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** 여행 카드 앞면에 크게 넣는 이름 */
export function cardTitleOf(card: TripCard): string {
  return (card.cityNameEn ?? card.cityName).toUpperCase();
}

/** 오늘이 여행 기간 안이면 true — D2 카드의 "여행 중" 배지 */
export function isTraveling(card: TripCard): boolean {
  return card.startDate <= today() && today() <= card.endDate;
}
