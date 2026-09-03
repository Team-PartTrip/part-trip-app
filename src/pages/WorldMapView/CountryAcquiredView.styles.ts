import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// E3 · Func-009-02 방문 국가 획득
// 피그마 402pt 프레임 기준. 후광 200 · 배지 120 · 좌우 여백 24 · 본문 354.
export const countryAcquiredStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  back: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },

  // ── 국가 배지 ──
  halo: {
    marginTop: 32,
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCode: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  // 후광 오른쪽 위에 걸치는 NEW 리본
  newPill: {
    position: 'absolute',
    right: 0,
    top: 20,
    height: 30,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },

  headline: {
    marginTop: 28,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  sub: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSub,
    textAlign: 'center',
  },

  // ── 정보 카드 ──
  infoCard: {
    marginTop: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoRow: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    width: 76,
    fontSize: 12,
    color: colors.textSub,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'right',
  },

  // ── 안내 바 ──
  notice: {
    marginTop: 20,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeText: {
    fontSize: 12,
    color: colors.primaryDark,
  },

  // ── 대륙 진행도 ──
  progressCard: {
    marginTop: 18,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressCount: {
    fontSize: 12,
    color: colors.textSub,
  },
  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // ── 하단 버튼 ──
  primaryBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  secondaryBtn: {
    marginTop: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
