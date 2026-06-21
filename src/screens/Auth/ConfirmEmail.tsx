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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as shared } from './LoginView.styles';
import { confirmEmailStyles as styles } from './ConfirmEmail.styles';
import { startSignUp, verifyEmailCode } from '../../api/auth';
import type { SignUpData } from './SingUpView';
import colors from '../../assets/constants/colors';

type ConfirmEmailMode = 'signup' | 'resetPassword';

interface ConfirmEmailProps {
  mode?: ConfirmEmailMode;
  /** 회원가입 화면에서 입력한 아이디/비밀번호 (signup 모드에서 사용) */
  signupData?: SignUpData;
  onConfirm?: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({
  mode = 'signup',
  signupData,
  onConfirm,
}) => {
  const [email, setEmail]     = useState('');
  const [code, setCode]       = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    // 비밀번호 찾기는 백엔드 미구현 상태 → 보류 (UI만 동작)
    if (mode !== 'signup') {
      setSent(true);
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
    // 비밀번호 찾기는 백엔드 미구현 → 화면 전환만 (보류)
    if (mode !== 'signup') {
      onConfirm?.();
      return;
    }
    if (!code.trim()) {
      Alert.alert('알림', '인증코드를 입력해주세요.');
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
            <Text style={shared.logo}>
              <Text style={shared.logoPart}>Part</Text>
              <Text style={shared.logoTrip}>Trip</Text>
            </Text>
            <Text style={shared.title}>
              {mode === 'signup' ? '회원가입' : '비밀번호 찾기'}
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