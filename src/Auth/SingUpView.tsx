import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as styles } from './LoginView.styles';
import PhoneInput from '../component/PhoneInput';

interface SignUpViewProps {
  onBack?: () => void;
  onNext?: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onBack, onNext }) => {
  const [id, setId]                     = useState('');
  const [password, setPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone]               = useState('');

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
            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85} onPress={onNext}>
              <Text style={styles.loginBtnText}>다음</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpView;