// 여행 카드(Func-003-02 · 03 · 05) API.
//
// 서버 tripcard 패키지의 DTO 를 그대로 옮겼다.
// 경로가 travel-cards 인데 테이블은 trip_card 다. 명세서(API-003-02 · 03 · 05)를 따른다.
//
import { BASE_URL } from '@env';
import { authRequest } from '../../shared/api/http';
import { ApiError } from '../../shared/api/client';
import { getAccessToken } from '../../shared/api/tokenStorage';

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
  /** 사진 항목의 식별자. 삭제(API-003-07)에 쓴다. 장소 항목은 null */
  entryId: number | null;
  /** YYYY-MM-DD */
  date: string;
  /** 좌표가 없는 사진은 NO_INFO_PHOTO 로 온다 */
  type: 'PLACE' | 'PHOTO' | 'NO_INFO_PHOTO';
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

/** 갤러리에서 고른 사진 한 장 */
export interface PickedPhoto {
  uri: string;
  fileName: string;
  mimeType: string;
}

export interface TripCardEntry {
  entryId: number;
  imageUrl: string;
  /** ISO-8601. 사진에 촬영 시각이 없으면 null */
  takenAt: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * 여행 카드에 사진 추가 (API-003-04)
 *
 * 멀티파트라 공통 request() 를 쓰지 않는다. JSON 헤더가 붙으면 서버가 못 읽는다.
 * 촬영 시각과 좌표는 서버가 사진의 EXIF 에서 읽으므로 따로 보내지 않는다.
 */
export async function addTripCardEntry(
  cardId: number,
  photo: PickedPhoto,
  comment?: string,
): Promise<TripCardEntry> {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append('imageFile', {
    uri: photo.uri,
    name: photo.fileName,
    type: photo.mimeType,
  } as any);
  if (comment) {
    formData.append('comment', comment);
  }

  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/travel-cards/${cardId}/entries`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch {
    throw new ApiError(0, '서버에 연결할 수 없습니다.');
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      typeof data === 'string' && data
        ? data
        : (data && data.message) || '사진을 올리지 못했어요.';
    throw new ApiError(res.status, message);
  }

  return data as TripCardEntry;
}

/** 여행 카드에서 사진 제거 (API-003-07) */
export function deleteTripCardEntry(
  cardId: number,
  entryId: number,
): Promise<void> {
  return authRequest<void>(`/api/travel-cards/${cardId}/entries/${entryId}`, {
    method: 'DELETE',
  });
}

/** 사진 코멘트 수정 (API-003-08). 빈 값을 보내면 코멘트를 지운다 */
export function updateTripCardEntryComment(
  cardId: number,
  entryId: number,
  comment: string,
): Promise<TripCardEntry> {
  return authRequest<TripCardEntry>(
    `/api/travel-cards/${cardId}/entries/${entryId}`,
    { method: 'PATCH', body: { comment } },
  );
}
