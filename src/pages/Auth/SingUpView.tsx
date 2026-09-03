import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { checkUserIdAvailable } from '../../entities/auth/api';
import { loginStyles as styles } from './LoginView.styles';
import colors from '../../shared/tokens/colors';

export interface SignUpData {
  userId: string;
  userPwd: string;
}

const ID_RE = /^[a-z0-9]{6,20}$/;
const ID_MESSAGE = '아이디는 6~20자의 영문 소문자와 숫자만 사용할 수 있습니다.';
const PWD_MESSAGE =
  '비밀번호는 8~64자이며 영문·숫자·특수문자 중 2종 이상을 조합해야 합니다.';

/** 8~64자 + 영문/숫자/특수문자 중 2종 이상 (서버 정규식을 읽기 쉽게 옮긴 것) */
function isValidPassword(password: string): boolean {
  if (password.length < 8 || password.length > 64) {
    return false;
  }
  const kinds = [/[A-Za-z]/, /\d/, /[^A-Za-z0-9]/].filter(re =>
    re.test(password),
  ).length;
  return kinds >= 2;
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
  const [checking, setChecking]         = useState(false);

  const handleNext = async () => {
    if (!id.trim() || !password) {
      Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
      return;
    }
    if (!ID_RE.test(id.trim())) {
      Alert.alert('알림', ID_MESSAGE);
      return;
    }
    if (!isValidPassword(password)) {
      Alert.alert('알림', PWD_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('알림', '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 형식이 다 맞으면 마지막으로 아이디가 이미 쓰이고 있는지 서버에 물어본다
    try {
      setChecking(true);
      const available = await checkUserIdAvailable(id.trim());
      if (!available) {
        Alert.alert('알림', '이미 존재하는 아이디입니다.');
        return;
      }
    } catch (e: any) {
      Alert.alert(
        '확인 실패',
        e?.message ?? '아이디를 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
      return;
    } finally {
      setChecking(false);
    }

    // 실제 회원가입(/signup) 호출은 이메일 인증 단계에서 이메일과 함께 진행
    onNext?.({ userId: id.trim(), userPwd: password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.backBtn}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        // 요청이 끝나기 전에 나가면, 화면이 닫힌 뒤에 결과가 돌아와
        // 이전 화면 위로 다음 화면이 열린다.
        disabled={checking}
        onPress={onBack}
      >
        <Text style={styles.back}>‹</Text>
      </TouchableOpacity>
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
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.title}>회원가입</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="아이디"
              placeholderTextColor={colors.placeholder}
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
            />
            <Text style={styles.helper}>6~20자 · 영문 소문자와 숫자</Text>

            <TextInput
              style={[styles.input, styles.fieldAfterHelper]}
              placeholder="비밀번호"
              placeholderTextColor={colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Text style={styles.helper}>
              8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상
            </Text>

            <TextInput
              style={[styles.input, styles.fieldAfterHelper]}
              placeholder="비밀번호 확인"
              placeholderTextColor={colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

          </View>

          {/* 버튼 영역 */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.85}
              onPress={handleNext}
              disabled={checking}
            >
              {checking ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginBtnText}>다음</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpView;