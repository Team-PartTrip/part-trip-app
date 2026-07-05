import { authRequest } from './http';

export interface TripPlaceDto {
  tripPlaceId: number;
  dayNumber: number;
  placeName: string;
  placeSub: string | null;
}

export interface TripDto {
  tripId: number;
  userId: string;
  nickName: string;
  title: string;
  countryInfoId: number;
  countryName: string | null;
  cityName: string | null;
  startDate: string | null;
  endDate: string | null;
  content: string | null;
  isPublic: boolean;
  createDate: string;
  places: TripPlaceDto[];
}

export interface TripPlacePayload {
  dayNumber: number;
  placeName: string;
  placeSub?: string;
}

export interface TripPayload {
  title: string;
  countryInfoId: number;
  startDate?: string;
  endDate?: string;
  content?: string;
  places: TripPlacePayload[];
}

/** 일정 생성 */
export function createTrip(payload: TripPayload): Promise<TripDto> {
  return authRequest<TripDto>('/api/trips', {
    method: 'POST',
    body: payload,
  });
}

/** 내가 만든 일정 목록 */
export function getMyTrips(): Promise<TripDto[]> {
  return authRequest<TripDto[]>('/api/trips/mine', { method: 'GET' });
}

/** 일정 상세 (본인 소유이거나 공개된 일정) */
export function getTrip(tripId: number): Promise<TripDto> {
  return authRequest<TripDto>(`/api/trips/${tripId}`, { method: 'GET' });
}
