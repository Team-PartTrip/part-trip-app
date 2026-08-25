import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 인증 화면(A2~A6) 공통 스타일.
// 피그마 "A. 인증 · Func-001" 프레임(402pt 기준) 값을 그대로 옮겼다.
// 본문 폭 298 · 좌우 여백 52 · 입력 높이 36 · 버튼 높이 40 · 라운드 10.
export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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

  // 폼
  form: {
    marginTop: 72,
  },
  input: {
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontSize: 13,
    color: colors.text,
    backgroundColor: colors.inputBg,
  },
  // 입력창 사이 기본 간격
  field: {
    marginTop: 12,
  },
  // 도움말 바로 뒤에 오는 입력창은 조금 좁게 붙는다
  fieldAfterHelper: {
    marginTop: 9,
  },
  // 입력 규칙 안내 ("6~20자 · 영문 소문자와 숫자")
  helper: {
    marginTop: 4,
    marginLeft: 2,
    fontSize: 11,
    color: colors.textMuted,
  },

  forgotBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 11,
    color: colors.forgotText,
  },

  // 주 버튼
  actions: {
    marginTop: 32,
  },
  loginBtn: {
    height: 40,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  // 구분선
  divider: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // 보조 버튼 (Google · 회원가입) — 흰 배경에 테두리
  outlineBtn: {
    height: 40,
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
  googleBtn: {
    marginTop: 20,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.google,
  },
  signupBtn: {
    marginTop: 4,
  },
});
