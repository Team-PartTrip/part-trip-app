import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C7 · Func-008-05 투표중 진행된 계획 내용 조회하기
export const planStatusStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  loading: {
    marginTop: 60,
  },
  errorBack: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  statusPill: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },
  meta: { marginTop: 8, fontSize: 12, color: colors.textSecondary },

  summaryCard: {
    marginTop: 36,
    marginHorizontal: 24,
    height: 84,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  summaryCol: { flex: 1, alignItems: 'center', gap: 6 },
  summaryValue: { fontSize: 18, fontWeight: '600' },
  summaryLabel: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  summaryDivider: { width: 1, height: 40, backgroundColor: colors.border },

  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  rowBody: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowSub: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  track: {
    marginTop: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2 },
  rowPill: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: 13,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPillText: { fontSize: 11, fontWeight: '500' },

  note: {
    marginTop: 12,
    paddingHorizontal: 24,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
