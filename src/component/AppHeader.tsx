import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appHeaderStyles as styles } from './AppHeader.styles';

interface AppHeaderProps {
  onProfile?: () => void;
}

/** 상단 공용 고정 헤더 — PartTrip 브랜드 로고 + 프로필 버튼 */
const AppHeader: React.FC<AppHeaderProps> = ({ onProfile }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.logo}>
        <Text style={styles.logoPart}>Part</Text>
        <Text style={styles.logoTrip}>Trip</Text>
      </Text>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.profile} onPress={onProfile}>
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
