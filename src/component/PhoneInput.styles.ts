import { StyleSheet } from 'react-native';
import colors from '../assets/constants/colors';

export const phoneInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    height: 52,
  },
  dialArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 10,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontSize: 14,
    color: colors.textSub,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    padding: 0,
  },
});
