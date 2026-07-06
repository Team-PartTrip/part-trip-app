import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as shared } from './LoginView.styles';
import { confirmEmailStyles as styles } from './ConfirmEmail.styles';
import {
  startSignUp,
  verifyEmailCode,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '../../api/auth';
import type { SignUpData } from './SingUpView';
import colors from '../../assets/constants/colors';

type ConfirmEmailMode = 'signup' | 'resetPassword';

interface ConfirmEmailProps {
  mode?: ConfirmEmailMode;
  /** 회원가입 화면에서 입력한 아이디/비밀번호 (signup 모드에서 사용) */
  signupData?: SignUpData;
  /** 이미 알고 있는 이메일로 미리 채워줄 때 사용 (프로필에서 비밀번호 변경 진입 시) */
  initialEmail?: string;
  /** 진입 경로. 'profile'이면 문구를 "비밀번호 변경"으로 표시 */
  from?: 'login' | 'profile';
  /** 인증 완료 시 호출. resetPassword 모드에서는 인증된 이메일을 넘겨줌 */
  onConfirm?: (email?: string) => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({
  mode = 'signup',
  signupData,
  initialEmail,
  from,
  onConfirm,
}) => {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    // 비밀번호 찾기: 가입된 이메일 확인 후 인증번호 발송
    if (mode !== 'signup') {
      try {
        setLoading(true);
        await sendPasswordResetCode(email.trim());
        setSent(true);
        Alert.alert('알림', '인증코드를 전송했습니다.');
      } catch (e: any) {
        Alert.alert('전송 실패', e?.message ?? '인증코드 전송에 실패했습니다.');
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!signupData) {
      Alert.alert('알림', '회원가입 정보를 먼저 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      // 회원가입 임시 저장 + 인증코드 발송
      await startSignUp({
        userId: signupData.userId,
        userPwd: signupData.userPwd,
        userMail: email.trim(),
      });
      setSent(true);
      Alert.alert('알림', '인증코드를 전송했습니다.');
    } catch (e: any) {
      Alert.alert('전송 실패', e?.message ?? '인증코드 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim()) {
      Alert.alert('알림', '인증코드를 입력해주세요.');
      return;
    }
    // 비밀번호 찾기: 인증번호 확인 후 새 비밀번호 입력 화면으로 이동
    if (mode !== 'signup') {
      try {
        setLoading(true);
        await verifyPasswordResetCode(email.trim(), code.trim());
        onConfirm?.(email.trim());
      } catch (e: any) {
        Alert.alert('인증 실패', e?.message ?? '인증에 실패했습니다.');
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      await verifyEmailCode(email.trim(), code.trim());
      Alert.alert('회원가입 완료', '가입이 완료되었습니다. 로그인해주세요.');
      onConfirm?.();
    } catch (e: any) {
      Alert.alert('인증 실패', e?.message ?? '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={shared.safeArea}>
      <KeyboardAvoidingView
        style={shared.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={shared.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 로고 + 타이틀 */}
          <View style={shared.logoArea}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 170, height: 40 }}
              resizeMode="contain"
            />
            <Text style={shared.title}>
              {mode === 'signup'
                ? '회원가입'
                : from === 'profile'
                ? '비밀번호 변경'
                : '비밀번호 찾기'}
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={shared.form}>
            {/* 이메일 + 인증코드 보내기 버튼 */}
            <View style={styles.emailRow}>
              <TextInput
                style={[shared.input, styles.emailInput]}
                placeholder="이메일을 입력하세요."
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[styles.sendBtn, sent && styles.sendBtnSent]}
                activeOpacity={0.8}
                onPress={handleSendCode}
                disabled={loading}
              >
                <Text style={styles.sendBtnText}>
                  {sent ? '재전송' : '인증코드 보내기'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 인증코드 입력 */}
            <TextInput
              style={shared.input}
              placeholder="인증코드를 입력하세요."
              placeholderTextColor={colors.placeholder}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
          </View>

          {/* 회원가입 하기 버튼 */}
          <View style={shared.actions}>
            <TouchableOpacity
              style={shared.loginBtn}
              activeOpacity={0.85}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={shared.loginBtnText}>
                  {mode === 'signup' ? '회원가입 하기' : '인증하기'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfirmEmail;