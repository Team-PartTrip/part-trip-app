import React from 'react';
import { View, Text } from 'react-native';
import { profileStyles as styles } from './ProfileView.styles';

// 임시 화면 — 추후 구현 예정
const ProfileView: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <View style={styles.body}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.title}>프로필</Text>
        <Text style={styles.desc}>준비 중입니다.</Text>
      </View>
    </View>
  );
};

export default ProfileView;
