import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

export const festivalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 26,
    color: colors.textPrimary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  headerProfile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.profileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfileIcon: { fontSize: 18 },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },

  // 연도 선택
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  yearText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  yearCaret: {
    fontSize: 14,
    color: colors.textSub,
  },

  // 달력
  calCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  calRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSub,
    fontWeight: '600',
  },
  calCell: {
    flex: 1,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDay: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  calSelected: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calSelectedText: {
    color: colors.textOnPrimary,
    fontWeight: '800',
  },

  // 선택 날짜
  dateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },

  // 이벤트 카드
  eventCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    gap: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  eventThumb: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: colors.eventThumbBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventThumbIcon: { fontSize: 30 },
  eventBody: { flex: 1, gap: 3 },
  eventTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  eventTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  eventDesc: {
    fontSize: 12,
    color: colors.textSub,
  },
  eventMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  eventMeta: {
    fontSize: 11,
    color: colors.eventMeta,
  },
});
