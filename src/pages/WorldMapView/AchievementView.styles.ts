import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E5 여행 달성 현황 — 전체 달성률 + 대륙 카드 + 뱃지 목록
export const achievementStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  back: { fontSize: 28, lineHeight: 30, color: colors.white },
  title: { marginTop: 4, fontSize: 24, fontWeight: '700', color: colors.white },
  headline: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22,
    color: colors.onPrimaryMuted,
  },
  percentRow: { marginTop: 6, flexDirection: 'row', alignItems: 'flex-end' },
  percent: { fontSize: 40, fontWeight: '700', color: colors.white },
  percentUnit: {
    marginLeft: 4,
    marginBottom: 7,
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  headerTrack: {
    marginTop: 14,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onPrimaryTrack,
    overflow: 'hidden',
  },
  headerFill: { height: 8, borderRadius: 4, backgroundColor: colors.white },

  section: { marginTop: 28, paddingHorizontal: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text },

  grid: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  continentCard: {
    width: '48%',
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
  },
  continentName: { fontSize: 14, fontWeight: '600', color: colors.text },
  continentCount: { marginTop: 6, fontSize: 11, color: colors.textMuted },
  track: {
    marginTop: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.primary },

  milestone: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 14,
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tint,
  },
  milestoneIconDone: { backgroundColor: colors.primary },
  milestoneIconText: { fontSize: 18 },
  milestoneBody: { flex: 1, marginLeft: 14 },
  milestoneLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  // 아직 못 딴 뱃지는 흐리게 둬서 한눈에 구분되게 한다
  milestoneLabelLocked: { color: colors.textMuted },
  milestoneDesc: { marginTop: 4, fontSize: 11, color: colors.textMuted },
  milestoneRight: { alignItems: 'flex-end' },
  doneBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBadgeText: { fontSize: 10, fontWeight: '600', color: colors.white },
  progressText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },

  note: {
    marginTop: 24,
    paddingHorizontal: 24,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
