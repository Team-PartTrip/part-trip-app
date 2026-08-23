import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { plannerStyles as s } from './PlannerScreen.styles';
import colors from '../../shared/tokens/colors';

// 플래너(Func-008)는 서버 API가 아직 없다. 탭 자리만 잡아두고
// 그룹 · 투표 API 가 붙으면 이 화면을 실제 내용으로 교체한다.
const PlannerScreen: React.FC = () => {
  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <View style={s.center}>
        <View style={s.iconWrap}>
          <Image
            source={require('../../shared/assets/images/tab-planner.png')}
            resizeMode="contain"
            style={[s.icon, { tintColor: colors.primary }]}
          />
        </View>
        <Text style={s.title}>플래너는 준비 중이에요</Text>
        <Text style={s.desc}>
          함께 갈 사람들과 여행지 · 일정을 투표로 정하는 기능이에요.{'\n'}
          곧 만나보실 수 있어요.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default PlannerScreen;
