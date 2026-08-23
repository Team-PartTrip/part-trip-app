import { StyleSheet } from 'react-native';
import colors from '../tokens/colors';

// 피그마 A3 회원가입 전화번호 행: 298x36 · 라운드 10 · 국기 + ▾ + 구분선 + +82 + 입력
export const phoneInputStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    paddingHorizontal: 14,
    height: 36,
  },
  dialArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flag: {
    fontSize: 15,
  },
  chevron: {
    fontSize: 9,
    color: colors.textMuted,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  code: {
    fontSize: 13,
    color: colors.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    padding: 0,
  },
});
