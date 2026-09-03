// 기록 탭·여행 카드 화면의 날짜 표시 헬퍼.
//
// 타입은 여기 두지 않는다. 서버 응답 그대로인 것들이라 api.ts 에 있다.

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

/** 오늘 날짜를 YYYY-MM-DD 로 */
export function today(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
