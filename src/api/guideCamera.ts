import { BASE_URL } from '@env';
import { ApiError } from './client';
import { getAccessToken } from './tokenStorage';
import { authRequest } from './http';

export interface GuideCameraUploadResult {
  imageId: number;
  analysisId: number;
}

/** 해설 카메라 사진 업로드 (촬영 즉시 서버에서 분석까지 완료되어 결과가 반환됨) */
export async function uploadGuideCameraPhoto(
  uri: string,
  fileName: string,
  mimeType: string,
  latitude: number,
  longitude: number,
  travelId?: string,
): Promise<GuideCameraUploadResult> {
  const token = await getAccessToken();

  const formData = new FormData();
  formData.append('imageFile', {
    uri,
    name: fileName,
    type: mimeType,
  } as any);
  formData.append('latitude', String(latitude));
  formData.append('longitude', String(longitude));
  if (travelId) formData.append('travelId', travelId);

  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/guide-camera/images`, {
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
        : (data && data.message) || '사진 분석에 실패했습니다.';
    throw new ApiError(res.status, message);
  }

  return data as GuideCameraUploadResult;
}

export interface PhotoAnalysis {
  analysisId: number;
  photoId: number;
  title: string;
  era: string | null;
  designation: string | null;
  overview: string;
  background: string | null;
  features: string | null;
  current_status: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  photoAnalysisAccuracyCategory: string;
}

/** 분석 결과 조회 */
export function getAnalysisResult(imageId: number): Promise<PhotoAnalysis> {
  return authRequest<PhotoAnalysis>(`/api/guide-camera/results/${imageId}`, {
    method: 'GET',
  });
}

export interface NearbyPlaceRecommendation {
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  sourceName: string | null;
  sourceUrl: string | null;
}

/** 현재 위치 기준 주변 명소 추천 */
export function getNearbyRecommendations(
  latitude: number,
  longitude: number,
): Promise<NearbyPlaceRecommendation[]> {
  return authRequest<NearbyPlaceRecommendation[]>(
    `/api/guide-camera/recommendations?latitude=${latitude}&longitude=${longitude}`,
    { method: 'GET' },
  );
}

export interface GuideCameraRecordPayload {
  photoId: number;
  commTitle?: string;
  commContent?: string;
  photoDate?: string;
}

/** 촬영한 사진에 제목/코멘트/날짜 기록 저장 */
export function saveGuideCameraRecord(
  payload: GuideCameraRecordPayload,
): Promise<PhotoAnalysis> {
  return authRequest<PhotoAnalysis>('/api/guide-camera/records', {
    method: 'POST',
    body: payload,
  });
}

export interface GuideCameraMissionPayload {
  targetPlaceName: string;
  placeType?: string;
  latitude?: number;
  longitude?: number;
}

export interface GuideCameraMission {
  missionId: number;
  missionType: string;
  title: string;
  description: string;
  targetPlaceName: string;
  placeType: string | null;
  latitude: number | null;
  longitude: number | null;
  completed: boolean;
  createDate: string;
}

/** 주변 명소를 기반으로 해설 카메라 미션 생성 */
export function createGuideCameraMission(
  payload: GuideCameraMissionPayload,
): Promise<GuideCameraMission> {
  return authRequest<GuideCameraMission>('/api/guide-camera/missions', {
    method: 'POST',
    body: payload,
  });
}
