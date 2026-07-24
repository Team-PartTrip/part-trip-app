import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

const cardShadow = {
  shadowColor: '#1a2a3a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const profileStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 24 },

  // 프로필 카드
  profileCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    ...cardShadow,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  avatarEmoji: { fontSize: 40 },
  profileInfo: { flex: 1, justifyContent: 'center' },
  nickname: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  type: { fontSize: 13, color: colors.textSub, marginTop: 2, marginBottom: 10 },
  editBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  // 뱃지 그리드
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 14,
    ...cardShadow,
  },
  badgeEmblem: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  badgeLocked: { backgroundColor: colors.surface, opacity: 0.6 },
  badgeEmoji: { fontSize: 42 },
  ribbon: {
    backgroundColor: '#f6c445',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 6,
  },
  ribbonLocked: { backgroundColor: colors.border },
  ribbonText: { fontSize: 13, fontWeight: '800', color: '#5a4300' },
  badgeSub: { fontSize: 12, color: colors.textMuted },

  // 뱃지 상세 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalClose: { position: 'absolute', top: 12, left: 12, padding: 6 },
  modalCloseText: { fontSize: 18, color: colors.textMuted },
  modalEmblem: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  modalEmoji: { fontSize: 60 },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  modalSub: { fontSize: 13, color: colors.textSub, marginBottom: 16 },
  modalDescBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 14,
    padding: 16,
    alignSelf: 'stretch',
  },
  modalDesc: { fontSize: 14, lineHeight: 21, color: colors.noteText },

  // 내가 쓴 글
  myTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  myTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  myTabActive: { backgroundColor: colors.primary },
  myTabText: { fontSize: 13, fontWeight: '600', color: colors.textSub },
  myTabTextActive: { color: '#fff' },
  postCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    ...cardShadow,
  },
  postCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  postCardBody: { fontSize: 13, color: colors.textSub, marginBottom: 8 },
  postCardMetaRow: { flexDirection: 'row', gap: 12 },
  postCardMeta: { fontSize: 12, color: colors.textMuted },
  moreBtn: { alignItems: 'center', paddingVertical: 14 },
  moreBtnText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  emptyMy: { paddingVertical: 24, alignItems: 'center' },
  emptyMyText: { fontSize: 13, color: colors.textMuted },

  // 로그아웃
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 12,
  },
  logoutBtnText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
});