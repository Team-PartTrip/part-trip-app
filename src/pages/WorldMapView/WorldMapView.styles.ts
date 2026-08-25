import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// E2 · Func-009-01 개인 세계지도 조회
// 피그마 402pt 프레임 기준. 좌우 여백 24 · 본문 354 · 지도 402x420.
export const worldMapStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },

  // 헤더 — 뒤로가기는 왼쪽, 제목은 화면 가운데
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  headerRow: {
    height: 32,
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
  },
  back: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // ── 지도 일러스트 ──
  // 실제 지도 데이터 대신 피그마에 그려진 대륙 덩어리를 그대로 옮겼다.
  map: {
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  landmass: {
    position: 'absolute',
    borderRadius: 18,
  },
  landmassVisited: {
    backgroundColor: colors.primary,
  },
  landmassIdle: {
    backgroundColor: colors.border,
  },

  // ── 범례 ──
  legend: {
    marginTop: 24,
    marginHorizontal: 24,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  legendDotVisited: {
    backgroundColor: colors.primary,
  },
  legendDotIdle: {
    backgroundColor: colors.border,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // ── 획득한 국가 ──
  section: {
    marginTop: 28,
    paddingHorizontal: 24,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionMore: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  countryRow: {
    marginTop: 10,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
  },
  flagCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 15,
  },
  countryBody: {
    flex: 1,
  },
  countryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  countryMeta: {
    marginTop: 1,
    fontSize: 11,
    color: colors.textSub,
  },
  chevron: {
    fontSize: 18,
    color: colors.textTertiary,
  },

  empty: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },

  note: {
    marginTop: 24,
    paddingHorizontal: 24,
    fontSize: 11,
    color: colors.noteText,
    textAlign: 'center',
  },
});
