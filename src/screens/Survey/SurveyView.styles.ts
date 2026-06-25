import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

export const surveyStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 30,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  backHidden: {
    opacity: 0,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSub,
  },

  progressTrack: {
    height: 4,
    marginHorizontal: 20,
    borderRadius: 2,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  body: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  qNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
  },
  qText: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 32,
    letterSpacing: -0.5,
    marginBottom: 36,
  },
  options: {
    gap: 14,
  },
  option: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: colors.inputBg,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.tint,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  optionTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  nextBtnDisabled: {
    backgroundColor: colors.border,
  },
  nextBtnText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
