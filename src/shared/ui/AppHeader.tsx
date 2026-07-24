import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appHeaderStyles as styles } from './AppHeader.styles';
import { getMyProfile } from '../../entities/profile/api';
import { toImageUrl } from '../api/image';

const DEFAULT_AVATAR = require('../assets/images/profile-character.jpg');

interface AppHeaderProps {
  onProfile?: () => void;
  /** 값이 바뀔 때마다 프로필 사진을 다시 불러옴 (예: 현재 라우트명) */
  refreshKey?: string;
}

/** 상단 공용 고정 헤더 — PartTrip 브랜드 로고 + 프로필 버튼 */
const AppHeader: React.FC<AppHeaderProps> = ({ onProfile, refreshKey }) => {
  const insets = useSafeAreaInsets();
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    getMyProfile()
      .then(p => setImgUrl(p.imgUrl))
      .catch(() => {});
  }, [refreshKey]);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.profile} onPress={onProfile}>
        <Image
          source={imgUrl ? { uri: toImageUrl(imgUrl) } : DEFAULT_AVATAR}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
