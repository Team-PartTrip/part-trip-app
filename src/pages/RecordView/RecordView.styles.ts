import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D2 · Func-005-02 여행별 기록 관리 — 연도 필터 + 여행 카드 목록
export const recordStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  pageTitle: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: { fontSize: 16 },

  filterRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 18 },
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

  content: { paddingHorizontal: 24, paddingBottom: 32, gap: 16 },

  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
    overflow: 'hidden',
  },
  strip: {
    height: 96,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 2,
    overflow: 'hidden',
    backgroundColor: colors.inputBg,
  },
  stripTile: { flex: 1, backgroundColor: colors.tint },
  travelBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textOnPrimary,
  },

  cardBottom: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardDate: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  countPill: {
    height: 26,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPillText: { fontSize: 11, fontWeight: '500', color: colors.primary },

  loading: {
    marginTop: 60,
  },
  empty: {
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },
});
