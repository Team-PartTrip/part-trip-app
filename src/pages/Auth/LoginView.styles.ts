import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 로그인 화면(A2). 카카오 · 구글 버튼만 있다.
// 피그마 "A. 인증 · Func-001" 프레임(402pt 기준). 좌우 여백 52 · 라운드 10.
export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 52,
    paddingVertical: 40,
  },

  // 로고 + 타이틀
  logoArea: {
    alignItems: 'center',
  },
  // 재디자인 전과 같은 브랜드 로고 이미지 크기 (170x40)
  brandLogo: {
    width: 170,
    height: 40,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },

  actions: {
    marginTop: 56,
    gap: 12,
  },

  // 카카오 — 주 로그인 경로다. 카카오 브랜드 색을 그대로 쓴다
  kakaoBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#FEE500',
  },
  kakaoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    // 노란 배경에 검정 85% — 카카오가 정한 조합이고 명도대비도 넉넉하다
    color: 'rgba(0, 0, 0, 0.85)',
  },

  // 구글 — 흰 배경에 테두리
  outlineBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  outlineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.google,
  },

  loading: {
    marginTop: 8,
  },
});
