import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

const cardShadow = {
  shadowColor: '#1a2a3a',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2,
};

export const missionStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },

  // 상단 퀵 액션
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 8,
  },
  quickBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickIcon: { fontSize: 18 },

  // 캐릭터 카드
  charCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
    ...cardShadow,
  },
  playPill: {
    backgroundColor: colors.tint,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginBottom: 16,
  },
  playPillText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  charImageWrap: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  charEmoji: { fontSize: 96 },
  charNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 14,
  },
  charNameIcon: { fontSize: 14 },
  charName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  progressTrack: {
    width: 160,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  newBadge: {
    backgroundColor: colors.redAccent,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },

  // 미션 카드
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    ...cardShadow,
  },
  missionTextWrap: { flex: 1 },
  missionTag: {
    fontSize: 11,
    color: colors.textSub,
    fontWeight: '600',
    marginBottom: 4,
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailBtn: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
