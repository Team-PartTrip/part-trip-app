import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { missionListStyles as s } from './MissionListView.styles';
import { getCompletedMissions, Mission } from '../../entities/mission/api';

interface Props {
  onBack?: () => void;
  onOpenDetail?: (mission: Mission) => void;
}

const MissionListView: React.FC<Props> = ({ onBack, onOpenDetail }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompletedMissions()
      .then(setMissions)
      .catch(() => setMissions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="완료한 미션" onBack={onBack} />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        {!loading && missions.length === 0 && (
          <Text style={{ color: '#8a93a3' }}>완료한 미션이 없습니다.</Text>
        )}

        {missions.map(m => (
          <View key={m.missionId} style={s.card}>
            <View style={{ flex: 1 }}>
              <Text style={s.tag}>{m.missionCategory}</Text>
              <Text style={s.title}>{m.missionTitle}</Text>
            </View>
            <TouchableOpacity
              style={s.btn}
              activeOpacity={0.85}
              onPress={() => onOpenDetail?.(m)}
            >
              <Text style={s.btnText}>자세히 보기 ›</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MissionListView;
