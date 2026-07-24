import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

export const tabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.surface,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  icon: {
    fontSize: 22,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 11,
    color: colors.tabInactive,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
  },
  cameraBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cameraIcon: {
    fontSize: 24,
  },
});
