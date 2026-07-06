import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { missionStyles as styles } from './MissionView.styles';

interface MissionItem {
  id: string;
  tag: string;
  title: string;
  emoji: string;
}

// ── 더미 데이터 (추후 GET /api/missions 연동) ──
const CHARACTER = { name: '까미', progress: 0.45 };

const MISSIONS: MissionItem[] = [
  { id: 'm1', tag: '기본 미션', title: '라멘 먹기', emoji: '🍜' },
  { id: 'm2', tag: '기본 미션', title: '푸딩 먹기', emoji: '🍮' },
  {
    id: 'm3',
    tag: '픽셀 카메라 미션',
    title: '라이트쇼 구경하기',
    emoji: '💡',
  },
  { id: 'm4', tag: '해설 카메라 미션', title: '에펠탑 먹기', emoji: '🗼' },
];

interface MissionViewProps {
  /** 출석체크 화면 열기 */
  onOpenAttendance?: () => void;
  /** 완료한 미션 목록 열기 */
  onOpenCompleted?: () => void;
  /** 미션 상세 열기 */
  onOpenDetail?: (id: string) => void;
}

const MissionView: React.FC<MissionViewProps> = ({
  onOpenAttendance,
  onOpenCompleted,
  onOpenDetail,
}) => {
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
              source={require('../../assets/images/mission-character.png')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.charNameRow}>
            <Text style={styles.charNameIcon}>🐾</Text>
            <Text style={styles.charName}>{CHARACTER.name}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${CHARACTER.progress * 100}%` },
              ]}
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

        {MISSIONS.map(m => (
          <View key={m.id} style={styles.missionCard}>
            <View style={styles.missionTextWrap}>
              <Text style={styles.missionTag}>{m.tag}</Text>
              <Text style={styles.missionTitle}>
                {m.title} {m.emoji}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.detailBtn}
              activeOpacity={0.85}
              onPress={() => onOpenDetail?.(m.id)}
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
