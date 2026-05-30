import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as shared } from './LoginView.styles';

const BLUE = '#1a7fd4';

type ConfirmEmailMode = 'signup' | 'resetPassword';

interface ConfirmEmailProps {
  mode?: ConfirmEmailMode;
  onConfirm?: () => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({ mode = 'signup', onConfirm }) => {
  const [email, setEmail]   = useState('');
  const [code, setCode]     = useState('');
  const [sent, setSent]     = useState(false);

  const handleSendCode = () => {
    if (!email) return;
    // TODO: 인증코드 발송 API 연결
    setSent(true);
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
                placeholderTextColor="#aab4be"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[styles.sendBtn, sent && styles.sendBtnSent]}
                activeOpacity={0.8}
                onPress={handleSendCode}
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
              placeholderTextColor="#aab4be"
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
              onPress={onConfirm}
            >
              <Text style={shared.loginBtnText}>
                {mode === 'signup' ? '회원가입 하기' : '인증하기'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emailInput: {
    flex: 1,
  },
  sendBtn: {
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnSent: {
    borderColor: '#aab4be',
  },
  sendBtnText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '700',
  },
});

export default ConfirmEmail;