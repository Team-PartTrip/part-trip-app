import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 C1 · Func-008 여행 플래너(투표) — 제목 + 상태 필터 + 계획 카드 목록
export const plannerStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  header: { paddingHorizontal: 24, paddingTop: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  pageTitle: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  createBtn: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },

  headerBtns: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // 참여는 생성보다 덜 쓰는 길이라 테두리만 준다
  joinBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: { fontSize: 11, fontWeight: '500', color: colors.primary },

  // ── 초대로 참여하기 ──
  modalBack: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 20,
    gap: 10,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  modalDesc: { fontSize: 12, color: colors.textSub },
  modalInput: {
    marginTop: 4,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text,
  },
  modalBtns: { flexDirection: 'row', gap: 8, marginTop: 4 },
  modalCancel: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: colors.textSub },
  modalOk: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOkOff: { opacity: 0.5 },
  modalOkText: { fontSize: 14, fontWeight: '600', color: colors.textOnPrimary },

  filterRow: { flexDirection: 'row', gap: 8, marginTop: 20, marginBottom: 18 },
  filterChip: {
    height: 34,
    paddingHorizontal: 18,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  filterText: { fontSize: 12, color: colors.textSecondary },
  filterTextOn: { color: colors.textOnPrimary },

  content: { paddingHorizontal: 24, paddingBottom: 32, gap: 16 },

  card: {
    borderRadius: 16,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  cardStripe: { height: 4 },
  cardBody: { padding: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardDate: { marginTop: 4, fontSize: 12, color: colors.textSecondary },

  cardMiddle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusPill: {
    height: 24,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '500' },
  avatars: { flexDirection: 'row' },
  // 피그마에서 26px 원을 24px 간격으로 두어 살짝 겹쳐 놓는다
  avatarOverlap: { marginLeft: -2 },

  cardFooter: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardMeta: { fontSize: 11, fontWeight: '500', color: colors.textTertiary },
  // 카드 touchable 밖에 있는 형제라서 위치를 직접 잡는다.
  // cardBody padding 20 + footer 높이를 감안해 화살표 왼쪽에 놓는다.
  chevron: { fontSize: 18, fontWeight: '600', color: colors.textTertiary },

  loading: {
    marginTop: 60,
  },
  empty: {
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },

});
