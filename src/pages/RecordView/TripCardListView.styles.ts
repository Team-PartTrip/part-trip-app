import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D9 · Func-003-01 여행 카드 목록 조회 — 어두운 배경 + 카드 캐러셀
export const tripCardListStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.night },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  back: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
  headerAction: { fontSize: 15, fontWeight: '600', color: colors.textOnPrimary },

  page: { alignItems: 'center', justifyContent: 'center' },
  card: {
    width: 320,
    height: 460,
    borderRadius: 24,
    backgroundColor: colors.primary,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 36,
    elevation: 12,
  },
  cover: {
    height: 200,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: { fontSize: 13, color: colors.textMuted },
  badge: {
    position: 'absolute',
    top: 170,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },

  body: { paddingHorizontal: 24, paddingTop: 24 },
  cityName: { fontSize: 32, fontWeight: '700', color: colors.textOnPrimary },
  tripMeta: { marginTop: 6, fontSize: 12, color: colors.onPrimaryMuted },
  divider: {
    marginTop: 14,
    height: 1,
    backgroundColor: colors.textOnPrimary,
    opacity: 0.3,
  },
  statRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.onPrimaryMuted },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textOnPrimary,
    opacity: 0.35,
  },
  dotOn: { opacity: 1 },

  loading: {
    marginTop: 60,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.textOnPrimary },
  emptyDesc: { fontSize: 12, color: colors.onPrimaryMuted },

  footer: { paddingHorizontal: 24, paddingTop: 16 },
  shareBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.textOnPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: { fontSize: 16, fontWeight: '600', color: colors.primary },
});
