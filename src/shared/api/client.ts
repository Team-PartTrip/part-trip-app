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

export function errorMessageOf(
  status: number,
  data: unknown,
  fallback: string,
): string {
  if (typeof data === 'string' && data) {
    if (/^\s*<(!doctype|html)/i.test(data)) {
      return status >= 502
        ? '서버 응답이 늦어요. 잠시 후 다시 시도해주세요.'
        : fallback;
    }
    return data;
  }
  return (data && (data as any).message) || fallback;
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
    // 무료 ngrok 도메인이 띄우는 브라우저 경고 페이지(HTML) 우회용 헤더
    'ngrok-skip-browser-warning': 'true',
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
      '서버에 연결하지 못했어요. 인터넷 연결을 확인해주세요.',
    );
  }

  const data = await parseBody(res);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      errorMessageOf(res.status, data, '요청을 처리하지 못했어요.'),
    );
  }

  return data as T;
}
