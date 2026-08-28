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
  // 알림(🔔) — 쓸 만한 아이콘 이미지가 없어 이모지로 둔다
  circleEmoji: {
    fontSize: 15,
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

  // ── 축제 · 이벤트 캘린더 행 (Func-002-03) ──
  eventRow: {
    marginTop: 20,
    marginHorizontal: 24,
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  eventIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventEmoji: {
    fontSize: 20,
  },
  // 제목/보조문구가 남는 폭을 다 먹어야 화살표가 오른쪽 끝에 붙는다
  eventBody: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  eventSub: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSub,
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
});
