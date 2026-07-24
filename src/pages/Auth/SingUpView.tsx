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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as styles } from './LoginView.styles';
import PhoneInput from '../../shared/ui/PhoneInput';

export interface SignUpData {
  userId: string;
  userPwd: string;
}

interface SignUpViewProps {
  onBack?: () => void;
  /** 아이디/비밀번호 입력 완료 시 다음(이메일 인증) 단계로 데이터 전달 */
  onNext?: (data: SignUpData) => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onBack, onNext }) => {
  const [id, setId]                     = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone]               = useState('');

  const handleNext = () => {
    if (!id.trim() || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('알림', '전화번호를 입력해주세요.');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('알림', '전화번호를 정확히 입력해주세요.');
      return;
    }
    // 실제 회원가입(/signup) 호출은 이메일 인증 단계에서 이메일과 함께 진행
    onNext?.({ userId: id.trim(), userPwd: password });
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
            <Image
              source={require('../../shared/assets/images/logo.png')}
              style={{ width: 170, height: 40 }}
              resizeMode="contain"
            />
            <Text style={styles.title}>회원가입</Text>
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
            />
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
            {/* 전화번호 입력 */}
            <PhoneInput onChange={(number) => setPhone(number)} />
          </View>

          {/* 버튼 영역 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleNext}
            >
              <Text style={styles.loginBtnText}>다음</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpView;