import { StyleSheet } from 'react-native';
import colors from '../assets/constants/colors';

export const mainStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  headerLogo: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  headerLogoPart: { color: colors.primary },
  headerLogoTrip: { color: colors.primaryDark },
  headerProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.profileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfileIcon: { fontSize: 20 },

  // 스크롤
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 16,
  },

  // 배너
  bannerCard: {
    borderRadius: 18,
    overflow: 'hidden',
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerBg: {
    flex: 1,
    backgroundColor: colors.bannerBg,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bannerOverlay,
  },
  bannerDDayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bannerDDayText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  bannerBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bannerCountry: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  changeBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
  },
  changeBtnText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },

  // 인사말 카드
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  speakerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: { fontSize: 20 },
  greetingTextArea: { flex: 1, gap: 2 },
  dayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  dayBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  greetingHello: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  greetingLocal: {
    fontSize: 14,
    color: colors.textSub,
  },
  translateIcon: {
    fontSize: 22,
    color: colors.textSub,
  },

  // 통계 카드
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSub,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionIcon: { fontSize: 20 },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
  },

  // 카드 공통
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },

  // 인구 구성 carousel
  carouselRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCard: { flex: 1 },
  chevron: {
    fontSize: 26,
    color: colors.chevron,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  popItem: { marginBottom: 14 },
  popLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  popLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  popPct: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  popTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  popFill: {
    height: '100%',
    borderRadius: 5,
  },
  noteBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 14,
    marginTop: 4,
  },
  noteText: {
    fontSize: 13,
    color: colors.noteText,
    lineHeight: 20,
  },

  // 달력
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  calMonth: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  calNav: {
    fontSize: 16,
    color: colors.textSub,
    fontWeight: '700',
  },
  calRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: colors.textSub,
    fontWeight: '600',
  },
  calCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  calDay: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  calMuted: { color: colors.calMuted },
  calRed: { color: colors.redAccent },
  calSelected: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.tintStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calSelectedText: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  calDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
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
    backgroundColor: colors.tagRedBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
  },
  eventTagText: {
    color: colors.redAccent,
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
