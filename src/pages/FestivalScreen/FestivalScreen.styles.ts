import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D7 · Func-002-03 축제 & 이벤트 캘린더 (v3 에서 메인 소속)
export const festivalStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  // 탭바가 화면 위에 떠 있다. 32 로는 마지막 카드가 탭바에 가린다.
  content: { paddingBottom: 96 },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  title: { marginTop: 8, fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: 8, fontSize: 12, color: colors.textSecondary },

  // 달력
  calCard: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  calHead: { flexDirection: 'row', alignItems: 'center' },
  calMonth: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  calArrow: {
    width: 28,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textTertiary,
  },
  // 범위 밖으로는 못 넘어간다. 눌리는 것처럼 보이지 않게 흐리게 둔다.
  calArrowOff: {
    opacity: 0.25,
  },
  calWeekRow: { flexDirection: 'row', marginTop: 16 },
  calWeek: { flexDirection: 'row', marginTop: 8 },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  calSunday: { color: colors.danger },
  calCell: { flex: 1, height: 34, alignItems: 'center' },
  dayPill: {
    width: 36,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 여행 기간에 걸친 날은 옅은 파랑, 고른 날은 진한 파랑 원
  dayInTrip: { backgroundColor: colors.tint },
  daySelected: {
    width: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  dayText: { fontSize: 12, color: colors.text },
  dayTextSelected: { color: colors.textOnPrimary },
  // 날짜 알약 아래에 찍히는 일정 표시 점
  dot: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  dotOnSelected: { backgroundColor: colors.textOnPrimary },

  tripRange: {
    marginTop: 12,
    paddingHorizontal: 24,
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
  },
  chip: {
    height: 30,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  chipTextOn: { color: colors.textOnPrimary },

  loader: { marginTop: 24 },
  list: { paddingHorizontal: 24, gap: 12 },
  card: {
    minHeight: 76,
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  cardStripe: { width: 5, backgroundColor: colors.accent },
  cardBody: { flex: 1, paddingHorizontal: 15, paddingVertical: 14 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardMeta: { marginTop: 4, fontSize: 12, color: colors.textSecondary },
  cardPlace: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  cardPill: {
    alignSelf: 'flex-start',
    height: 22,
    marginTop: 14,
    marginRight: 16,
    paddingHorizontal: 12,
    borderRadius: 11,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPillText: { fontSize: 11, fontWeight: '500', color: colors.primary },

  empty: {
    marginHorizontal: 24,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, textAlign: 'center', color: colors.textMuted },
});
