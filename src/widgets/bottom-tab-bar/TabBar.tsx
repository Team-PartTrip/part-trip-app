import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tabBarStyles as styles } from './TabBar.styles';
import colors from '../../shared/tokens/colors';

export type TabKey = 'home' | 'planner' | 'record' | 'profile';

interface TabItem {
  key: TabKey;
  label: string;
  icon: number;
}

// 순서와 아이콘 모두 피그마 TabBar 컴포넌트에서 내보낸 것을 그대로 쓴다
const TABS: TabItem[] = [
  {
    key: 'home',
    label: '홈',
    icon: require('../../shared/assets/images/tab-home.png'),
  },
  {
    key: 'planner',
    label: '플래너',
    icon: require('../../shared/assets/images/tab-planner.png'),
  },
  {
    key: 'record',
    label: '기록',
    icon: require('../../shared/assets/images/tab-record.png'),
  },
  {
    key: 'profile',
    label: '마이',
    icon: require('../../shared/assets/images/tab-profile.png'),
  },
];

interface TabBarProps {
  active?: string;
  onTabPress?: (key: TabKey) => void;
}

const TabBar: React.FC<TabBarProps> = ({ active = 'home', onTabPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
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
                styles.icon,
                { tintColor: isActive ? colors.primary : colors.tabInactive },
              ]}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
