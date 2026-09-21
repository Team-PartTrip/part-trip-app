import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 여행 지침 (Func-005-14). 시니어가 누르는 화면이라 다른 단계보다 글자와 칩을 키웠다
export const planBlocksStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },

  trip: { padding: 14, borderRadius: 12, backgroundColor: colors.tint },
  tripText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  section: {
    marginTop: 28,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionHint: { marginTop: 4, fontSize: 14, color: colors.textSecondary },

  input: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },

  cityPicked: {
    marginTop: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.tint,
  },
  cityPickedText: { fontSize: 17, fontWeight: '700', color: colors.primary },
  cityChange: { fontSize: 15, fontWeight: '600', color: colors.primary },

  block: { marginTop: 20 },
  blockLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  blockHint: { fontSize: 13, fontWeight: '400', color: colors.textSecondary },

  chips: { marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: 15, color: colors.text },
  chipTextOn: { color: colors.textOnPrimary, fontWeight: '600' },

  empty: { marginTop: 8, fontSize: 14, color: colors.textSecondary },
  loading: { marginTop: 24 },
  retry: { marginTop: 16, minHeight: 48, justifyContent: 'center' },
  retryText: { fontSize: 15, fontWeight: '600', color: colors.primary },

  more: {
    marginTop: 24,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  moreText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.white,
  },
  waiting: {
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  primaryBtn: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnOff: { opacity: 0.5 },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
});
