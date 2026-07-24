import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const profileEditStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 28 },

  banner: {
    backgroundColor: colors.tint,
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarWrap: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarEmoji: { fontSize: 78 },
  changePhoto: { marginTop: 10 },
  changePhotoText: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },

  form: { paddingHorizontal: 20, gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 15,
    color: colors.textPrimary,
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  linkArrow: { fontSize: 20, color: colors.textMuted },

  confirmBtn: {
    marginTop: 28,
    marginHorizontal: 20,
    backgroundColor: '#5b4fd4',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
