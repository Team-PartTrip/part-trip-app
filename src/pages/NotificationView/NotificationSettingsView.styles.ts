import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E7 (402pt): 카드 354 · 라운드 16 · 토글 44x26 (노브 22)
export const notificationSettingsStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },

  back: { marginTop: 40, paddingHorizontal: 24, fontSize: 24, fontWeight: '700', color: colors.text },
  title: { marginTop: 16, paddingHorizontal: 24, fontSize: 24, fontWeight: '700', color: colors.text },
  desc: { marginTop: 12, paddingHorizontal: 24, fontSize: 15, color: colors.textMuted },

  card: {
    marginTop: 26,
    marginHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, gap: 12 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowDesc: { marginTop: 6, fontSize: 11, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.borderLight },

  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: colors.primary, alignItems: 'flex-end' },
  toggleOff: { backgroundColor: colors.track, alignItems: 'flex-start' },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white },

  quietRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  quietTime: { fontSize: 12, fontWeight: '500', color: colors.primary },
  chevron: { fontSize: 14, fontWeight: '700', color: colors.textMuted },

  loading: { marginTop: 60 },
  note: {
    marginTop: 12,
    paddingHorizontal: 24,
    fontSize: 11,
    color: colors.textTertiary,
  },
});
