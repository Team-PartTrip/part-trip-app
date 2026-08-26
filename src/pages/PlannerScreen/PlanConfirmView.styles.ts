import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C8 · Func-008-06 여행계획 투표 완료시 최종 확인하기
export const planConfirmStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  header: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 32,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  backRow: { alignSelf: 'stretch' },
  back: { fontSize: 28, lineHeight: 32, color: colors.textOnPrimary },
  checkCircle: {
    marginTop: 8,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { fontSize: 32, fontWeight: '700', color: colors.primary },
  headline: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },

  card: {
    marginTop: 22,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: '#0d264d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardDate: { marginTop: 6, fontSize: 12, color: colors.textSecondary },
  cardMembers: { marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  avatars: { flexDirection: 'row' },
  avatarOverlap: { marginLeft: -2 },
  cardMeta: {
    marginLeft: 12,
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },

  section: { marginTop: 28, paddingHorizontal: 24 },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 18 },
  rowBody: { flex: 1, marginLeft: 12 },
  rowCategory: { fontSize: 11, fontWeight: '500', color: colors.textTertiary },
  rowName: { marginTop: 2, fontSize: 15, fontWeight: '600', color: colors.text },
  rowPill: {
    height: 26,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowPillText: { fontSize: 11, fontWeight: '500', color: colors.primary },

  loading: {
    marginTop: 60,
  },
  // ── 확정 전 / 조회 실패 화면 ──
  // 본문 헤더가 파란 배경이라 back 글자가 흰색이다. 여기서는 밝은 배경이라
  // 같은 스타일을 쓰면 화살표가 보이지 않아서 따로 둔다.
  errorArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorBackBtn: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  errorBack: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  errorBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  errorActions: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 10,
  },

  empty: {
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: colors.textMuted },

  actions: { marginTop: 20, paddingHorizontal: 24, gap: 10 },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },
  secondaryBtn: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontSize: 12, color: colors.textSecondary },
});
