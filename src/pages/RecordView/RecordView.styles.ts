import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

const cardShadow = {
  shadowColor: '#1a2a3a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const recordStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },

  tripHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  tripTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  toggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  toggleIcon: { fontSize: 18 },

  writeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 8,
  },
  writeBtnDisabled: { backgroundColor: colors.border },
  writeBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  writeNote: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    ...cardShadow,
  },
  cardImage: {
    width: 92,
    height: 92,
    borderRadius: 12,
    backgroundColor: colors.tintStrong,
    marginRight: 12,
  },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  menuBtn: { paddingHorizontal: 4, marginTop: -2 },
  menuIcon: { fontSize: 18, color: colors.textMuted },
  cardDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSub,
    marginBottom: 8,
  },
  cardMeta: { fontSize: 12, color: colors.textMuted },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingTop: 26,
    paddingBottom: 14,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalYes: { backgroundColor: colors.primary },
  modalYesText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalNo: { backgroundColor: colors.surface },
  modalNoText: { color: colors.textSub, fontSize: 15, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },
});
