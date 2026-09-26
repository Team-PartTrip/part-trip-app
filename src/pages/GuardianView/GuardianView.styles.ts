import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 가족 연결 (Func-012). 어르신이 코드를 불러주는 화면이라 코드를 크게 쓴다
export const guardianStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {},
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  content: { paddingHorizontal: 24, paddingBottom: 96 },

  lead: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  section: {
    marginTop: 28,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  codeBox: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  code: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 8,
    color: colors.primary,
  },
  codeUntil: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    color: colors.textSecondary,
  },

  primaryBtn: {
    alignSelf: 'stretch',
    minHeight: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFill,
  },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },

  loading: { marginTop: 12 },
  empty: { fontSize: 15, color: colors.textSecondary },
  row: {
    minHeight: 64,
    marginBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  rowSubLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  rowSub: { marginTop: 2, fontSize: 13, color: colors.textSecondary },
  unlink: { fontSize: 15, fontWeight: '600', color: colors.danger },

  shareRow: {
    minHeight: 72,
    marginTop: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },

  // ── 보호자 쪽 ──
  codeInput: {
    flex: 1,
    minHeight: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 4,
    color: colors.textPrimary,
  },
  acceptRow: { flexDirection: 'row', gap: 8 },
  acceptBtn: {
    minHeight: 54,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryFill,
  },
  seniorList: { marginTop: 16 },
  disabled: { opacity: 0.5 },
  chevron: {},

  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 17, fontWeight: '700', color: colors.text },
  locationBtn: { marginTop: 16 },
  refresh: { marginTop: 12, minHeight: 32, justifyContent: 'center' },
  refreshText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
