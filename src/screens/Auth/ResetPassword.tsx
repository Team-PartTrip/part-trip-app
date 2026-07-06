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
import { loginStyles as styles } from './LoginView.styles';
import { resetPassword as resetPasswordApi } from '../../api/auth';

interface ResetPasswordProps {
  /** 비밀번호를 변경할 (인증 완료된) 이메일 */
  email: string;
  /** 진입 경로. 'profile'이면 문구를 "비밀번호 변경"으로 표시 */
  from?: 'login' | 'profile';
  onConfirm?: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  email,
  from,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert('알림', '비밀번호를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      setLoading(true);
      await resetPasswordApi(email, password, confirmPassword);
      Alert.alert('완료', '비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      onConfirm?.();
    } catch (e: any) {
      Alert.alert('변경 실패', e?.message ?? '비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 로고 + 타이틀 */}
          <View style={styles.logoArea}>
            <Text style={styles.logo}>
              <Text style={styles.logoPart}>Part</Text>
              <Text style={styles.logoTrip}>Trip</Text>
            </Text>
            <Text style={styles.title}>
              {from === 'profile' ? '비밀번호 변경' : '비밀번호 찾기'}
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor="#aab4be"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력하세요."
              placeholderTextColor="#aab4be"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* 버튼 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginBtnText}>비밀번호 변경하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;