import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

const cardShadow = {
  shadowColor: '#1a2a3a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const communityStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // 탭
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textSub },
  tabTextActive: { color: colors.textOnPrimary },

  // 검색
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  searchClear: { fontSize: 14, color: colors.textMuted, paddingHorizontal: 4 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 90 },

  // 공통 카드
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.profileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: { fontSize: 14 },
  authorName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  verified: { fontSize: 11, color: colors.primary },
  dot: { color: colors.textMuted },
  time: { fontSize: 12, color: colors.textMuted },

  postTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  postBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSub,
    marginBottom: 10,
  },

  thumbRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.tintStrong,
  },
  thumbMore: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bannerBg,
  },
  thumbMoreText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  metaRow: { flexDirection: 'row', gap: 16 },
  meta: { fontSize: 12, color: colors.textSub, fontWeight: '600' },

  // 여행 후기 카드
  reviewCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...cardShadow,
  },
  reviewImage: {
    height: 150,
    backgroundColor: colors.bannerBg,
    justifyContent: 'flex-start',
    padding: 10,
  },
  reviewImagePhoto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  placePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  placePillText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  reviewBodyWrap: { padding: 16, gap: 4 },
  reviewStars: { fontSize: 14, color: '#f5b301', letterSpacing: 1 },
  reviewTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  reviewBody: { fontSize: 13, lineHeight: 20, color: colors.textSub },

  // 경로/일정 스케줄
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  scheduleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  scheduleTime: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    width: 64,
  },
  scheduleText: { flex: 1, fontSize: 13, color: colors.textSub },

  // 빈 결과
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },

  // 플로팅 버튼
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: '700' },
});
