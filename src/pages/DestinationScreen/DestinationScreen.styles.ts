import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const destinationStyles = StyleSheet.create({
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
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },

  // 검색 (스크롤 영역 밖, 상단 고정)
  searchBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  clearText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // 최근 검색 칩
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipFlag: { fontSize: 16 },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipSub: {
    fontSize: 12,
    color: colors.textSub,
  },
  chipClose: {
    fontSize: 14,
    color: colors.textSub,
    marginLeft: 2,
  },

  // 인기 여행지 그리드
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  destCard: {
    width: '48%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  destOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  destIcon: {
    position: 'absolute',
    top: 12,
    right: 14,
    fontSize: 26,
  },
  destTextWrap: {
    padding: 12,
  },
  destName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textOnPrimary,
  },
  destCountry: {
    fontSize: 12,
    color: colors.textOnPrimary,
    opacity: 0.9,
  },
});
