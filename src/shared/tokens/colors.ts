import { Appearance, DynamicColorIOS, Platform } from 'react-native';
import type { ColorValue } from 'react-native';

export type AppColors = {
  primary: ColorValue;
  /** 흰 글자 · 아이콘을 얹는 파란 배경 (버튼 · 헤더 · 선택된 칩) */
  primaryFill: ColorValue;
  primaryDark: ColorValue;
  accent: ColorValue;
  success: ColorValue;
  badge: ColorValue;
  onPrimaryMuted: ColorValue;
  onPrimaryTrack: ColorValue;
  white: ColorValue;
  background: ColorValue;
  cardBg: ColorValue;
  text: ColorValue;
  textPrimary: ColorValue;
  textSub: ColorValue;
  textSecondary: ColorValue;
  textTertiary: ColorValue;
  textMuted: ColorValue;
  textOnPrimary: ColorValue;
  noteText: ColorValue;
  eventMeta: ColorValue;
  border: ColorValue;
  borderLight: ColorValue;
  inputBg: ColorValue;
  placeholder: ColorValue;
  red: ColorValue;
  redAccent: ColorValue;
  danger: ColorValue;
  dangerBg: ColorValue;
  teal: ColorValue;
  google: ColorValue;
  tint: ColorValue;
  tintStrong: ColorValue;
  surface: ColorValue;
  surfaceAlt: ColorValue;
  track: ColorValue;
  mapLand: ColorValue;
  profileBg: ColorValue;
  tagRedBg: ColorValue;
  chevron: ColorValue;
  calMuted: ColorValue;
  tabInactive: ColorValue;
  bannerBg: ColorValue;
  bannerOverlay: ColorValue;
  eventThumbBg: ColorValue;
  night: ColorValue;
};

// ── 라이트 모드 ──────────────────────────────────────────────
export const lightColors: AppColors = {
  // 브랜드
  primary: '#1a6ebf', // 메인 파랑 (DS Primary 500)
  primaryFill: '#1a6ebf', // 흰 글자와 5.2:1
  primaryDark: '#0d4a84', // 진한 파랑 (DS Primary 700)
  accent: '#ff7a35', // 주의·타이머 (DS Accent 500)
  success: '#087f5b', // 확정·완료 (DS Success)
  badge: '#ff3e3e', // 안읽은 알림 점
  onPrimaryMuted: '#ebf4fc', // 파란 배경 위 보조 텍스트
  onPrimaryTrack: 'rgba(255,255,255,0.3)', // 파란 배경 위 진행바 트랙

  // 기본 배경
  white: '#ffffff', // 흰 표면 (카드/시트 배경)
  background: '#f4f7fb', // 앱 기본 배경
  cardBg: '#ffffff', // 카드 배경

  // 텍스트
  text: '#1A3D5C', // LaunchScreen 슬로건 등 기본 텍스트
  textPrimary: '#1a2a3a', // 제목/본문 진한 텍스트
  textSub: '#647383', // 보조 설명 텍스트 (4.5:1)
  textSecondary: '#536579', // 폼 라벨 · 항목 라벨
  textTertiary: '#5d6f83', // 비활성 탭 라벨 · 화살표
  textMuted: '#647382', // 흐린 텍스트(구분선 라벨·보조 설명) (4.5:1)
  textOnPrimary: '#ffffff', // 파란 버튼 위 텍스트
  noteText: '#46566a', // 설명 박스 텍스트
  eventMeta: '#6a7a8a', // 이벤트 시간/장소 텍스트

  // 보더 / 구분선
  border: '#d8dddd', // 기본 테두리
  borderLight: '#e3ecf6', // 연한 테두리/구분선

  // 입력 필드
  inputBg: '#f7fafd', // 입력창 배경 (DS BG subtle)
  placeholder: '#627384', // placeholder 텍스트 (4.5:1)

  // 상태 / 강조
  red: '#e11717', // 일요일/경고 (4.5:1)
  redAccent: '#f0564b', // New 배지 등 강한 빨강
  danger: '#ff3e3e', // 삭제 등 되돌릴 수 없는 동작 (DS Danger)
  dangerBg: '#feefee', // 삭제 경고 박스 배경
  teal: '#1bb89a', // 완료/성공
  google: '#4285F4', // 구글 브랜드

  // 보조 배경 / 틴트
  tint: '#ebf4fc', // 연한 파랑 배지/버튼 배경 (DS Primary 100)
  tintStrong: '#dbe9f7', // 달력 선택/썸네일 배경
  surface: '#eef2f7', // 탭바 보더 등 연한 회색
  surfaceAlt: '#f2f5f9', // 설명 박스 배경
  track: '#e9eef4', // 진행바 트랙
  // 지도의 안 가본 땅. 바다(surfaceAlt)와도, 다녀온 나라(primary)와도 구분돼야
  // 해서 둘의 가운데 명도로 둔다. 둘 다 3:1 은 안 되고 각각 약 2.2:1 이 최대다
  mapLand: '#9ca9b8',
  profileBg: '#e8eef5', // 프로필 아이콘 배경
  tagRedBg: '#fdecec', // '음식' 태그 배경

  // 보조 아이콘 / 흐린 요소
  chevron: '#b6c2cf', // 좌우 화살표
  calMuted: '#c4ced8', // 달력 이전/다음달 날짜
  tabInactive: '#8796a6', // 탭바 비활성 (아이콘 3:1)

  // 다크 영역(두 모드 공통 성격)
  bannerBg: '#2c4a66', // 여행지 배너 폴백 배경
  bannerOverlay: 'rgba(0,30,70,0.25)', // 배너 오버레이
  eventThumbBg: '#1a1f2b', // 이벤트 썸네일 배경
  night: '#17191f', // 사진 뷰어 · 여행카드 배경 (DS BG night)
};

