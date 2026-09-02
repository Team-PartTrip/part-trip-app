import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// E4 · Func-009-03 국가별 여행 기록 조회
// 피그마 402pt 프레임 기준. 파란 헤더 216 · 좌우 여백 24 · 본문 354.
export const countryRecordStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },

  // ── 파란 헤더 ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  back: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textOnPrimary,
  },
  countryRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flagCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 26,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  countryMeta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.onPrimaryMuted,
  },

  // 헤더 안에 그대로 놓인 3칸 통계 (카드가 아니다)
  statsRow: {
    marginTop: 18,
    flexDirection: 'row',
  },
  statCol: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    color: colors.onPrimaryMuted,
  },

  // ── 섹션 공통 ──
  section: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // ── 방문 도시 칩 ──
  chipRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },

  // ── 여행 기록 카드 ──
  card: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 12,
  },
  strip: {
    flexDirection: 'row',
    gap: 2,
  },
  stripCell: {
    flex: 1,
    height: 56,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripFirst: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  stripLast: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  // 마지막 칸에 남은 사진 수를 얹는다
  stripMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  cardFoot: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardMeta: {
    fontSize: 11,
    color: colors.textSub,
  },

  empty: {
    marginTop: 12,
    borderRadius: 16,
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
  loading: { marginTop: 60 },
});
