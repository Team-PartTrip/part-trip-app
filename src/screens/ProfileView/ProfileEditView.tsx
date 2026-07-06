import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { profileEditStyles as s } from './ProfileEditView.styles';
import { getProvider, getCurrentUserEmail } from '../../api/tokenStorage';
import { getMyProfile, updateProfile } from '../../api/profile';
import { uploadImage, toImageUrl } from '../../api/image';

const DEFAULT_AVATAR = require('../../assets/images/profile-character.jpg');

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
  const [nickname, setNickname] = useState('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [isGoogle, setIsGoogle] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProvider().then(p => setIsGoogle(p === 'GOOGLE'));
    getCurrentUserEmail().then(e => setEmail(e ?? ''));
    getMyProfile()
      .then(p => {
        setNickname(p.nickName);
        setImgUrl(p.imgUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChangePhoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.didCancel || !result.assets?.[0]?.uri) return;

    const asset = result.assets[0];
    try {
      setUploading(true);
      const url = await uploadImage(
        asset.uri!,
        asset.fileName ?? `profile-${Date.now()}.jpg`,
        asset.type ?? 'image/jpeg',
      );
      setImgUrl(url);
    } catch (e: any) {
      Alert.alert('업로드 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await updateProfile({ nickName: nickname.trim(), imgUrl });
      onConfirm?.();
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={{ marginTop: 60 }} />
      </View>
    );
  }

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
              <Image
                source={imgUrl ? { uri: toImageUrl(imgUrl) } : DEFAULT_AVATAR}
                style={{ width: '100%', height: '100%', borderRadius: 65 }}
                resizeMode="cover"
              />
              {uploading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                />
              )}
            </View>
            <TouchableOpacity
              style={s.changePhoto}
              activeOpacity={0.8}
              onPress={handleChangePhoto}
              disabled={uploading}
            >
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
            onPress={handleConfirm}
            disabled={saving || uploading}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.confirmText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileEditView;
