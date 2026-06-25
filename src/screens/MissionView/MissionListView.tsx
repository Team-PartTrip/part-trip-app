import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/constants/colors';
import ScreenHeader from '../../component/ScreenHeader';

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

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1a2a3a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tag: {
    fontSize: 11,
    color: colors.textSub,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  btn: {
    backgroundColor: colors.tint,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  btnText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
});
export default MissionListView;
