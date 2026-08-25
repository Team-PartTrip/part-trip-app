import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// B2 · Func-002-03 여행 정보 설정
// 피그마 402pt 프레임 기준. 좌우 여백 24 · 입력 높이 54 · 라운드 14.
export const destinationStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 헤더 — 뒤로가기 + 제목 + 안내문
  header: {
    paddingHorizontal: 24,
  },
  back: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.textPrimary,
  },
  title: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSub,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },

  // 항목 라벨 ("여행지" · "여행 기간" …)
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  labelSpaced: {
    marginTop: 26,
  },

  // 공통 입력 박스 (높이 54)
  field: {
    marginTop: 10,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  fieldPlaceholder: {
    fontSize: 15,
    color: colors.placeholder,
  },
  // 값이 채워진 박스는 테두리를 파랗게 해서 선택된 걸 알린다
  fieldFilled: {
    borderColor: colors.primary,
  },

  // 여행 기간 — 170pt 짜리 두 칸 + 가운데 대시
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    flex: 1,
  },
  dash: {
    width: 14,
    textAlign: 'center',
    fontSize: 15,
    color: colors.textSub,
  },
  // "4박 5일" — 기간이 정해졌을 때만 보인다
  nights: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // 인원 — 라벨 + 스테퍼
  peopleLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnOff: {
    opacity: 0.4,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    // 유니코드 −/+ 가 살짝 위로 떠서 광학 보정
    marginTop: -2,
  },
  stepValue: {
    width: 32,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // 여행 스타일 칩
  chipRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: {
    borderColor: colors.primary,
    backgroundColor: colors.tint,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextOn: {
    color: colors.primary,
    fontWeight: '700',
  },

  // 하단 고정 버튼
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  saveBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnOff: {
    backgroundColor: colors.border,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },

  // 달력 시트
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetMonth: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sheetArrow: {
    width: 32,
    fontSize: 22,
    textAlign: 'center',
    color: colors.textTertiary,
  },
  calRow: {
    marginTop: 12,
    flexDirection: 'row',
  },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textSub,
  },
  calWeekend: {
    color: colors.red,
  },
  calWeek: {
    flexDirection: 'row',
    marginTop: 4,
  },
  calCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  dayPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillMid: {
    backgroundColor: colors.tint,
    borderRadius: 0,
    width: '100%',
  },
  dayPillEdge: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  dayTextEdge: {
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  dayTextOff: {
    color: colors.calMuted,
  },
  sheetHint: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textSub,
    textAlign: 'center',
  },
  sheetDone: {
    marginTop: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetDoneOff: {
    backgroundColor: colors.border,
  },
  sheetDoneText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