// ── 다크 모드 (라이트와 같은 키를 어두운 톤으로 매핑) ──────────
export const darkColors: AppColors = {
  // 브랜드
  primary: '#2b8fe6', // 메인 파랑 (다크에서 약간 밝게)
  // 글자용 primary 는 어두운 배경에서 보이게 밝히고, 흰 글자를 얹는 배경은 어둡게 둔다.
  // #2b8fe6 위 흰 글자는 3.4:1 이라 AA(4.5:1)에 못 미친다
  primaryFill: '#1c73c7', // 흰 글자와 4.9:1
  primaryDark: '#5aa8ec', // 진한 파랑 (다크에선 더 밝게)
  accent: '#ff9457', // 주의·타이머 (다크에서 약간 밝게)
  success: '#2bb888', // 확정·완료
  badge: '#ff5f5f', // 안읽은 알림 점
  onPrimaryMuted: '#d7e8f8', // 파란 배경 위 보조 텍스트
  onPrimaryTrack: 'rgba(255,255,255,0.28)', // 파란 배경 위 진행바 트랙

  // 기본 배경 (라이트의 흰 표면 → 어두운 표면)
  white: '#1c2230', // 카드/시트 표면
  background: '#0f1420', // 앱 기본 배경
  cardBg: '#1c2230', // 카드 배경

  // 텍스트 (밝게 반전)
  text: '#e6edf5', // 기본 텍스트
  textPrimary: '#f2f6fb', // 제목/본문
  textSub: '#a7b4c2', // 보조 설명
  textSecondary: '#9fb0c0', // 폼 라벨 · 항목 라벨
  textTertiary: '#8c9dae', // 비활성 탭 라벨 · 화살표
  textMuted: '#8794a5', // 흐린 텍스트 (카드 위 4.5:1)
  textOnPrimary: '#ffffff', // 파란 버튼 위 텍스트
  noteText: '#c3cdd9', // 설명 박스 텍스트
  eventMeta: '#9aa7b4', // 이벤트 시간/장소

  // 보더 / 구분선
  border: '#2c3547', // 기본 테두리
  borderLight: '#242c3a', // 연한 테두리

  // 입력 필드
  inputBg: '#161c28', // 입력창 배경
  placeholder: '#7e8a9a', // placeholder 텍스트 (4.5:1)

  // 상태 / 강조 (모드 무관 유지)
  red: '#f06b6b', // 일요일/경고
  redAccent: '#f0564b', // New 배지
  danger: '#ff5f5f', // 삭제 등 되돌릴 수 없는 동작
  dangerBg: '#3a2323', // 삭제 경고 박스 배경
  teal: '#1bb89a', // 완료/성공
  google: '#4285F4', // 구글 브랜드

  // 보조 배경 / 틴트 (어둡게)
  tint: '#1b2b3d', // 연한 파랑 배지 대체
  tintStrong: '#22344a', // 선택/썸네일 배경
  surface: '#232b39', // 탭바 보더 등
  surfaceAlt: '#1a2130', // 설명 박스 배경
  track: '#2a3242', // 진행바 트랙
  mapLand: '#485767', // 지도의 안 가본 땅 (라이트 쪽 설명 참고)
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
  night: '#17191f', // 사진 뷰어 · 여행카드 배경 (두 모드 공통)
};

// ── 고대비 (명세 Func-008-02) ──────────────────────────────────
//
// 앱 안에 고대비 설정 화면을 따로 두지 않는다. iOS 의 "대비 증가"
// (설정 > 손쉬운 사용 > 디스플레이 및 텍스트 크기)를 켜면 아래 색으로 바뀐다.
// 글자 크기(Func-008-01)가 OS 설정을 따르는 것과 같은 방식이다.
//
// 흐린 글자는 7:1(AAA), 테두리 · 아이콘 · 지난 날짜는 3:1 이 되도록 명도만
// 낮추거나(라이트) 올렸다(다크). 적지 않은 색은 평소 색 그대로다.
//
// 안드로이드는 앱마다 고대비 색을 받는 방법이 없다. OS 의 "고대비 텍스트" 가
// 글자를 직접 진하게 그린다.
//
// primary 는 넣지 않았다. 흰 글자를 얹는 배경은 primaryFill 을 쓴다.
const highContrastLight: Partial<AppColors> = {
  textSub: '#4a5561',
  textSecondary: '#465667',
  textTertiary: '#485565',
  textMuted: '#4a5561',
  placeholder: '#495662',
  eventMeta: '#4a5561',
  tabInactive: '#8191a2',
  border: '#829292',
  chevron: '#7c91a9',
  calMuted: '#7b91a8',
};

const highContrastDark: Partial<AppColors> = {
  textTertiary: '#9faebc',
  textMuted: '#a4adba',
  placeholder: '#a4adb8',
  eventMeta: '#a1aeba',
  border: '#596c90',
  chevron: '#606d7d',
  calMuted: '#606d7d',
};

const dynamicColors = (): AppColors => {
  const merged = { ...lightColors };
  (Object.keys(lightColors) as (keyof AppColors)[]).forEach(key => {
    merged[key] = DynamicColorIOS({
      light: lightColors[key],
      dark: darkColors[key],
      highContrastLight: highContrastLight[key] ?? lightColors[key],
      highContrastDark: highContrastDark[key] ?? darkColors[key],
    });
  });
  return merged;
};

const colors: AppColors =
  Platform.OS === 'ios'
    ? dynamicColors()
    : Appearance.getColorScheme() === 'dark'
    ? darkColors
    : lightColors;

export default colors;
