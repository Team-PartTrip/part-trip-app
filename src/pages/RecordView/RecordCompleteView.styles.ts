import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const recordCompleteStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  cat: { fontSize: 92, marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: colors.textSub,
    marginBottom: 36,
    textAlign: 'center',
  },
  btns: { alignSelf: 'stretch', gap: 12 },
  btn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ghost: { backgroundColor: colors.tint },
  ghostText: { color: colors.primary, fontSize: 16, fontWeight: '700' },
});
