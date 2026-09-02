import React, { useEffect, useRef, useState } from 'react';
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
import { loginStyles as shared } from './LoginView.styles';
import { confirmEmailStyles as styles } from './ConfirmEmail.styles';
import {
  startSignUp,
  sendEmailCode,
  verifyEmailCode,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '../../entities/auth/api';
import type { SignUpData } from './SingUpView';
import colors from '../../shared/tokens/colors';

type ConfirmEmailMode = 'signup' | 'resetPassword';

// 인증번호 유효시간(초). 서버가 메일로 보낸 코드의 만료 시간과 맞춘다.
const CODE_TTL_SECONDS = 180;

// 재전송을 잠그는 시간(초). 연타하면 그만큼 메일이 여러 통 나간다.
const RESEND_COOLDOWN_SECONDS = 60;

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface ConfirmEmailProps {
  mode?: ConfirmEmailMode;
  onBack?: () => void;
  /** 회원가입 화면에서 입력한 아이디/비밀번호 (signup 모드에서 사용) */
  signupData?: SignUpData;
  /** 인증 완료 시 호출. resetPassword 모드에서는 인증된 이메일을 넘겨줌 */
  onConfirm?: (email?: string) => void;
}

const ConfirmEmail: React.FC<ConfirmEmailProps> = ({
  mode = 'signup',
  onBack,
  signupData,
  onConfirm,
}) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sentAt, setSentAt] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEmailChange = (value: string) => {
    if (value.trim() !== email.trim()) {
      setSent(false);
      setCooldown(0);
    }
    setEmail(value);
  };

  // 인증번호를 보낼 때마다 남은 시간과 재전송 잠금을 다시 센다
  useEffect(() => {
    if (!sent) {
      return;
    }
    setRemaining(CODE_TTL_SECONDS);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    timerRef.current = setInterval(() => {
      // 잠금(60초)이 유효시간(180초)보다 짧아 항상 먼저 끝난다
      setCooldown(prev => (prev > 0 ? prev - 1 : 0));
      setRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sent, sentAt]);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요.');
      return;
    }
    if (cooldown > 0) {
      Alert.alert('알림', `${cooldown}초 후에 다시 보낼 수 있습니다.`);
      return;
    }
    // 비밀번호 찾기: 가입된 이메일 확인 후 인증번호 발송
    if (mode !== 'signup') {
      try {
        setLoading(true);
        await sendPasswordResetCode(email.trim());
        setSent(true);
        setSentAt(Date.now());
        Alert.alert('알림', '인증번호를 전송했습니다.');
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
      if (sent) {
        // 재전송은 코드만 다시 보낸다. startSignUp 을 또 부르면
        // 임시 가입 정보를 매번 새로 저장하게 된다.
        await sendEmailCode(email.trim());
      } else {
        // 회원가입 임시 저장 + 인증코드 발송
        await startSignUp({
          userId: signupData.userId,
          userPwd: signupData.userPwd,
          userMail: email.trim(),
        });
      }
      setSent(true);
      setSentAt(Date.now());
      Alert.alert('알림', '인증번호를 전송했습니다.');
    } catch (e: any) {
      Alert.alert('전송 실패', e?.message ?? '인증코드 전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim()) {
      Alert.alert('알림', '인증번호를 입력해주세요.');
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
      <TouchableOpacity
        style={shared.backBtn}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        // 요청이 끝나기 전에 나가면, 화면이 닫힌 뒤에 결과가 돌아와
        // 이전 화면 위로 다음 화면이 열린다.
        disabled={loading}
        onPress={onBack}
      >
        <Text style={shared.back}>‹</Text>
      </TouchableOpacity>
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
              source={require('../../shared/assets/images/logo.png')}
              style={shared.brandLogo}
              resizeMode="contain"
            />
            <Text style={shared.title}>
              {mode === 'signup' ? '회원가입' : '비밀번호 찾기'}
            </Text>
          </View>

          {/* 입력 폼 */}
          <View style={shared.form}>
            {/* 이메일 + 인증 요청 버튼 */}
            <View style={styles.emailRow}>
              <TextInput
                style={[shared.input, styles.emailInput]}
                placeholder={
                  mode === 'signup'
                    ? '이메일을 입력하세요'
                    : '가입한 아이디 또는 이메일'
                }
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  (loading || cooldown > 0) && styles.sendBtnDisabled,
                ]}
                activeOpacity={0.8}
                onPress={handleSendCode}
                disabled={loading || cooldown > 0}
              >
                <Text style={styles.sendBtnText}>
                  {/* 버튼 폭이 85 라 잠금 중에는 남은 초만 넣는다 */}
                  {cooldown > 0
                    ? `${cooldown}초`
                    : sent
                    ? '재전송'
                    : '인증 요청'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 인증번호 입력 */}
            <TextInput
              style={[shared.input, shared.field]}
              placeholder="인증번호 6자리"
              placeholderTextColor={colors.placeholder}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />

            {/* 남은 유효시간 */}
            {sent && (
              <Text style={styles.timer}>
                {remaining > 0
                  ? `남은 시간 ${formatRemaining(remaining)}`
                  : '인증 시간이 만료되었습니다. 재전송해주세요.'}
              </Text>
            )}
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
                  {mode === 'signup' ? '가입 완료' : '다음'}
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
