import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const planCitiesStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },

  trip: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  tripText: { fontSize: 13, fontWeight: '600', color: colors.primary },

  label: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  seq: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  seqText: { fontSize: 12, fontWeight: '700', color: colors.textOnPrimary },
  cardBody: { flex: 1 },
  cityName: { fontSize: 16, fontWeight: '700', color: colors.text },
  cityRange: { marginTop: 2, fontSize: 12, color: colors.textSecondary },

  stepper: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  stepBtnOff: { borderColor: colors.chevron },
  stepText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  stepTextOff: { color: colors.chevron },
  days: { minWidth: 34, fontSize: 13, fontWeight: '700', textAlign: 'center', color: colors.text },
  remove: { fontSize: 14, color: colors.textMuted, paddingHorizontal: 4 },

  addBtn: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontSize: 14, fontWeight: '700', color: colors.primary },

  note: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  noteTitle: { fontSize: 13, fontWeight: '700', textAlign: 'center', color: colors.primary },
  noteTitleWarn: { color: colors.accent },
  noteDesc: { marginTop: 4, fontSize: 11, textAlign: 'center', color: colors.textMuted },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.white,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  primaryBtnOff: { backgroundColor: colors.chevron },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },

  // 도시 추가 모달
  dim: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 38, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, padding: 0 },
  hit: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hitCity: { fontSize: 15, fontWeight: '600', color: colors.text },
  hitCountry: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  hitEmpty: { paddingVertical: 20, fontSize: 12, textAlign: 'center', color: colors.textMuted },
});
