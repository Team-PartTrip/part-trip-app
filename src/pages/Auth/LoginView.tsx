import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginStyles as styles } from './LoginView.styles';
import { googleLogin, kakaoLogin } from '../../entities/auth/api';
import {
  configureGoogleSignin,
  signInWithGoogle,
} from '../../shared/lib/googleSignin';
import {
  signInWithKakao,
  isKakaoCancelled,
} from '../../shared/lib/kakaoSignin';
import { saveTokens, saveProvider } from '../../shared/api/tokenStorage';
import colors from '../../shared/tokens/colors';

interface LoginViewProps {
  onLogin?: () => void;
}

/**
 * 로그인은 카카오와 구글만 쓴다 (명세 Func-001).
 *
 * 첫 로그인이면 서버가 가입까지 한 번에 끝내므로 회원가입 화면이 따로 없다.
 * 아이디 · 비밀번호가 없으니 비밀번호 찾기도 없다.
 */
const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configureGoogleSignin();
  }, []);

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      const accessToken = await signInWithKakao();
      const tokens = await kakaoLogin(accessToken);
      await saveTokens(tokens);
      await saveProvider('KAKAO');
      onLogin?.();
    } catch (e: any) {
      // 사용자가 카카오 화면에서 그냥 닫은 것은 실패가 아니다
      if (isKakaoCancelled(e)) {
        return;
      }
      Alert.alert('카카오 로그인 실패', e?.message ?? '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const idToken = await signInWithGoogle();
      const tokens = await googleLogin(idToken);
      await saveTokens(tokens);
      await saveProvider('GOOGLE');
      onLogin?.();
    } catch (e: any) {
      Alert.alert('Google 로그인 실패', e?.message ?? '다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoArea}>
          <Image
            source={require('../../shared/assets/images/logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
          <Text style={styles.title}>로그인</Text>
          <Text style={styles.subtitle}>
            처음이면 로그인하면서 가입도 함께 끝나요
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.kakaoBtn}
            activeOpacity={0.85}
            onPress={handleKakaoLogin}
            disabled={loading}
          >
            <Text style={styles.kakaoBtnText}>카카오로 계속하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.85}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleG}>G</Text>
            <Text style={styles.outlineBtnText}>Google로 계속하기</Text>
          </TouchableOpacity>

          {loading && (
            <ActivityIndicator style={styles.loading} color={colors.primary} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginView;
