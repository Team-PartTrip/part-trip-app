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

interface ResetPasswordProps {
  onConfirm?: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onConfirm }) => {
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
            <Text style={styles.title}>비밀번호 찾기</Text>
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
              onPress={onConfirm}
            >
              <Text style={styles.loginBtnText}>비밀번호 변경하기</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ResetPassword;