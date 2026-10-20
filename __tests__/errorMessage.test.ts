import { errorMessageOf } from '../src/shared/api/client';

describe('errorMessageOf', () => {
  it('서버가 준 평문 메시지는 그대로 쓴다', () => {
    expect(errorMessageOf(400, '이미 처리된 초대입니다.', 'x')).toBe(
      '이미 처리된 초대입니다.',
    );
  });

  it('앞단의 HTML 오류 페이지는 보여주지 않는다 (524 타임아웃)', () => {
    const html =
      '<!DOCTYPE html>\n<html><title>524: A timeout occurred</title>';
    expect(errorMessageOf(524, html, 'x')).toBe(
      '서버 응답이 늦어요. 잠시 후 다시 시도해주세요.',
    );
  });

  it('상태가 502 미만인 HTML 본문은 기본 문구로 바꾼다', () => {
    expect(
      errorMessageOf(403, '<html><body>blocked</body></html>', '기본'),
    ).toBe('기본');
  });

  it('JSON 의 message 와 기본 문구를 쓴다', () => {
    expect(errorMessageOf(400, { message: '잘못됨' }, 'x')).toBe('잘못됨');
    expect(errorMessageOf(500, null, '기본')).toBe('기본');
  });
});
