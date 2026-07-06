import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { profileEditStyles as s } from './ProfileEditView.styles';
import { getProvider, getCurrentUserEmail } from '../../api/tokenStorage';

interface Props {
  onConfirm?: () => void;
  onResetSurvey?: () => void;
  onChangePassword?: (email: string) => void;
}

const ProfileEditView: React.FC<Props> = ({
  onConfirm,
  onResetSurvey,
  onChangePassword,
}) => {
  const [nickname, setNickname] = useState('계략적인 모험가');
  const [isGoogle, setIsGoogle] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    getProvider().then(p => setIsGoogle(p === 'GOOGLE'));
    getCurrentUserEmail().then(e => setEmail(e ?? ''));
  }, []);

  return (
    <View style={s.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* 프로필 이미지 */}
          <View style={s.banner}>
            <View style={s.avatarWrap}>
              <Text style={s.avatarEmoji}>🐨</Text>
            </View>
            <TouchableOpacity style={s.changePhoto} activeOpacity={0.8}>
              <Text style={s.changePhotoText}>프로필 이미지 변경</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.title}>{nickname}</Text>

          <View style={s.form}>
            {/* 닉네임 */}
            <Text style={s.label}>닉네임</Text>
            <TextInput
              style={s.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임"
              placeholderTextColor="#aab4be"
            />

            {/* 비밀번호 변경 — 이메일 가입자만 표시, 회원가입과 동일하게
                이메일 인증 후 새 비밀번호 2번 입력하는 플로우로 진행 */}
            {!isGoogle && (
              <TouchableOpacity
                style={s.linkRow}
                activeOpacity={0.85}
                onPress={() => onChangePassword?.(email)}
              >
                <Text style={s.linkText}>비밀번호 변경</Text>
                <Text style={s.linkArrow}>›</Text>
              </TouchableOpacity>
            )}

            {/* 여행 취향 재설정 */}
            <TouchableOpacity
              style={s.linkRow}
              activeOpacity={0.85}
              onPress={onResetSurvey}
            >
              <Text style={s.linkText}>여행 취향 재설정</Text>
              <Text style={s.linkArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={s.confirmBtn}
            activeOpacity={0.85}
            onPress={onConfirm}
          >
            <Text style={s.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileEditView;
