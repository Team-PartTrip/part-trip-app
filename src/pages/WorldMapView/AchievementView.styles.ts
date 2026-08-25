import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// E5 · Func-009-04 여행 달성 현황 조회
// 피그마 402pt 프레임 기준. 좌우 여백 24 · 본문 354 · 도넛 지름 112.
export const RING_SIZE = 112;
export const RING_WIDTH = 12;

export const achievementStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: 24,
  },
  back: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // ── 요약 카드 (도넛 + 오른쪽 설명) ──
  summaryCard: {
    marginTop: 16,
    marginHorizontal: 24,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
  },

  ring: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_WIDTH,
    borderColor: colors.track,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 도넛을 좌·우 반쪽으로 잘라서 각각 안의 링을 돌린다.
  // (SVG 라이브러리 없이 임의 각도의 호를 그리는 방법)
  ringHalf: {
    position: 'absolute',
    top: -RING_WIDTH,
    width: RING_SIZE / 2,
    height: RING_SIZE,
    overflow: 'hidden',
  },
  ringHalfLeft: {
    left: -RING_WIDTH,
  },
  ringHalfRight: {
    left: RING_SIZE / 2 - RING_WIDTH,
  },
  ringArc: {
    position: 'absolute',
    top: 0,
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_WIDTH,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
  },
  ringArcLeft: {
    left: 0,
  },
  ringArcRight: {
    left: -RING_SIZE / 2,
  },
  ringValue: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ringUnit: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSub,
  },

  summaryBody: {
    flex: 1,
  },
  summaryEyebrow: {
    fontSize: 12,
    color: colors.textSub,
  },
  summaryPercent: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  summaryThisYear: {
    marginTop: 12,
    fontSize: 11,
    color: colors.textSecondary,
  },
  goalPill: {
    marginTop: 10,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  // ── 대륙별 현황 ──
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  continentRow: {
    marginTop: 12,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  continentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  continentName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  continentCount: {
    fontSize: 12,
    color: colors.textSub,
  },
  track: {
    marginTop: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  note: {
    marginTop: 24,
    paddingHorizontal: 24,
    fontSize: 11,
    color: colors.noteText,
    textAlign: 'center',
  },
});
