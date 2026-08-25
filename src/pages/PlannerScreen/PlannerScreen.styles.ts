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
  chevron: { fontSize: 18, fontWeight: '600', color: colors.textTertiary },

  empty: {
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },

  note: {
    paddingHorizontal: 24,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
