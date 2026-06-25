import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { missionListStyles as s } from './MissionListView.styles';

const MISSIONS = [
  { id: 'm1', tag: '기본 미션', title: '라멘 먹기', emoji: '🍜' },
  { id: 'm2', tag: '기본 미션', title: '푸딩 먹기', emoji: '🍮' },
  {
    id: 'm3',
    tag: '픽셀 카메라 미션',
    title: '라이트쇼 구경하기',
    emoji: '💡',
  },
  { id: 'm4', tag: '해설 카메라 미션', title: '에펠탑 먹기', emoji: '🗼' },
  { id: 'm5', tag: '해설 카메라 미션', title: '에펠탑 먹기', emoji: '🗼' },
];

interface Props {
  onBack?: () => void;
  onOpenDetail?: (id: string) => void;
}

const MissionListView: React.FC<Props> = ({ onBack, onOpenDetail }) => (
  <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
    <ScreenHeader title="완료한 미션" onBack={onBack} />
    <ScrollView
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {MISSIONS.map(m => (
        <View key={m.id} style={s.card}>
          <View style={{ flex: 1 }}>
            <Text style={s.tag}>{m.tag}</Text>
            <Text style={s.title}>
              {m.title} {m.emoji}
            </Text>
          </View>
          <TouchableOpacity
            style={s.btn}
            activeOpacity={0.85}
            onPress={() => onOpenDetail?.(m.id)}
          >
            <Text style={s.btnText}>자세히 보기 ›</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

export default MissionListView;
