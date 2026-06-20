import { BASE_URL } from '@env';

/** 서버가 내려준 상태코드와 메시지를 담는 에러 */
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

/** 응답 본문을 JSON이면 객체로, 아니면 문자열로 파싱 */
async function parseBody(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

/**
 * 공통 요청 함수.
 * - 성공: 파싱된 본문(JSON 객체 또는 문자열) 반환
 * - 실패: ApiError throw (백엔드는 400 + 평문 메시지로 에러를 내려줌)
 */
export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'POST', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // 네트워크 자체가 실패한 경우 (서버 꺼짐, 주소 오류, 와이파이 등)
    throw new ApiError(
      0,
      '서버에 연결할 수 없습니다. 네트워크와 서버 주소(BASE_URL)를 확인해주세요.',
    );
  }

  const data = await parseBody(res);

  if (!res.ok) {
    const message =
      typeof data === 'string' && data
        ? data
        : (data && (data as any).message) || '요청에 실패했습니다.';
    throw new ApiError(res.status, message);
  }

  return data as T;
}
