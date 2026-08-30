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
import {
  getMyProfile,
  getTravelThemes,
  TravelTheme,
  updateProfile,
} from '../../entities/profile/api';
import { uploadImage, toImageUrl } from '../../shared/api/image';

const DEFAULT_AVATAR = require('../../shared/assets/images/profile-character.jpg');

interface Props {
  onConfirm?: () => void;
}

const ProfileEditView: React.FC<Props> = ({
  onConfirm,
}) => {
  const [nickname, setNickname] = useState('');
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [themes, setThemes] = useState<TravelTheme[]>([]);
  const [themeId, setThemeId] = useState<number | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    // 여행 타입 목록은 없어도 화면이 뜨게 둔다. 그때는 칩만 안 보인다.
    Promise.all([getMyProfile(), getTravelThemes().catch(() => [])])
      .then(([p, list]) => {
        if (!alive) {
          return;
        }
        setNickname(p.nickName);
        setImgUrl(p.imgUrl);
        setThemeId(p.themeId);
        setThemes(list);
      })
      .catch(() => {
        if (!alive) {
          return;
        }
        // 프로필을 못 읽으면 닉네임이 빈 문자열로 남는다. 그대로 저장하면
        // 서버의 닉네임을 빈 값으로 덮어쓴다. 저장을 막고 이유를 알린다.
        setLoadFailed(true);
        Alert.alert(
          '불러오기 실패',
          '프로필을 불러오지 못했어요. 화면을 다시 열어주세요.',
        );
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const handleChangePhoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.didCancel) return;
    // 사진 권한을 거부하면 여기로 온다. 조용히 끝내면 사용자는 왜 아무 일도
    // 안 일어나는지 알 수 없다.
    if (result.errorCode) {
      Alert.alert(
        '사진을 열 수 없어요',
        result.errorCode === 'permission'
          ? '설정에서 사진 접근을 허용해주세요.'
          : '잠시 후 다시 시도해주세요.',
      );
      return;
    }
    if (!result.assets?.[0]?.uri) return;

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
    if (loadFailed) {
      // 못 읽은 값을 저장하면 서버 쪽을 빈 값으로 덮어쓴다
      Alert.alert('저장할 수 없어요', '프로필을 먼저 불러와야 해요.');
      return;
    }
    if (!nickname.trim()) {
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }
    try {
      setSaving(true);
      await updateProfile({ nickName: nickname.trim(), imgUrl, themeId });
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

            {/* 여행 타입 (Func-007-01) */}
            {themes.length > 0 && (
              <>
                <Text style={s.label}>여행 타입</Text>
                <View style={s.themeRow}>
                  {themes.map(theme => {
                    const on = theme.themeId === themeId;
                    return (
                      <TouchableOpacity
                        key={theme.themeId}
                        style={[s.themeChip, on && s.themeChipOn]}
                        activeOpacity={0.85}
                        // 다시 누르면 선택을 푼다. 서버는 null 을 받는다.
                        onPress={() => setThemeId(on ? null : theme.themeId)}
                      >
                        <Text
                          style={[s.themeChipText, on && s.themeChipTextOn]}
                        >
                          {theme.themeName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {!!themes.find(t => t.themeId === themeId)?.description && (
                  <Text style={s.themeDesc}>
                    {themes.find(t => t.themeId === themeId)?.description}
                  </Text>
                )}
              </>
            )}
          </View>

          <TouchableOpacity
            style={s.confirmBtn}
            activeOpacity={0.85}
            onPress={handleConfirm}
            disabled={saving || uploading || loadFailed}
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
