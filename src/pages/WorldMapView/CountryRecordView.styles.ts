import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E4 국가별 여행 기록 — 국가 헤더 + 방문 요약 + 기록 목록
export const countryRecordStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 52,
  },
  back: { fontSize: 28, lineHeight: 30, color: colors.white },
  countryRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center' },
  flagCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: { fontSize: 32 },
  countryInfo: { flex: 1, marginLeft: 16 },
  countryName: { fontSize: 24, fontWeight: '700', color: colors.white },
  countryMeta: { marginTop: 6, fontSize: 12, color: colors.onPrimaryMuted },

  statsCard: {
    marginTop: -36,
    marginHorizontal: 24,
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  statCol: { flex: 1, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 18, fontWeight: '600', color: colors.text },
  statValueSm: { fontSize: 13, fontWeight: '600', color: colors.text },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border },

  section: { marginTop: 28, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },

  card: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.tintStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: { fontSize: 11, fontWeight: '600', color: colors.primaryDark },
  cardBody: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardMeta: { marginTop: 6, fontSize: 11, color: colors.textMuted },
  chevron: { fontSize: 18, fontWeight: '600', color: colors.textTertiary },

  empty: {
    marginTop: 10,
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
