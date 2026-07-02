import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

export const cameraStyles = StyleSheet.create({
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

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 16,
  },

  // 근처 명소 추천 배너
  banner: {
    height: 130,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#5a4a72',
    padding: 16,
    justifyContent: 'center',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(40,20,70,0.35)',
  },
  bannerTitle: {
    color: colors.textOnPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSub: {
    color: colors.textOnPrimary,
    fontSize: 13,
    opacity: 0.9,
  },

  // 해설 카메라 카드
  cameraCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cameraIcon: { fontSize: 44 },
  cameraTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cameraDesc: {
    fontSize: 13,
    color: colors.textSub,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  shootBtn: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  shootBtnText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  // 미션 추가 목록
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  missionTextWrap: { flex: 1 },
  missionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 12,
    color: colors.textSub,
  },
  missionArrow: {
    fontSize: 22,
    color: colors.textSub,
    marginLeft: 8,
  },
});
