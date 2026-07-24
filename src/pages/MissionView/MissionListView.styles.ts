import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const missionListStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1a2a3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tag: {
    fontSize: 11,
    color: colors.textSub,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  btn: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
});