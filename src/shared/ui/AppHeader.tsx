import React from 'react';
import { View, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appHeaderStyles as styles } from './AppHeader.styles';

/** 상단 공용 고정 헤더 — PartTrip 브랜드 로고
 *  프로필은 하단 탭바의 '마이'로 옮겨서 여기서 뺐다. */
const AppHeader: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

export default AppHeader;
