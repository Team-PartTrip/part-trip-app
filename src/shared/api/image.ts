import { BASE_URL } from '@env';
import { ApiError } from './client';
import { expireSession, refreshAccessToken } from './http';
import { getAccessToken, getSessionGeneration } from './tokenStorage';

/** 로컬 파일(uri)을 서버에 업로드하고, 서버가 반환한 상대경로(/images/xxx.jpg)를 반환 */
export async function uploadImage(
  uri: string,
  fileName: string,
  mimeType: string,
): Promise<string> {
  const generation = getSessionGeneration();
  const send = async (token: string | null): Promise<Response> => {
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

    try {
      return await fetch(`${BASE_URL}/api/profile/image`, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch {
      throw new ApiError(0, '서버에 연결할 수 없습니다.');
    }
  };

  const token = await getAccessToken();
  if (getSessionGeneration() !== generation) {
    throw new ApiError(401, '로그인 정보가 바뀌었어요. 다시 시도해주세요.');
  }
  let res = await send(token);
  // multipart 라 authRequest 를 못 쓴다. 그래서 갱신도 여기서 한 번 한다.
  // 안 하면 토큰이 만료된 뒤로는 사진만 계속 올라가지 않는다.
  if (res.status === 401) {
    const fresh = await refreshAccessToken();
    if (getSessionGeneration() !== generation) {
      throw new ApiError(401, '로그인 정보가 바뀌었어요. 다시 시도해주세요.');
    }
    if (fresh) {
      res = await send(fresh);
    } else {
      // 서버가 리프레시 토큰을 거부한 것이다. authRequest 와 같은 자리를
      // 지나 토큰을 지우고 로그인 화면으로 보낸다. 안 하면 사진만 계속
      // 실패하고 세션은 살아 있는 것처럼 남는다.
      await expireSession(generation);
      throw new ApiError(401, '로그인이 만료되었어요. 다시 로그인해주세요.');
    }
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

  // 서버는 경로를 그냥 문자열로 준다 (ProfileController 가 ResponseEntity<String>).
  // JSON.parse 가 실패해 data 에 그 문자열이 그대로 담긴다. 예전에는 data.url 을
  // 읽어서 늘 undefined 가 나왔고, 그래서 사진을 골라도 아무 일이 없었다.
  const url = typeof data === 'string' ? data.trim() : data?.url;
  if (!url) {
    throw new ApiError(res.status, '업로드 응답을 이해할 수 없습니다.');
  }
  return url as string;
}

/** 서버가 반환한 상대경로를 <Image>에 바로 쓸 수 있는 절대 URL로 변환 */
export function toImageUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE_URL}${path}`;
}
