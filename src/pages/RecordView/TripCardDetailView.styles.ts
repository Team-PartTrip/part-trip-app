import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 D10 · Func-003-02 여행 카드 상세 조회 — 장소·사진을 시간순으로 잇는 타임라인
export const tripCardDetailStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },

  back: {
    paddingHorizontal: 24,
    paddingTop: 4,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: colors.text,
  },
  titleBar: {
    height: 44,
    marginTop: 8,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBarText: { fontSize: 15, fontWeight: '600', color: colors.text },

  timeline: { paddingTop: 8, paddingBottom: 8 },
  // 왼쪽을 세로로 잇는 선. 날짜 구분 띠는 이 선 위로 지나간다
  rail: {
    position: 'absolute',
    left: 26,
    top: 6,
    bottom: 6,
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },

  entry: { marginLeft: 52, marginRight: 24, marginBottom: 12 },
  entryImage: {
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.tintStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  entryImageText: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  entryInfo: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  entryTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  entrySub: { marginTop: 4, fontSize: 11, color: colors.textMuted },
  // 정보 줄 한가운데 높이에 맞춰 선 위에 점을 찍는다
  entryDot: {
    position: 'absolute',
    left: -32,
    top: 94,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },

  dateBar: {
    height: 36,
    marginBottom: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBarText: { fontSize: 13, fontWeight: '500', color: colors.text },

  addCard: {
    marginTop: 12,
    marginHorizontal: 24,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addTitle: { fontSize: 15, fontWeight: '600', color: colors.primary },
  addDesc: { fontSize: 11, color: colors.textMuted },

  empty: {
    marginHorizontal: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyText: { fontSize: 15, fontWeight: '600', color: colors.text },
  emptyDesc: { fontSize: 12, color: colors.textMuted },
});
