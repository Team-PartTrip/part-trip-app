import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 E3 국가 획득 — 파란 전면 축하 화면
export const countryAcquiredStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 32,
  },
  close: { alignSelf: 'flex-end', fontSize: 24, color: colors.white },

  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ribbon: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonText: { fontSize: 11, fontWeight: '600', color: colors.white },

  flagCircle: {
    marginTop: 24,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: { fontSize: 64 },

  headline: {
    marginTop: 28,
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  sub: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: colors.onPrimaryMuted,
    textAlign: 'center',
  },

  statsCard: {
    marginTop: 32,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingVertical: 18,
  },
  statCol: { flex: 1, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 18, fontWeight: '600', color: colors.text },
  // 날짜는 세 칸 중 하나에 들어가야 해서 한 단계 작게 쓴다
  statValueSm: { fontSize: 13, fontWeight: '600', color: colors.text },
  statLabel: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  statDivider: { width: 1, height: 34, backgroundColor: colors.border },

  primaryBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  secondaryBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.onPrimaryTrack,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '500', color: colors.white },
});
