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
import { getProvider } from '../../api/tokenStorage';

interface Props {
  onConfirm?: () => void;
  onResetSurvey?: () => void;
}

const ProfileEditView: React.FC<Props> = ({ onConfirm, onResetSurvey }) => {
  const [nickname, setNickname] = useState('계략적인 모험가');
  const [password, setPassword] = useState('');
  const [isGoogle, setIsGoogle] = useState(false);

  useEffect(() => {
    getProvider().then(p => setIsGoogle(p === 'GOOGLE'));
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

            {/* 비밀번호 변경 — 이메일 가입자만 표시 */}
            {!isGoogle && (
              <>
                <Text style={s.label}>비밀번호 변경</Text>
                <TextInput
                  style={s.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="새 비밀번호 (변경 시에만 입력)"
                  placeholderTextColor="#aab4be"
                  secureTextEntry
                />
              </>
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
