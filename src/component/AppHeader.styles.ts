import { StyleSheet } from 'react-native';
import colors from '../assets/constants/colors';

export const appHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 32,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 4,
  },
  backIcon: {
    fontSize: 26,
    color: colors.textPrimary,
  },
  logo: {
    width: 100,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  spacer: { flex: 1 },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.profileBg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});
