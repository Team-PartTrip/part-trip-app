import { StyleSheet } from 'react-native';
import colors from '../../shared/tokens/colors';

// A4 · A5 이메일 인증 화면 전용. 나머지는 LoginView.styles 를 함께 쓴다.
// 본문 298 = 입력 208 + 간격 5 + 버튼 85.
export const confirmEmailStyles = StyleSheet.create({
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  emailInput: {
    flex: 1,
  },
  sendBtn: {
    width: 85,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  // 인증번호 유효시간. 만료되면 같은 자리에 만료 문구가 들어간다.
  timer: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '500',
    color: colors.accent,
  },
});
