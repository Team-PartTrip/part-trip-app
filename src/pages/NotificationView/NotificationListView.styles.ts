import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E6 (402pt): 좌우 여백 24 · 카드 354x76 · 라운드 14
export const notificationListStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 24 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  back: { fontSize: 24, fontWeight: '700', color: colors.text },
  title: { marginTop: 16, fontSize: 24, fontWeight: '700', color: colors.text },
  readAll: { fontSize: 12, color: colors.primary },

  chipRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 24, marginTop: 20 },
  chip: {
    height: 30,
    minWidth: 54,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  chipTextActive: { color: colors.white },

  bucket: {
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },

  card: {
    marginHorizontal: 24,
    marginBottom: 12,
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  // 안읽은 알림만 옅은 파란 테두리를 두른다
  cardUnread: { borderWidth: 1, borderColor: colors.tint },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '500', color: colors.white },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, color: colors.text },
  cardTitleRead: { color: colors.textSecondary },
  cardTime: { marginTop: 4, fontSize: 11, fontWeight: '500', color: colors.textTertiary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.badge },

  empty: { marginTop: 80, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 13, color: colors.textSecondary },
  loading: { marginTop: 60 },
  more: { marginVertical: 8 },
});
