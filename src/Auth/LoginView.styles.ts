import { StyleSheet } from 'react-native';

const BLUE      = '#1a7fd4';
const BLUE_DARK = '#155fa0';

export const loginStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 32,
  },

  // 로고
  logoArea: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  logoPart: {
    color: BLUE,
  },
  logoTrip: {
    color: BLUE_DARK,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a2a3a',
    letterSpacing: -0.5,
  },

  // 폼
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#dce6f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a2a3a',
    backgroundColor: '#f8fafd',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 13,
    color: '#7a9ab5',
  },

  // 버튼
  actions: {
    gap: 12,
  },
  loginBtn: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // 구분선
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dce6f0',
  },
  dividerText: {
    fontSize: 13,
    color: '#9ab0c4',
    fontWeight: '500',
  },

  // Google 버튼
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#dce6f0',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: '#ffffff',
  },
  googleG: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a2a3a',
  },

  // 회원가입 버튼
  signupBtn: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});