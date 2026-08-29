import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D6 · Func-005-06 기록 삭제 — 사진을 여러 장 골라 지운다
export const photoDeleteStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  headerSideOn: { color: colors.primary },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: '100%', height: '100%' },
  cell: {
    borderRadius: 10,
    // 사진 자리라 D11 과 같은 톤으로 조금 진하게 둔다
    backgroundColor: colors.tintStrong,
    overflow: 'hidden',
  },
  cellOn: { borderWidth: 3, borderColor: colors.primary },
  cellVeil: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.22,
  },
  check: {
    position: 'absolute',
    top: 5,
    right: 5,
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
  checkText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textOnPrimary,
  },

  warning: {
    marginTop: 24,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.white,
  },
  warningIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  warningBody: { flex: 1, marginLeft: 12 },
  warningTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  warningDesc: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
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
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
});
