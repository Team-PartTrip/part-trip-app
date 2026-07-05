import { BASE_URL } from '@env';
import { ApiError } from './client';
import { getAccessToken } from './tokenStorage';

/** 로컬 파일(uri)을 서버에 업로드하고, 서버가 반환한 상대경로(/images/xxx.jpg)를 반환 */
export async function uploadImage(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const token = await getAccessToken();

  const formData = new FormData();
  // React Native의 fetch/FormData는 이 형태의 객체를 파일로 인식한다
  formData.append('file', {
    uri,
    name: fileName,
    type: mimeType,
  } as any);

  const headers: Record<string, string> = {
    'ngrok-skip-browser-warning': 'true',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/community/images`, {
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
        : (data && data.message) || '이미지 업로드에 실패했습니다.';
    throw new ApiError(res.status, message);
  }

  return data.url as string;
}

/** 서버가 반환한 상대경로를 <Image>에 바로 쓸 수 있는 절대 URL로 변환 */
export function toImageUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL}${path}`;
}
