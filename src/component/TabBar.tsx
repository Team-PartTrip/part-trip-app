import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarStyles as styles } from './TabBar.styles';
import colors from '../assets/constants/colors';

export type TabKey = 'home' | 'community' | 'record' | 'mission';

interface TabItem {
  key: TabKey;
  label: string;
  icon: number;
}

const LEFT_TABS: TabItem[] = [
  { key: 'home', label: '홈', icon: require('../assets/images/tab-home.png') },
  {
    key: 'community',
    label: '커뮤니티',
    icon: require('../assets/images/tab-community.png'),
  },
];

const RIGHT_TABS: TabItem[] = [
  {
    key: 'record',
    label: '기록',
    icon: require('../assets/images/tab-record.png'),
  },
  {
    key: 'mission',
    label: '미션',
    icon: require('../assets/images/tab-mission.png'),
  },
];

interface TabBarProps {
  /** 현재 활성 탭 강조용 */
  active?: string;
  onTabPress?: (key: TabKey) => void;
  onCamera?: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ active = 'home', onTabPress, onCamera }) => {
  const insets = useSafeAreaInsets();

  const renderItem = (tab: TabItem) => {
    const isActive = active === tab.key;
    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.item}
        activeOpacity={0.7}
        onPress={() => onTabPress?.(tab.key)}
      >
        <Image
          source={tab.icon}
          resizeMode="contain"
          style={[
            styles.iconImage,
            { tintColor: isActive ? colors.primary : colors.tabInactive },
          ]}
        />
        <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {LEFT_TABS.map(renderItem)}

      {/* 가운데 카메라 버튼 */}
      <View style={styles.centerWrap}>
        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85} onPress={onCamera}>
          <Text style={styles.cameraIcon}>📷</Text>
        </TouchableOpacity>
      </View>

      {RIGHT_TABS.map(renderItem)}
    </View>
  );
};

export default TabBar;
