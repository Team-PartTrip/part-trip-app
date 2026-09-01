import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { profileStyles as s } from './ProfileView.styles';
import {
  getMyProfile,
  getProfileStats,
  ProfileStats,
  UserProfile,
} from '../../entities/profile/api';
import { logout } from '../../entities/auth/api';
import { getRefreshToken, clearTokens } from '../../shared/api/tokenStorage';
import { toImageUrl } from '../../shared/api/image';

// 세계지도 미리보기 칸 수 (피그마 E1 은 6칸)
const MAP_CELLS = 6;

interface Props {
  onEdit?: () => void;
  /** 상단 종 버튼 — 알림 목록 */
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  onOpenWorldMap?: () => void;
}

const ProfileView: React.FC<Props> = ({
  onEdit,
  onOpenNotifications,
  onLogout,
  onOpenWorldMap,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then(setProfile)
        .catch(() => setProfile(null));
      // 통계는 못 받아와도 화면 나머지는 그대로 보여준다
      getProfileStats()
        .then(setStats)
        .catch(() => setStats(null));
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

  // 아직 화면이 없는 항목은 조용히 무반응으로 두지 않고 준비 중임을 알린다
  const notReady = (what: string) =>
    Alert.alert('준비 중', `${what} 화면은 아직 준비 중이에요.`);

  const initial = profile?.nickName?.trim().charAt(0) ?? '';

  // 값을 못 받았을 때 0 으로 단정하지 않고 "-" 로 둔다
  const statText = (n: number | undefined) =>
    n === undefined ? '-' : String(n);

  // 어느 나라를 갔는지 알려주는 API 가 아직 없다(server feat/67).
  // 예시 국기를 개수만큼 잘라 쓰면 가보지도 않은 나라 국기가 뜬다.
  // 그래서 국기는 안 그리고 통계 API 의 개수만 보여준다.
  const countryCount = stats?.countryCount ?? null;

  return (
    <View style={s.safeArea}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.headerTitle}>마이</Text>
            {/* 알림 목록. 아래 설정 목록의 "알림 설정" 과는 다른 화면이다 */}
            <TouchableOpacity
              style={s.headerCircle}
              activeOpacity={0.85}
              disabled={!onOpenNotifications}
              onPress={onOpenNotifications}
            >
              <Text style={s.headerCircleEmoji}>🔔</Text>
            </TouchableOpacity>
          </View>

          <View style={s.profileRow}>
            <View style={s.avatar}>
              {profile?.imgUrl ? (
                <Image
                  source={{ uri: toImageUrl(profile.imgUrl) }}
                  style={s.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={s.avatarInitial}>{initial}</Text>
              )}
            </View>

            <View style={s.profileInfo}>
              <Text style={s.nickname}>{profile?.nickName ?? '...'}</Text>
              <Text style={s.handle}>@{profile?.userId ?? ''}</Text>
            </View>

            <TouchableOpacity style={s.editBtn} activeOpacity={0.85} onPress={onEdit}>
              <Text style={s.editBtnText}>프로필 수정</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={s.statsCard}>
          {[
            { value: statText(stats?.tripCount), label: '여행' },
            { value: statText(stats?.countryCount), label: '국가' },
            { value: statText(stats?.recordCount), label: '기록' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <View style={s.statDivider} />}
              <View style={s.statCol}>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>내 세계지도</Text>
          <View style={s.mapCard}>
            <View style={s.mapGrid}>
              {Array.from({ length: MAP_CELLS }).map((_, i) => (
                <View key={i} style={s.mapCell} />
              ))}
            </View>
            <View style={s.mapFooter}>
              <Text style={s.mapSummary}>
                {countryCount === null
                  ? '국가 정보를 불러오지 못했어요'
                  : countryCount === 0
                  ? '아직 획득한 국가가 없어요'
                  : `${countryCount}개국 획득`}
              </Text>
              <TouchableOpacity
                style={s.moreBtn}
                activeOpacity={0.85}
                onPress={onOpenWorldMap ?? (() => notReady('세계지도'))}
              >
                <Text style={s.moreBtnText}>더보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>설정</Text>

          {/* 여행 타입 · 계정 보안은 뺐다. 프로필 수정은 위 버튼으로 간다 */}
          <TouchableOpacity style={s.settingsRow} activeOpacity={0.85} onPress={handleLogout}>
            <Text style={[s.settingsRowText, s.settingsRowDanger]}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileView;
