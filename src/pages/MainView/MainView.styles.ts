import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 B1 (402pt): 좌우 여백 24 · 본문 354
export const mainStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  loading: {
    marginTop: 60,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // ── 파란 헤더 ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleIcon: {
    width: 16,
    height: 16,
    tintColor: colors.primary,
  },
  // 안읽은 알림 표시. 원 오른쪽 위에 겹친다.
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badge,
  },

  eyebrow: {
    marginTop: 46,
    fontSize: 12,
    color: colors.onPrimaryMuted,
  },
  dday: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  tripTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  tripMeta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.onPrimaryMuted,
  },

  // 준비 진행률
  progressTrack: {
    marginTop: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.onPrimaryTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  progressLabel: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '500',
    color: colors.onPrimaryMuted,
  },

  // ── 항공 / 숙소 / 일정 상태 카드 (헤더에 걸쳐 놓인다) ──
  statusCard: {
    marginTop: -28,
    marginHorizontal: 24,
    height: 108,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  statusCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusDivider: {
    width: 1,
    height: 56,
    backgroundColor: colors.border,
  },

  // ── 섹션 공통 ──
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  // ── 여행 준비 ──
  prepRow: {
    marginTop: 8,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  prepIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.tint,
  },
  prepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  prepSub: {
    marginTop: 2,
    fontSize: 12,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textTertiary,
  },

  // ── 이번 주 추천 ──
  placeRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 12,
  },
  placeCard: {
    flex: 1,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  placeThumb: {
    height: 44,
    backgroundColor: colors.tint,
  },
  placeName: {
    marginTop: 6,
    marginHorizontal: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.text,
  },

  // ── 추천 장소가 없을 때 ──
  noPlaces: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  noPlacesText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  noPlacesDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: 'center',
  },
  noPlacesBtn: {
    marginTop: 8,
    height: 34,
    paddingHorizontal: 16,
    borderRadius: 17,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPlacesBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },

  // ── 여행 일정이 없을 때 ──
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyBtn: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
});
