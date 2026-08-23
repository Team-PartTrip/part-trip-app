import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { profileStyles as s } from './ProfileView.styles';
import { logout } from '../../entities/auth/api';
import { getRefreshToken, clearTokens } from '../../shared/api/tokenStorage';
import { getMyProfile, UserProfile } from '../../entities/profile/api';
import { toImageUrl } from '../../shared/api/image';

interface Badge {
  id: string;
  icon: number;
  label: string;
  sub: string;
  earned: boolean;
  desc: string;
}

const DEFAULT_AVATAR = require('../../shared/assets/images/profile-character.jpg');

const BADGES: Badge[] = [
  {
    id: 'b1',
    icon: require('../../shared/assets/images/profile-badge-1.png'),
    label: '첫 발걸음',
    sub: '첫 여행지 등록',
    earned: true,
    desc: '첫 여행지를 등록하고 여정을 시작했어요!',
  },
  {
    id: 'b2',
    icon: require('../../shared/assets/images/profile-badge-2.png'),
    label: '세계 탐험가',
    sub: '5개국 방문',
    earned: true,
    desc: '5개국을 방문한 진정한 탐험가예요.',
  },
  {
    id: 'b3',
    icon: require('../../shared/assets/images/profile-badge-3.png'),
    label: '초보 모험가',
    sub: 'LV.5 달성',
    earned: true,
    desc: '레벨 5를 달성했어요.',
  },
  {
    id: 'b4',
    icon: require('../../shared/assets/images/profile-badge-4.png'),
    label: '탐험의 시작',
    sub: '첫 사진 분석',
    earned: true,
    desc: '첫 사진 분석을 완료했어요.',
  },
  {
    id: 'b5',
    icon: require('../../shared/assets/images/profile-badge-5.png'),
    label: '지구 한 바퀴',
    sub: '20개국 방문',
    earned: false,
    desc: '20개국을 방문하면 획득할 수 있어요.',
  },
  {
    id: 'b6',
    icon: require('../../shared/assets/images/profile-badge-6.png'),
    label: '속련 탐험가',
    sub: 'LV.20 달성',
    earned: false,
    desc: '레벨 20을 달성하면 획득할 수 있어요.',
  },
];


interface Props {
  onEdit?: () => void;
  onSeeAllBadges?: () => void;
  onLogout?: () => void;
  onNotificationSettings?: () => void;
}

const ProfileView: React.FC<Props> = ({
  onEdit,
  onSeeAllBadges,
  onLogout,
  onNotificationSettings,
}) => {
  const [selected, setSelected] = useState<Badge | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);




  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then(setProfile)
        .catch(() => setProfile(null));
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
              await logout(refreshToken).catch(() => {});
            }
          } finally {
            await clearTokens();
            onLogout?.();
          }
        },
      },
    ]);
  };

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Image
              source={
                profile?.imgUrl
                  ? { uri: toImageUrl(profile.imgUrl) }
                  : DEFAULT_AVATAR
              }
              style={{ width: '100%', height: '100%', borderRadius: 38 }}
              resizeMode="cover"
            />
          </View>
          <View style={s.profileInfo}>
            <Text style={s.nickname}>{profile?.nickName ?? '...'}</Text>
            <Text style={s.type}>
              {profile?.themeName ?? '여행 타입을 골라보세요'}
            </Text>
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
                <Image
                  source={b.icon}
                  style={{ width: '100%', height: '100%', borderRadius: 44 }}
                  resizeMode="cover"
                />
              </View>
              <View style={[s.ribbon, !b.earned && s.ribbonLocked]}>
                <Text style={s.ribbonText}>{b.label}</Text>
              </View>
              <Text style={s.badgeSub}>{b.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>


        <TouchableOpacity
          style={s.settingsRow}
          activeOpacity={0.85}
          onPress={onNotificationSettings}
        >
          <Text style={s.settingsRowText}>알림 설정</Text>
          <Text style={s.settingsRowChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={s.logoutBtnText}>로그아웃</Text>
        </TouchableOpacity>
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
              {selected && (
                <Image
                  source={selected.icon}
                  style={{ width: '100%', height: '100%', borderRadius: 60 }}
                  resizeMode="cover"
                />
              )}
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
