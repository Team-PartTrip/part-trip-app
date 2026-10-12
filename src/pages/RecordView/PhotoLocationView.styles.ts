import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const photoLocationStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  loading: { flex: 1 },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  headerSpacer: { width: 22 },

  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24 },

  photoRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: {
    width: 64,
    height: 64,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  thumbImage: { width: '100%', height: '100%' },
  photoBody: { flex: 1, marginLeft: 14 },
  photoTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  photoMeta: { marginTop: 4, fontSize: 13, color: colors.textSecondary },

  label: {
    marginTop: 28,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  hint: { marginTop: 4, fontSize: 13, color: colors.textSecondary },

  mapBox: {
    marginTop: 12,
    height: 280,
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.tint,
  },
  map: StyleSheet.absoluteFill,

  chips: { paddingTop: 12, gap: 8 },
  days: { marginTop: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipOn: {
    backgroundColor: colors.primaryFill,
    borderColor: colors.primaryFill,
  },
  chipText: { fontSize: 14, fontWeight: '500', color: colors.text },
  chipTextOn: { color: colors.textOnPrimary },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.white,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primaryFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnOff: { backgroundColor: colors.chevron },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
});
