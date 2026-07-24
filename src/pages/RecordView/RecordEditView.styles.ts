import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const recordEditStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 24 },
  imageWrap: { marginBottom: 12 },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: colors.tintStrong,
  },
  addPhoto: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoIcon: { color: '#fff', fontSize: 20, lineHeight: 22 },
  meta: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  titleInput: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 14,
  },
  bodyInput: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  fBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ghost: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  ghostText: { color: colors.textSub, fontSize: 16, fontWeight: '700' },
});
