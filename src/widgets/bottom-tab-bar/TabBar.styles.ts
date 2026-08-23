import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// 피그마 B1 TabBar: 높이 88 · 아이콘 24 · 라벨 11 · 위쪽 1px 구분선
export const tabBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 18,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  labelActive: {
    fontWeight: '600',
    color: colors.primary,
  },
});
