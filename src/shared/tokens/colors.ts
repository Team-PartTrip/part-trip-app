import { Appearance } from 'react-native';

export type AppColors = {
  primary: string;
  primaryDark: string;
  white: string;
  background: string;
  cardBg: string;
  text: string;
  textPrimary: string;
  textSub: string;
  textMuted: string;
  textOnPrimary: string;
  noteText: string;
  eventMeta: string;
  forgotText: string;
  border: string;
  borderLight: string;
  inputBg: string;
  placeholder: string;
  red: string;
  redAccent: string;
  teal: string;
  google: string;
  tint: string;
  tintStrong: string;
  surface: string;
  surfaceAlt: string;
  track: string;
  profileBg: string;
  tagRedBg: string;
  chevron: string;
  calMuted: string;
  tabInactive: string;
  bannerBg: string;
  bannerOverlay: string;
  eventThumbBg: string;
};

// ── 라이트 모드 ──────────────────────────────────────────────
export const lightColors: AppColors = {
  // 브랜드
  primary: '#1a7fd4', // 메인 파랑 (버튼/강조)
  primaryDark: '#155fa0', // 진한 파랑 (로고 Trip 등)

  // 기본 배경
  white: '#ffffff', // 흰 표면 (카드/시트 배경)
  background: '#f4f7fb', // 앱 기본 배경
  cardBg: '#ffffff', // 카드 배경

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
  border: '#dce6f0', // 기본 테두리
  borderLight: '#e3ecf6', // 연한 테두리/구분선

  // 입력 필드
  inputBg: '#f8fafd', // 입력창 배경
  placeholder: '#aab4be', // placeholder 텍스트

  // 상태 / 강조
  red: '#f06b6b', // 일요일/경고
  redAccent: '#f0564b', // New 배지 등 강한 빨강
  teal: '#1bb89a', // 완료/성공
  google: '#4285F4', // 구글 브랜드

  // 보조 배경 / 틴트
  tint: '#e8f1fb', // 연한 파랑 배지/원형 배경
  tintStrong: '#dbe9f7', // 달력 선택/썸네일 배경
  surface: '#eef2f7', // 탭바 보더 등 연한 회색
  surfaceAlt: '#f2f5f9', // 설명 박스 배경
  track: '#e9eef4', // 진행바 트랙
  profileBg: '#e8eef5', // 프로필 아이콘 배경
  tagRedBg: '#fdecec', // '음식' 태그 배경

  // 보조 아이콘 / 흐린 요소
  chevron: '#b6c2cf', // 좌우 화살표
  calMuted: '#c4ced8', // 달력 이전/다음달 날짜
  tabInactive: '#9aa7b4', // 탭바 비활성

  // 다크 영역(두 모드 공통 성격)
  bannerBg: '#2c4a66', // 여행지 배너 폴백 배경
  bannerOverlay: 'rgba(0,30,70,0.25)', // 배너 오버레이
  eventThumbBg: '#1a1f2b', // 이벤트 썸네일 배경
};

// ── 다크 모드 (라이트와 같은 키를 어두운 톤으로 매핑) ──────────
export const darkColors: AppColors = {
  // 브랜드
  primary: '#2b8fe6', // 메인 파랑 (다크에서 약간 밝게)
  primaryDark: '#5aa8ec', // 진한 파랑 (다크에선 더 밝게)

  // 기본 배경 (라이트의 흰 표면 → 어두운 표면)
  white: '#1c2230', // 카드/시트 표면
  background: '#0f1420', // 앱 기본 배경
  cardBg: '#1c2230', // 카드 배경

  // 텍스트 (밝게 반전)
  text: '#e6edf5', // 기본 텍스트
  textPrimary: '#f2f6fb', // 제목/본문
  textSub: '#a7b4c2', // 보조 설명
  textMuted: '#7a8798', // 흐린 텍스트
  textOnPrimary: '#ffffff', // 파란 버튼 위 텍스트
  noteText: '#c3cdd9', // 설명 박스 텍스트
  eventMeta: '#9aa7b4', // 이벤트 시간/장소
  forgotText: '#8fb0cc', // '비밀번호를 잊으셨나요?'

  // 보더 / 구분선
  border: '#2c3547', // 기본 테두리
  borderLight: '#242c3a', // 연한 테두리

  // 입력 필드
  inputBg: '#161c28', // 입력창 배경
  placeholder: '#6b7789', // placeholder 텍스트

  // 상태 / 강조 (모드 무관 유지)
  red: '#f06b6b', // 일요일/경고
  redAccent: '#f0564b', // New 배지
  teal: '#1bb89a', // 완료/성공
  google: '#4285F4', // 구글 브랜드

  // 보조 배경 / 틴트 (어둡게)
  tint: '#1b2b3d', // 연한 파랑 배지 대체
  tintStrong: '#22344a', // 선택/썸네일 배경
  surface: '#232b39', // 탭바 보더 등
  surfaceAlt: '#1a2130', // 설명 박스 배경
  track: '#2a3242', // 진행바 트랙
  profileBg: '#2a3446', // 프로필 아이콘 배경
  tagRedBg: '#3a2626', // 태그 배경

  // 보조 아이콘 / 흐린 요소
  chevron: '#5a6675', // 좌우 화살표
  calMuted: '#5a6675', // 달력 이전/다음달 날짜
  tabInactive: '#7a8798', // 탭바 비활성

  // 다크 영역
  bannerBg: '#2c4a66', // 여행지 배너 폴백 배경
  bannerOverlay: 'rgba(0,0,0,0.35)', // 배너 오버레이
  eventThumbBg: '#0d1017', // 이벤트 썸네일 배경
};

// 앱 실행 시점의 시스템 테마로 팔레트 선택
const colors: AppColors =
  Appearance.getColorScheme() === 'dark' ? darkColors : lightColors;

export default colors;
