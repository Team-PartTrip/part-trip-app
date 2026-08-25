// 홈(B1) 의 "여행 준비" 영역 데이터.
//
// 준비율·항공/숙소/일정 상태·대기 중인 투표 수는 플래너 API(이슈 #65) 가
// 생겨야 실제 값을 받을 수 있다. 그때 화면을 고치지 않아도 되도록
// 필드 이름을 서버가 내려줄 모양 그대로 정해두고, 지금은 예시 값을 쓴다.

export type PrepStatus = 'CONFIRMED' | 'VOTING' | 'TODO';

export const PREP_STATUS_LABEL: Record<PrepStatus, string> = {
  CONFIRMED: '확정',
  VOTING: '투표 중',
  TODO: '미정',
};

export interface TripReadiness {
  /** 준비 진행률 0~100 */
  percent: number;
  flight: PrepStatus;
  accommodation: PrepStatus;
  schedule: PrepStatus;
  /** 여행 그룹 인원 수 */
  memberCount: number;
  /** 아직 결과가 안 난 투표 수 */
  pendingVotes: number;
  checklistDone: number;
  checklistTotal: number;
}

/** 피그마 B1 에 그려진 값 그대로 (67% · 확정/확정/투표 중 · 4명) */
export const SAMPLE_READINESS: TripReadiness = {
  percent: 67,
  flight: 'CONFIRMED',
  accommodation: 'CONFIRMED',
  schedule: 'VOTING',
  memberCount: 4,
  pendingVotes: 3,
  checklistDone: 8,
  checklistTotal: 12,
};
