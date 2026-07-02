import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { profileStyles as s } from './ProfileView.styles';

interface Badge {
  id: string;
  emoji: string;
  label: string;
  sub: string;
  earned: boolean;
  desc: string;
}

const USER = {
  nickname: '계략세운 모험가',
  type: '즉흥 경험형 코알라',
  avatar: '🐨',
};

const BADGES: Badge[] = [
  {
    id: 'b1',
    emoji: '🧭',
    label: '첫 발걸음',
    sub: '첫 여행지 등록',
    earned: true,
    desc: '첫 여행지를 등록하고 여정을 시작했어요!',
  },
  {
    id: 'b2',
    emoji: '🌍',
    label: '세계 탐험가',
    sub: '5개국 방문',
    earned: true,
    desc: '5개국을 방문한 진정한 탐험가예요.',
  },
  {
    id: 'b3',
    emoji: '🚩',
    label: '초보 모험가',
    sub: 'LV.5 달성',
    earned: true,
    desc: '레벨 5를 달성했어요.',
  },
  {
    id: 'b4',
    emoji: '📷',
    label: '탐험의 시작',
    sub: '첫 사진 분석',
    earned: true,
    desc: '첫 사진 분석을 완료했어요.',
  },
  {
    id: 'b5',
    emoji: '✈️',
    label: '지구 한 바퀴',
    sub: '20개국 방문',
    earned: false,
    desc: '20개국을 방문하면 획득할 수 있어요.',
  },
  {
    id: 'b6',
    emoji: '🏳️',
    label: '속련 탐험가',
    sub: 'LV.20 달성',
    earned: false,
    desc: '레벨 20을 달성하면 획득할 수 있어요.',
  },
];

interface Props {
  onEdit?: () => void;
  onSeeAllBadges?: () => void;
}

const ProfileView: React.FC<Props> = ({ onEdit, onSeeAllBadges }) => {
  const [selected, setSelected] = useState<Badge | null>(null);
  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarEmoji}>{USER.avatar}</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.nickname}>{USER.nickname}</Text>
            <Text style={s.type}>{USER.type}</Text>
            <TouchableOpacity
              style={s.editBtn}
              activeOpacity={0.85}
              onPress={onEdit}
            >
              <Text style={s.editBtnText}>정보 수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 뱃지 */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>뱃지</Text>
          <TouchableOpacity onPress={onSeeAllBadges}>
            <Text style={s.seeAll}>전체보기 →</Text>
          </TouchableOpacity>
        </View>
        <View style={s.grid}>
          {BADGES.map(b => (
            <TouchableOpacity
              key={b.id}
              style={s.badgeCard}
              activeOpacity={0.85}
              onPress={() => setSelected(b)}
            >
              <View style={[s.badgeEmblem, !b.earned && s.badgeLocked]}>
                <Text style={s.badgeEmoji}>{b.emoji}</Text>
              </View>
              <View style={[s.ribbon, !b.earned && s.ribbonLocked]}>
                <Text style={s.ribbonText}>{b.label}</Text>
              </View>
              <Text style={s.badgeSub}>{b.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* 뱃지 상세 */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <TouchableOpacity
              style={s.modalClose}
              onPress={() => setSelected(null)}
            >
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <View style={s.modalEmblem}>
              <Text style={s.modalEmoji}>{selected?.emoji}</Text>
            </View>
            <Text style={s.modalTitle}>{selected?.label}</Text>
            <Text style={s.modalSub}>{selected?.sub}</Text>
            <View style={s.modalDescBox}>
              <Text style={s.modalDesc}>{selected?.desc}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileView;
