import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E8 (402pt): 카드 354 · 라운드 16 · 버튼 354x50 라운드 14
export const notificationDetailStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  back: { marginTop: 40, paddingHorizontal: 24, fontSize: 24, fontWeight: '700', color: colors.text },
  titleRow: {
    marginTop: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  readBadge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readBadgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },

  card: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  kindBadge: {
    alignSelf: 'flex-start',
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindBadgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  cardTitle: { marginTop: 10, fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 24 },
  cardBody: { marginTop: 12, fontSize: 13, color: colors.textTertiary, lineHeight: 20 },
  cardTime: { marginTop: 16, fontSize: 11, color: colors.placeholder },
  divider: { marginTop: 14, height: 1, backgroundColor: colors.border },
  note: { marginTop: 12, fontSize: 11, color: colors.placeholder, lineHeight: 18 },

  primaryBtn: {
    marginTop: 24,
    marginHorizontal: 24,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.textOnPrimary },
  secondaryBtn: {
    marginTop: 12,
    marginHorizontal: 24,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.text },
});
