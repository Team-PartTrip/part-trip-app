import { StyleSheet } from 'react-native';
import colors from '../../assets/constants/colors';

export const nearbyStyles = StyleSheet.create({
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
    paddingBottom: 24,
    gap: 14,
  },

  // 검색
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 4,
  },
  searchIcon: { fontSize: 16, color: colors.textSub },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
  },

  // 섹션 헤더
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },

  // 장소 카드
  placeCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  placeThumb: {
    width: 84,
    height: 84,
    borderRadius: 12,
    backgroundColor: colors.eventThumbBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeThumbIcon: { fontSize: 32 },
  placeBody: { flex: 1, justifyContent: 'space-between' },
  placeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  placeRating: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  placeCategory: {
    fontSize: 13,
    color: colors.textSub,
    marginTop: 2,
  },
  placeHours: {
    fontSize: 12,
    color: colors.textSub,
    marginTop: 1,
  },
  placeBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  placeDistance: {
    fontSize: 12,
    color: colors.eventMeta,
    fontWeight: '600',
  },
  directionsBtn: {
    backgroundColor: colors.tint,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  directionsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
