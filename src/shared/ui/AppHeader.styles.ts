import { StyleSheet } from 'react-native';
import colors from '../tokens/colors';

export const appHeaderStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
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
});
