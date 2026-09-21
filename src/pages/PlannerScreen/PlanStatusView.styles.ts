import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 우리 여행 계획 (Func-005-06). 확정되면 일정표
export const planStatusStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  // 탭바가 화면 위에 떠 있다. 32 로는 삭제 버튼이 탭바에 가린다.
  content: { paddingBottom: 96 },

  loading: {
    marginTop: 60,
  },
  errorBack: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  header: { paddingHorizontal: 24, paddingTop: 4 },
  back: { fontSize: 28, lineHeight: 32, color: colors.text },
  titleRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  statusPill: {
    height: 26,
    paddingHorizontal: 16,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },
  meta: { marginTop: 8, fontSize: 12, color: colors.textSecondary },

  section: { marginTop: 24, paddingHorizontal: 24 },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  rowBody: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowSub: { marginTop: 2, fontSize: 12, color: colors.textSecondary },

  // ── 확정된 일정 ──
  dayTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 20 },
  empty: {
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: { fontSize: 13, color: colors.textMuted },
  shareBtn: {
    marginTop: 8,
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  // 되돌릴 수 없는 동작이라 화면 맨 아래에 따로 둔다
  deleteBtn: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.danger,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },
});
