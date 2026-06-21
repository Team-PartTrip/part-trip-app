import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarStyles as styles } from './TabBar.styles';

export type TabKey = 'home' | 'community' | 'record' | 'mission';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const LEFT_TABS: TabItem[] = [
  { key: 'home', label: '홈', icon: '🏠' },
  { key: 'community', label: '커뮤니티', icon: '👥' },
];

const RIGHT_TABS: TabItem[] = [
  { key: 'record', label: '기록', icon: '🗂' },
  { key: 'mission', label: '미션', icon: '🎯' },
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
        <Text style={[styles.icon, { opacity: isActive ? 1 : 0.5 }]}>{tab.icon}</Text>
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
