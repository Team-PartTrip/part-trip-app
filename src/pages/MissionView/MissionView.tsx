import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { missionStyles as styles } from './MissionView.styles';
import { getMissions, Mission } from '../../entities/mission/api';

const CHARACTER_NAME = '까미';

interface MissionViewProps {
  /** 출석체크 화면 열기 */
  onOpenAttendance?: () => void;
  /** 완료한 미션 목록 열기 */
  onOpenCompleted?: () => void;
  /** 미션 상세 열기 */
  onOpenDetail?: (mission: Mission) => void;
}

const MissionView: React.FC<MissionViewProps> = ({
  onOpenAttendance,
  onOpenCompleted,
  onOpenDetail,
}) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMissions()
        .then(setMissions)
        .catch(() => setMissions([]))
        .finally(() => setLoading(false));
    }, []),
  );

  const activeMissions = missions.filter(m => !m.completed);
  const progress =
    missions.length === 0
      ? 0
      : (missions.length - activeMissions.length) / missions.length;

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 퀵 액션 */}
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={onOpenAttendance}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>📅</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickBtn}
            onPress={onOpenCompleted}
            activeOpacity={0.8}
          >
            <Text style={styles.quickIcon}>✅</Text>
          </TouchableOpacity>
        </View>

        {/* 캐릭터 카드 */}
        <View style={styles.charCard}>
          <View style={styles.playPill}>
            <Text style={styles.playPillText}>나랑 놀자</Text>
          </View>

          <View style={styles.charImageWrap}>
            <Image
              source={require('../../shared/assets/images/mission-character.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.charNameRow}>
            <Text style={styles.charNameIcon}>🐾</Text>
            <Text style={styles.charName}>{CHARACTER_NAME}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
        </View>

        {/* 미션 섹션 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>미션</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 12 }} />}

        {!loading && activeMissions.length === 0 && (
          <Text style={{ color: '#8a93a3', marginBottom: 12 }}>
            진행할 수 있는 미션이 없습니다.
          </Text>
        )}

        {activeMissions.map(m => (
          <View key={m.missionId} style={styles.missionCard}>
            <View style={styles.missionTextWrap}>
              <Text style={styles.missionTag}>{m.missionCategory}</Text>
              <Text style={styles.missionTitle}>{m.missionTitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.detailBtn}
              activeOpacity={0.85}
              onPress={() => onOpenDetail?.(m)}
            >
              <Text style={styles.detailBtnText}>자세히 보기 ›</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MissionView;
