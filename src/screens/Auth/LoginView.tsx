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
import { login } from '../../api/auth';
import { saveTokens } from '../../api/tokenStorage';

interface LoginViewProps {
  onLogin?: () => void;
  onSignup?: () => void;
  onResetPassword?: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignup, onResetPassword }) => {
  const [id, setId]             = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!id.trim() || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    try {
      setLoading(true);
      const tokens = await login(id.trim(), password);
      await saveTokens(tokens);
      onLogin?.();
    } catch (e: any) {
      Alert.alert('로그인 실패', e?.message ?? '로그인에 실패했습니다.');
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
            <Text style={styles.title}>로그인</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="아이디를 입력하세요."
              placeholderTextColor="#aab4be"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력하세요."
              placeholderTextColor="#aab4be"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotBtn} onPress={onResetPassword}>
              <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginBtnText}>로그인 하기</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
              <Text style={styles.googleG}>G</Text>
              <Text style={styles.googleText}>Google로 계속하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupBtn} onPress={onSignup}>
            <Text style={styles.signupText}>회원가입 하기</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginView;