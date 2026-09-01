import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D4 · Func-005-04 코멘트 작성 / D5 · Func-005-05 코멘트 수정
export const commentEditStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: { fontSize: 24, lineHeight: 28, fontWeight: '700', color: colors.text },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerAction: { fontSize: 15, fontWeight: '600', color: colors.primary },

  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },

  photo: {
    height: 180,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoImage: { width: '100%', height: '100%' },
  photoCaption: { fontSize: 13, color: colors.textMuted },

  title: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  takenAt: { marginTop: 6, fontSize: 12, color: colors.textSecondary },

  input: {
    marginTop: 20,
    height: 180,
    padding: 15,
    fontSize: 15,
    lineHeight: 22,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    color: colors.text,
  },
  // 수정 화면은 바로 편집 상태라 파란 테두리로 강조된다
  inputEditing: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    padding: 14,
  },
  counter: {
    marginTop: 10,
    textAlign: 'right',
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
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
