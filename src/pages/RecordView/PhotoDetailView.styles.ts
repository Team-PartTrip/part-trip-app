import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D3 · Func-005-03 촬영 기록 상세 조회 — 어두운 뷰어 + 아래 정보 시트
export const photoDetailStyles = StyleSheet.create({
  loading: { marginTop: 80 },
  blankBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  blankText: { fontSize: 14, color: colors.textMuted },
  photoImage: { width: '100%', height: '100%' },
  thumbImage: { width: '100%', height: '100%', borderRadius: 8 },
  safeArea: { flex: 1, backgroundColor: colors.night },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // 사진 위에 얹히는 버튼이라 흰색을 옅게 깐다
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  counter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textOnPrimary,
  },

  photo: {
    flex: 1,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCaption: { fontSize: 13, color: colors.textMuted },

  // 가로 스크롤은 세로로 남은 공간을 다 먹으므로 내용만큼만 차지시킨다
  stripScroll: { flexGrow: 0 },
  strip: { paddingHorizontal: 24, paddingVertical: 16, gap: 8 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.tint,
    opacity: 0.45,
  },
  thumbOn: {
    opacity: 1,
    borderWidth: 2,
    borderColor: colors.textOnPrimary,
  },

  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 26,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.text },
  meta: { marginTop: 6, fontSize: 12, color: colors.textSecondary },

  aiCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  aiIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: { fontSize: 16 },
  aiBody: { flex: 1, marginLeft: 12 },
  aiLabel: { fontSize: 11, fontWeight: '500', color: colors.primaryDark },
  aiText: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primaryDark,
  },

  label: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  commentRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    paddingRight: 7,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  commentText: { flex: 1, fontSize: 12, lineHeight: 16, color: colors.text },
  commentPlaceholder: { color: colors.textTertiary },
  commentBtn: {
    width: 56,
    height: 36,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textOnPrimary,
  },

  // ⋯ 메뉴
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  menuHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
    backgroundColor: colors.border,
  },
  menuItem: {
    height: 54,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  menuText: { fontSize: 15, fontWeight: '600', color: colors.text },
  menuDanger: { color: colors.danger },
});
