import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const placeDetailStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingBottom: 24 },

  cover: {
    height: 200,
    borderRadius: 14,
    marginTop: 8,
    marginBottom: 18,
    backgroundColor: colors.surfaceAlt,
  },
  coverEmpty: { borderWidth: 1, borderColor: colors.border },

  name: { fontSize: 20, fontWeight: '700', color: colors.text },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  rating: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },

  address: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: 14,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    marginTop: 16,
  },

  footer: { paddingHorizontal: 24, backgroundColor: colors.background },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  primaryText: { fontSize: 16, fontWeight: '700', color: colors.textOnPrimary },
});
