import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C6 · Func-008-03-1 라인업 후 장바구니
export const planCartStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  title: { marginTop: 8, fontSize: 24, fontWeight: '700', color: colors.text },
  desc: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSecondary,
  },

  // 직접 선택 / 랜덤 뽑기 세그먼트
  segment: {
    marginTop: 20,
    height: 44,
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemOn: { backgroundColor: colors.primary },
  segmentText: { fontSize: 12, color: colors.textSecondary },
  segmentTextOn: { color: colors.textOnPrimary },

  countText: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  content: { paddingHorizontal: 24, paddingBottom: 24 },

  row: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  rowOn: { borderWidth: 2, borderColor: colors.primary, paddingHorizontal: 10 },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 22 },
  body: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 4,
    height: 22,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  remove: { fontSize: 12, color: colors.textTertiary, paddingHorizontal: 8 },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  checkText: { fontSize: 12, color: colors.textOnPrimary },

  loading: {
    marginTop: 40,
  },
  empty: {
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },

  hint: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.tint,
  },
  hintIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintEmoji: { fontSize: 22 },
  hintBody: { flex: 1, marginLeft: 14 },
  hintTitle: { fontSize: 15, fontWeight: '600', color: colors.primaryDark },
  hintDesc: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: colors.primaryDark,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  // 버튼이 왜 안 눌리는지 알려주는 줄
  pending: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnOff: { backgroundColor: colors.chevron },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
});
