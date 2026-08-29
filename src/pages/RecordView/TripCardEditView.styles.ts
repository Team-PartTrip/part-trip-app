import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D11 · Func-003-03 여행 카드 작성 (사진 · 코멘트 추가)
export const tripCardEditStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 24, lineHeight: 32, fontWeight: '700', color: colors.text },
  title: { marginTop: 8, fontSize: 24, fontWeight: '700', color: colors.text },
  desc: { marginTop: 8, fontSize: 15, color: colors.textMuted },

  tripBar: {
    marginTop: 20,
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.tint,
    justifyContent: 'center',
  },
  tripBarText: { fontSize: 12, fontWeight: '600', color: colors.primary },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
  },

  content: { paddingHorizontal: 24, paddingBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: {
    borderRadius: 10,
    backgroundColor: colors.tintStrong,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: { width: '100%', height: '100%' },
  addCell: { fontSize: 28, color: colors.textMuted },
  hint: { marginTop: 10, fontSize: 12, color: colors.textMuted },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary },
  checkOff: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    opacity: 0.75,
  },
  checkText: { fontSize: 12, fontWeight: '700', color: colors.textOnPrimary },

  commentBox: {
    height: 104,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 26,
  },
  commentInput: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  counter: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.placeholder,
  },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
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
