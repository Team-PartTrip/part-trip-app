// 여행 카드(Func-003-02 · 03 · 05) API.
//
// 서버 tripcard 패키지의 DTO 를 그대로 옮겼다.
// 경로가 travel-cards 인데 테이블은 trip_card 다. 명세서(API-003-02 · 03 · 05)를 따른다.
//
// 아직 없는 것: 사진 추가 · 제거 (POST · DELETE /{cardId}/entries).
// 그래서 사진 상세 · 코멘트 화면은 예시 데이터를 계속 쓴다.

import { authRequest } from '../../shared/api/http';

export interface TripCardSummary {
  cardId: number;
  countryName: string;
  cityName: string;
  /** YYYY-MM-DD */
  startDate: string;
  endDate: string;
  /** 사용자가 올린 사진 중 대표컷. 아직 사진이 없으면 null */
  coverImageUrl: string | null;
  photoCount: number | null;
}

/** 여행 카드 목록 (D2) — 서버가 최근 여행순으로 준다 */
export function getTripCards(): Promise<TripCardSummary[]> {
  return authRequest<TripCardSummary[]>('/api/travel-cards', { method: 'GET' });
}

/** 타임라인 한 줄. 장소 방문이면 PLACE, 사진 한 장이면 PHOTO */
export interface TimelineItem {
  /** YYYY-MM-DD */
  date: string;
  type: 'PLACE' | 'PHOTO';
  placeName: string | null;
  address: string | null;
  rating: number | null;
  imageUrl: string | null;
  comment: string | null;
  /** ISO-8601 */
  takenAt: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface TripCardDetail {
  cardId: number;
  startDate: string;
  endDate: string;
  timeline: TimelineItem[];
}

/** 여행 카드 상세 (D9) */
export function getTripCard(cardId: number): Promise<TripCardDetail> {
  return authRequest<TripCardDetail>(`/api/travel-cards/${cardId}`, {
    method: 'GET',
  });
}

/** 여행 카드 삭제 (D10) — 다중 선택 */
export function deleteTripCards(cardIds: number[]): Promise<string> {
  return authRequest<string>('/api/travel-cards', {
    method: 'DELETE',
    body: { cardIds },
  });
}
