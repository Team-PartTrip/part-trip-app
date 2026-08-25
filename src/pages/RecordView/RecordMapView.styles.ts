import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D1 · Func-005-01 지도상 해설 카메라 위치 표시
export const recordMapStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  // 지도 자리. 지도 SDK 를 붙이기 전까지 격자 + 육지 모양으로 대신한다
  map: { flex: 1, backgroundColor: colors.tint, overflow: 'hidden' },
  gridLine: { position: 'absolute', backgroundColor: colors.white, opacity: 0.7 },
  gridRow: { left: 0, right: 0, height: 1 },
  gridCol: { top: 0, bottom: 0, width: 1 },
  landmass: {
    position: 'absolute',
    left: '15%',
    top: '21%',
    width: '65%',
    height: '54%',
    borderRadius: 90,
    backgroundColor: colors.white,
    opacity: 0.55,
  },
  pin: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0d3366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pinText: { fontSize: 11, fontWeight: '500', color: colors.textOnPrimary },

  // 목록 모드에서는 지도가 없으니 상단 바를 그냥 흐름대로 놓는다
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  // 지도 위에 떠 있는 상단 바
  topBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBtnText: { fontSize: 16, fontWeight: '600', color: colors.text },
  placePill: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placePillText: { fontSize: 12, color: colors.text },
  topBarSpacer: { flex: 1 },

  // 아래 시트
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  sheetFull: { flex: 1, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  // 지도 모드에서 아래에 걸쳐 두는 높이 (피그마 D1)
  sheetPeek: { height: 354 },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  sheetHead: {
    marginTop: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: colors.text },
  toggle: { fontSize: 11, fontWeight: '500', marginLeft: 16 },
  toggleOn: { color: colors.primary },
  toggleOff: { color: colors.textTertiary },

  list: { paddingBottom: 24, gap: 12 },
  row: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbIcon: { fontSize: 18 },
  rowBody: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.text },
  rowMeta: { marginTop: 2, fontSize: 12, color: colors.textSecondary },
  chevron: { fontSize: 16, fontWeight: '600', color: colors.textTertiary },

  empty: { paddingVertical: 40, alignItems: 'center', gap: 6 },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },
});
