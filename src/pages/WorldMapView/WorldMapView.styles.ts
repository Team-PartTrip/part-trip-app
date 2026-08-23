import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E2 내 세계지도 — 파란 요약 헤더 + 대륙별 진행 + 획득 국가 그리드
export const worldMapStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 52,
  },
  back: { fontSize: 28, lineHeight: 30, color: colors.white },
  title: { marginTop: 4, fontSize: 24, fontWeight: '700', color: colors.white },

  bigCount: { marginTop: 20, flexDirection: 'row', alignItems: 'flex-end' },
  bigValue: { fontSize: 40, fontWeight: '700', color: colors.white },
  bigTotal: {
    marginLeft: 6,
    marginBottom: 6,
    fontSize: 15,
    color: colors.onPrimaryMuted,
  },
  bigCaption: { marginTop: 6, fontSize: 12, color: colors.onPrimaryMuted },

  headerTrack: {
    marginTop: 14,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onPrimaryTrack,
    overflow: 'hidden',
  },
  headerFill: { height: 8, borderRadius: 4, backgroundColor: colors.white },

  // 요약 카드는 파란 헤더에 걸쳐 놓는다 (E1 통계 카드와 같은 방식)
  summaryCard: {
    marginTop: -36,
    marginHorizontal: 24,
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  summaryCol: { flex: 1, alignItems: 'center', gap: 6 },
  summaryValue: { fontSize: 18, fontWeight: '600', color: colors.text },
  summaryLabel: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  summaryDivider: { width: 1, height: 40, backgroundColor: colors.border },

  section: { marginTop: 28, paddingHorizontal: 24 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  sectionMore: { fontSize: 12, fontWeight: '500', color: colors.primary },

  continentRow: { marginTop: 16 },
  continentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continentName: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  continentCount: { fontSize: 12, color: colors.textMuted },
  track: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },

  grid: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  countryCard: {
    width: '48%',
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  countryFlag: { fontSize: 30 },
  countryName: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  countryMeta: { marginTop: 4, fontSize: 11, color: colors.textMuted },
  visitBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitBadgeText: { fontSize: 10, fontWeight: '500', color: colors.primaryDark },

  empty: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },

  note: {
    marginTop: 24,
    paddingHorizontal: 24,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
