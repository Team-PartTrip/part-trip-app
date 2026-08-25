import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C5 · Func-008-03 카테고리별로 투표하기
export const placeVoteStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  statusPill: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },
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

  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 14 },

  card: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  cardOn: { borderWidth: 2, borderColor: colors.primary, padding: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  thumb: {
    width: 62,
    height: 62,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 24 },
  body: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  countRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { fontSize: 12, color: colors.textSecondary },
  voters: { flexDirection: 'row' },
  voterOverlap: { marginLeft: -2 },

  voteBtn: {
    height: 30,
    minWidth: 60,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtnOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  voteBtnOff: { opacity: 0.5 },
  voteText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  voteTextOn: { color: colors.textOnPrimary },

  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  fill: { height: 8, borderRadius: 4 },

  empty: {
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },

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
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
});
