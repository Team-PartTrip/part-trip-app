import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C6 · 장소 리스트에서 바로 투표
export const placeVoteStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  statusPill: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },
  subtitle: { marginTop: 8, fontSize: 12, color: colors.textSecondary },

  // 칩 줄이 남은 높이를 다 먹지 않게 하고, 가로 ScrollView 가 세로 높이를
  // 스스로 못 잡아 칩 아래가 잘리는 것도 막는다.
  // 칩 32 + 위아래 여백 16 = 64 로 고정한다.
  chipScroll: { flexGrow: 0, flexShrink: 0, height: 64 },
  chipRow: { paddingHorizontal: 24, paddingVertical: 16, gap: 8 },
  chip: {
    height: 32,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  chipTextOn: { color: colors.textOnPrimary },

  content: { paddingHorizontal: 24, paddingBottom: 24, gap: 14 },

  card: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  cardOn: { borderWidth: 2, borderColor: colors.primary, padding: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  thumb: {
    width: 62,
    height: 62,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 24 },
  body: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: colors.text },
  // 평점 · 주소
  meta: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  countRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 8 },
  count: { fontSize: 12, color: colors.textSecondary },

  voteBtn: {
    height: 30,
    minWidth: 60,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteBtnOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  voteBtnOff: { opacity: 0.5 },
  voteText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },
  voteTextOn: { color: colors.textOnPrimary },

  track: {
    marginTop: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
  },
  fill: { height: 8, borderRadius: 4 },

  loading: {
    marginTop: 60,
  },
  // 목록 끝에서 더 받는 중 · 더 받을 게 없을 때
  more: { marginVertical: 16 },
  moreEnd: {
    marginVertical: 16,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
  empty: {
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },
  retryBtn: {
    marginTop: 4,
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  primaryBtn: {
    height: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 16, fontWeight: '600', color: colors.textOnPrimary },

  // ── 동점 후보 고르기 ──
  tieBack: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tieCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 20,
    gap: 8,
  },
  tieTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  tieDesc: { fontSize: 12, color: colors.textSub },
  // 후보가 많아도 카드가 화면을 넘지 않게 한다
  tieList: { marginTop: 6, maxHeight: 260 },
  tieOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  tieOptionName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  tieOptionCount: { fontSize: 12, color: colors.textSecondary },
  tieCancel: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tieCancelText: { fontSize: 14, fontWeight: '600', color: colors.textSub },
});
