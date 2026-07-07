import { StyleSheet } from 'react-native';
import colors, { lightColors } from '../../assets/constants/colors';

const cardShadow = {
  shadowColor: '#1a2a3a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const mainStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 24, gap: 16 },

  // 배너
  bannerCard: { borderRadius: 18, overflow: 'hidden', ...cardShadow },
  bannerBg: {
    height: 190,
    backgroundColor: colors.bannerBg,
    padding: 16,
    justifyContent: 'space-between',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bannerOverlay,
  },
  bannerDDayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bannerDDayText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  bannerBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  bannerCountry: { color: '#fff', fontSize: 28, fontWeight: '900' },
  changeBtn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  // 배너 위 흰색 고정 배경이므로 모드와 무관하게 어두운 글자색 사용
  changeBtnText: { color: lightColors.textPrimary, fontSize: 12, fontWeight: '700' },

  // 인사말
  greetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    ...cardShadow,
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
  greetingTextArea: { flex: 1 },
  dayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tint,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  dayBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  greetingHello: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  greetingLocal: { fontSize: 13, color: colors.textSub },
  translateIcon: { fontSize: 18, color: colors.textMuted, fontWeight: '700' },

  // 스탯 (날씨 / 환율)
  statRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...cardShadow,
  },
  // 환율 카드는 텍스트가 더 길어서(예: "1 SGD = 1,186.51원") 날씨보다 넓게
  statCardWide: {
    flex: 1.4,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 14,
    ...cardShadow,
  },
  statLabel: { fontSize: 12, color: colors.textSub, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  statSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  // 여행지 정보 탭
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontSize: 12, fontWeight: '700', color: colors.textSub },
  tabTextActive: { color: '#fff' },

  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    ...cardShadow,
  },

  // 인구 구성
  popItem: { marginBottom: 12 },
  popLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  popLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  popPct: { fontSize: 13, color: colors.textPrimary, fontWeight: '800' },
  popTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  popFill: { height: '100%', borderRadius: 4 },
  noteBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
  },
  noteText: { fontSize: 13, lineHeight: 20, color: colors.noteText },

  // 관광 장소
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  placeThumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: colors.tintStrong,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  placeMeta: { fontSize: 12, color: colors.textSub },

  // 대표 음식
  foodRow: { flexDirection: 'row', gap: 12 },
  foodItem: { flex: 1, alignItems: 'center' },
  foodThumb: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    backgroundColor: colors.tintStrong,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  foodDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textSub,
    textAlign: 'center',
  },

  // 현지 에티켓
  etiquetteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  etiquetteText: { flex: 1, fontSize: 14, color: colors.textPrimary },
  etiquetteIcon: { fontSize: 16, marginLeft: 8 },

  // 축제 달력
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calMonth: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  calNav: { fontSize: 14, color: colors.textMuted },
  calRow: { flexDirection: 'row' },
  calWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    paddingVertical: 6,
  },
  calCell: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  calDay: { fontSize: 13, color: colors.textPrimary },
  calMuted: { color: colors.calMuted },
  calRed: { color: colors.red },
  calSelected: {
    backgroundColor: colors.tintStrong,
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  calSelectedText: { color: colors.primary, fontWeight: '800' },
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
    padding: 12,
    marginTop: 12,
    gap: 12,
    ...cardShadow,
  },
  eventThumb: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.eventThumbBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventThumbIcon: { fontSize: 30 },
  eventBody: { flex: 1 },
  eventTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tagRedBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  eventTagText: { fontSize: 11, color: colors.redAccent, fontWeight: '700' },
  eventTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  eventDesc: { fontSize: 12, color: colors.textSub, marginBottom: 4 },
  eventMeta: { fontSize: 11, color: colors.eventMeta },
});
