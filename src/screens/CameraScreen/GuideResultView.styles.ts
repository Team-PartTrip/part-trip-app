import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

export const guideResultStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  content: { padding: 16, paddingBottom: 32, gap: 14 },

  photo: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },

  errorText: {
    fontSize: 14,
    color: colors.textSub,
    textAlign: 'center',
    marginTop: 24,
  },

  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  badge: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },

  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  overview: { fontSize: 14, lineHeight: 21, color: colors.textPrimary },

  section: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: colors.textSub },
  sectionBody: { fontSize: 13, lineHeight: 20, color: colors.noteText },

  source: { fontSize: 12, color: colors.textMuted },

  recordForm: {
    marginTop: 8,
    gap: 8,
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textarea: { height: 100, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
