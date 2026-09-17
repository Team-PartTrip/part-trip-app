import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const planPeriodStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },


  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },


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

  calCell: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' },

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

  // 누를 수 없다는 걸 눌러보기 전에 알 수 있게
  dayTextPast: { color: colors.placeholder },


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
  dayPillTaken: { backgroundColor: colors.inputBg },
  dayTextTaken: { color: colors.placeholder, textDecorationLine: 'line-through' },
  takenNote: { marginTop: 10, fontSize: 11, color: colors.textMuted },
});
