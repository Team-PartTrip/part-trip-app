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
import { getMyProfile, UserProfile } from '../../entities/profile/api';
import { logout } from '../../entities/auth/api';
import { getRefreshToken, clearTokens } from '../../shared/api/tokenStorage';
import { toImageUrl } from '../../shared/api/image';
import { sampleSummary } from '../../entities/worldmap/sampleData';
import { flagOf } from '../../entities/worldmap/types';
import { sampleTripCards } from '../../entities/record/sampleData';

// 세계지도 미리보기 칸 수 (피그마 E1 은 6칸)
const MAP_CELLS = 6;

interface Props {
  onEdit?: () => void;
  /** 상단 종 버튼 — 알림 목록 */
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  onNotificationSettings?: () => void;
  onOpenWorldMap?: () => void;
}

const ProfileView: React.FC<Props> = ({
  onEdit,
  onOpenNotifications,
  onLogout,
  onNotificationSettings,
  onOpenWorldMap,
}) => {
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

  // 아직 화면이 없는 항목은 조용히 무반응으로 두지 않고 준비 중임을 알린다
  const notReady = (what: string) =>
    Alert.alert('준비 중', `${what} 화면은 아직 준비 중이에요.`);

  const initial = profile?.nickName?.trim().charAt(0) ?? '';

  // 여행 수·기록 수·획득 국가를 주는 API 가 아직 없어서 예시 데이터로 채운다
  const visitedCountries = sampleSummary.countries;
  const tripCount = sampleTripCards.length;
  const photoCount = sampleTripCards.reduce((sum, t) => sum + t.photoCount, 0);
  // "아시아 4 · 유럽 1" — 획득한 국가가 있는 대륙만 추린다
  const continentSummary = sampleSummary.continents
    .filter(c => c.visited > 0)
    .map(c => `${c.name} ${c.visited}`)
    .join(' · ');

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
              {!!profile?.themeName && (
                <View style={s.themeBadge}>
                  <Text style={s.themeBadgeText}>{profile.themeName}</Text>
                </View>
              )}
              <Text style={s.handle}>@{profile?.userId ?? ''}</Text>
            </View>

            <TouchableOpacity style={s.editBtn} activeOpacity={0.85} onPress={onEdit}>
              <Text style={s.editBtnText}>프로필 수정</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={s.statsCard}>
          {[
            { value: String(tripCount), label: '여행' },
            { value: String(visitedCountries.length), label: '국가' },
            { value: String(photoCount), label: '기록' },
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
              {Array.from({ length: MAP_CELLS }).map((_, i) => {
                const country = visitedCountries[i];
                return (
                  <View key={i} style={s.mapCell}>
                    {!!country && (
                      <Text style={s.mapCellFlag}>
                        {flagOf(country.countryCode)}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
            <View style={s.mapFooter}>
              <Text style={s.mapSummary}>
                {visitedCountries.length === 0
                  ? '아직 획득한 국가가 없어요'
                  : `${visitedCountries.length}개국 획득 · ${continentSummary}`}
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

          <TouchableOpacity style={s.settingsRow} activeOpacity={0.85} onPress={onEdit}>
            <Text style={s.settingsRowText}>여행 타입 수정</Text>
            <Text style={s.settingsRowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            onPress={onNotificationSettings}
          >
            <Text style={s.settingsRowText}>알림 설정</Text>
            <Text style={s.settingsRowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            onPress={() => notReady('계정 · 보안')}
          >
            <Text style={s.settingsRowText}>계정 · 보안</Text>
            <Text style={s.settingsRowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.settingsRow} activeOpacity={0.85} onPress={handleLogout}>
            <Text style={[s.settingsRowText, s.settingsRowDanger]}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileView;
