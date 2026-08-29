import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D12 · Func-003-04 여행 카드 삭제
export const tripCardDeleteStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerSide: { fontSize: 15, color: colors.textMuted },
  headerSideOn: { color: colors.primary },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },

  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },

  row: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  rowOn: { borderColor: colors.primary },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.tintStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: { fontSize: 9, fontWeight: '500', color: colors.textMuted },
  body: { flex: 1, marginLeft: 14 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  meta: { marginTop: 6, fontSize: 12, color: colors.textMuted },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary },
  checkOff: { backgroundColor: colors.surface },
  checkText: { fontSize: 12, fontWeight: '700', color: colors.textOnPrimary },

  warning: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.dangerBg,
  },
  warningTitle: { fontSize: 13, fontWeight: '600', color: colors.danger },
  warningDesc: {
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },

  loading: {
    marginTop: 60,
  },
  empty: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { fontSize: 13, color: colors.textMuted },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 10,
    backgroundColor: colors.background,
  },
  dangerBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtnOff: { backgroundColor: colors.chevron },
  dangerText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
  cancelBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
});
