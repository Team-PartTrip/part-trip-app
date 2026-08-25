import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C3 · Func-008-02 여행지 & 기간 정하기
export const planDestinationStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },

  search: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 17,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, padding: 0 },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  cityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cityCard: {
    // 24px 좌우 여백 · 10px 간격 기준으로 두 칸이 딱 맞게 들어간다
    width: '48%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cityCardOn: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.tint,
  },
  cityThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityEmoji: { fontSize: 20 },
  cityName: { fontSize: 15, fontWeight: '600', color: colors.text },
  cityNameOn: { color: colors.primaryDark },
  cityCountry: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  cityEmpty: { fontSize: 12, color: colors.textMuted, paddingVertical: 12 },

  // 달력
  calCard: {
    padding: 17,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  calHead: { flexDirection: 'row', alignItems: 'center' },
  calMonth: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  calArrow: {
    width: 32,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.chevron,
  },
  calRow: { flexDirection: 'row', marginTop: 14 },
  // 날짜 줄은 피그마와 같이 34px 간격으로 붙여 놓는다
  calWeek: { flexDirection: 'row' },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  calWeekend: { color: colors.red },
  calCell: { flex: 1, height: 34, alignItems: 'center', justifyContent: 'center' },
  dayPill: {
    width: 40,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillEdge: { backgroundColor: colors.primary },
  dayPillMid: { borderRadius: 0, backgroundColor: colors.tint },
  dayText: { fontSize: 12, color: colors.text },
  dayTextEdge: { color: colors.textOnPrimary },
  dayTextOff: { color: colors.calMuted },

  summary: {
    marginTop: 16,
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.white,
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
