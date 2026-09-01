import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C2 · Func-008-01 여행 그룹 정하기
export const planGroupStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },

  // 혼자 / 함께 선택 카드
  modeRow: { flexDirection: 'row', gap: 14 },
  modeCard: {
    flex: 1,
    height: 108,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modeCardOn: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.tint,
  },
  modeDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeDotOn: { backgroundColor: colors.primary },
  modeIcon: { fontSize: 18 },
  modeLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  modeLabelOn: { color: colors.primaryDark },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // 인원 스테퍼
  stepperRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  stepperLabel: { flex: 1, fontSize: 15, color: colors.textSecondary },
  stepperBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnOff: { opacity: 0.4 },
  stepperSign: { fontSize: 15, fontWeight: '600', color: colors.text },
  stepperValue: {
    width: 44,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  // 멤버 목록
  titleInput: {
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  memberEmpty: {
    marginTop: 10,
    fontSize: 12,
    color: colors.textSub,
  },
  memberRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  memberBody: { flex: 1, marginLeft: 12 },
  memberName: { fontSize: 15, fontWeight: '600', color: colors.text },
  memberSub: { marginTop: 2, fontSize: 12 },

  inviteBtn: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteText: { fontSize: 15, fontWeight: '600', color: colors.primary },

  soloNote: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    fontSize: 12,
    lineHeight: 18,
    color: colors.noteText,
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
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
});
