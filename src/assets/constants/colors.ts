// ─────────────────────────────────────────────────────────────
// 앱 전역 색상 상수 — 색상은 모두 이 파일에 모아 관리합니다.
// 컴포넌트에서: import colors from '../assets/constants/colors';
// ─────────────────────────────────────────────────────────────
const colors = {
  // 브랜드
  primary: '#1a7fd4',
  primaryDark: '#155fa0',

  // 기본 배경
  white: '#ffffff',
  background: '#f4f7fb',
  cardBg: '#ffffff',

  // 텍스트
  text: '#1A3D5C', // LaunchScreen 슬로건 등 기본 텍스트
  textPrimary: '#1a2a3a', // 제목/본문 진한 텍스트
  textSub: '#7a8a9a', // 보조 설명 텍스트
  textMuted: '#9ab0c4', // 흐린 텍스트(구분선 라벨 등)
  textOnPrimary: '#ffffff', // 파란 버튼 위 텍스트
  noteText: '#46566a', // 설명 박스 텍스트
  eventMeta: '#6a7a8a', // 이벤트 시간/장소 텍스트
  forgotText: '#7a9ab5', // '비밀번호를 잊으셨나요?'

  // 보더 / 구분선
  border: '#dce6f0',
  borderLight: '#e3ecf6',

  // 입력 필드
  inputBg: '#f8fafd',
  placeholder: '#aab4be',

  // 상태 / 강조
  red: '#f06b6b',
  redAccent: '#f0564b',
  teal: '#1bb89a',
  google: '#4285F4',

  // 보조 배경 / 틴트
  tint: '#e8f1fb', // 연한 파랑 배지/원형 배경
  tintStrong: '#dbe9f7', // 달력 선택 배경
  surface: '#eef2f7', // 탭바 보더 등 연한 회색
  surfaceAlt: '#f2f5f9', // 설명 박스 배경
  track: '#e9eef4', // 진행바 트랙
  profileBg: '#e8eef5', // 프로필 아이콘 배경
  tagRedBg: '#fdecec', // '음식' 태그 배경

  // 보조 아이콘 / 흐린 요소
  chevron: '#b6c2cf', // 좌우 화살표
  calMuted: '#c4ced8', // 달력 이전/다음달 날짜
  tabInactive: '#9aa7b4', // 탭바 비활성

  // 다크 영역
  bannerBg: '#2c4a66', // 여행지 배너 폴백 배경
  bannerOverlay: 'rgba(0,30,70,0.25)',
  eventThumbBg: '#1a1f2b', // 이벤트 썸네일 배경
};

export default colors;
