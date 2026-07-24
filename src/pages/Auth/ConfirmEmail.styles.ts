import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const confirmEmailStyles = StyleSheet.create({
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailInput: {
    flex: 1,
  },
  sendBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnSent: {
    borderColor: colors.placeholder,
  },
  sendBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
