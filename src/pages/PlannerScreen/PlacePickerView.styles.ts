import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C4 · Func-008-04 카테고리별 장소 조회하기
export const placePickerStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  title: { marginTop: 8, fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: 8, fontSize: 12, color: colors.textSecondary },

  // 칩 줄이 남은 높이를 다 먹지 않도록 세로로는 내용만큼만 차지시킨다
  chipScroll: { flexGrow: 0 },
  chipRow: { paddingHorizontal: 24, paddingVertical: 16, gap: 8 },
  chip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  chipTextOn: { color: colors.textOnPrimary },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  countText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  cartLink: { fontSize: 11, fontWeight: '500', color: colors.primary },
  cartLinkOff: { opacity: 0.4 },

  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 14 },

  card: {
    height: 104,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  cardOn: { borderWidth: 2, borderColor: colors.primary, paddingHorizontal: 10 },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 30 },
  body: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  meta: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  statePill: {
    alignSelf: 'flex-start',
    marginTop: 8,
    height: 24,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statePillOn: { backgroundColor: colors.tint },
  stateText: { fontSize: 11, fontWeight: '500', color: colors.textTertiary },
  stateTextOn: { color: colors.primary },
  toggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  toggleText: { fontSize: 12, color: colors.textTertiary },
  toggleTextOn: { color: colors.textOnPrimary },

  loading: {
    marginTop: 40,
  },
  empty: {
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: colors.textMuted },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
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
