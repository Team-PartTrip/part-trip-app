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
import { RegionShapeSvg } from '../RegionMapView/KoreaMapSvg';
import { getRegionMap, VisitedRegion } from '../../entities/region/api';
import { profileStyles as s } from './ProfileView.styles';
import {
  deleteAccount,
  getMyProfile,
  getProfileStats,
  ProfileStats,
  UserProfile,
} from '../../entities/profile/api';
import { logout } from '../../entities/auth/api';
import { getRefreshToken, clearTokens } from '../../shared/api/tokenStorage';
import { toImageUrl } from '../../shared/api/image';
import { BellIcon } from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';

// 세계지도 미리보기 칸 수 (피그마 E1 은 6칸)
const MAP_CELLS = 6;
// mapCell 스타일의 width·height 와 같아야 한다
const MAP_CELL_SIZE = 46;

interface Props {
  onEdit?: () => void;
  /** 상단 종 버튼 — 알림 목록 */
  onOpenNotifications?: () => void;
  onLogout?: () => void;
  onOpenRegionMap?: () => void;
  /** 가족 연결 (보호자, Func-012) */
  onOpenGuardian?: () => void;
  onOpenTravelPreference?: () => void;
}

const ProfileView: React.FC<Props> = ({
  onEdit,
  onOpenNotifications,
  onLogout,
  onOpenRegionMap,
  onOpenGuardian,
  onOpenTravelPreference,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [visited, setVisited] = useState<VisitedRegion[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getMyProfile()
        .then(setProfile)
        .catch(() => setProfile(null));
      // 통계는 못 받아와도 화면 나머지는 그대로 보여준다
      getProfileStats()
        .then(setStats)
        .catch(() => setStats(null));
      // 미리보기 칸에 채울 시·도
      getRegionMap()
        .then(map => {
          if (alive) {
            setVisited(map.visited);
          }
        })
        .catch(() => {
          if (alive) {
            setVisited([]);
          }
        });
      return () => {
        alive = false;
      };
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

  const handleDeleteAccount = () => {
    Alert.alert(
      '회원 탈퇴',
      '여행 계획, 여행카드, 사진이 모두 지워지고 되살릴 수 없어요. 함께 가는 여행은 다른 일행에게 넘어가요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
            } catch (e: any) {
              Alert.alert(
                '탈퇴하지 못했어요',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
              return;
            }
            await clearTokens();
            onLogout?.();
          },
        },
      ],
    );
  };

  // 아직 화면이 없는 항목은 조용히 무반응으로 두지 않고 준비 중임을 알린다
  const notReady = (what: string) =>
    Alert.alert('준비 중', `${what} 화면은 아직 준비 중이에요.`);

  const initial = profile?.nickName?.trim().charAt(0) ?? '';

  // 값을 못 받았을 때 0 으로 단정하지 않고 "-" 로 둔다
  const statText = (n: number | undefined) =>
    n === undefined ? '-' : String(n);

  const regionCount = stats?.regionCount ?? null;

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
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
              <BellIcon size={18} color={colors.primary} />
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

            <TouchableOpacity
              style={s.editBtn}
              activeOpacity={0.85}
              onPress={onEdit}
            >
              <Text style={s.editBtnText}>프로필 수정</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={s.statsCard}>
          {[
            { value: statText(stats?.tripCount), label: '여행' },
            { value: statText(stats?.regionCount), label: '지역' },
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
          <Text style={s.sectionTitle}>내가 다녀온 곳</Text>
          <View style={s.mapCard}>
            <View style={s.mapGrid}>
              {/* 다녀온 시·도를 앞에서부터 채우고, 남는 칸은 비워 둔다.
                  칸이 다 비어 있으면 지도가 고장 난 것처럼 보인다. */}
              {Array.from({ length: MAP_CELLS }).map((_, i) => {
                const region = visited[i];
                return (
                  <View key={i} style={s.mapCell}>
                    {region ? (
                      <RegionShapeSvg
                        code={region.regionCode}
                        size={MAP_CELL_SIZE}
                      />
                    ) : null}
                  </View>
                );
              })}
            </View>
            <View style={s.mapFooter}>
              <Text style={s.mapSummary}>
                {regionCount === null
                  ? '지역 정보를 불러오지 못했어요'
                  : regionCount === 0
                  ? '아직 다녀온 곳이 없어요'
                  : `시·도 ${regionCount}곳을 다녀왔어요`}
              </Text>
              <TouchableOpacity
                style={s.moreBtn}
                activeOpacity={0.85}
                onPress={onOpenRegionMap ?? (() => notReady('내가 다녀온 곳'))}
              >
                <Text style={s.moreBtnText}>더보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>설정</Text>

          {/* 여행 타입 · 계정 보안은 뺐다. 프로필 수정은 위 버튼으로 간다 */}
          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={onOpenGuardian}
          >
            <Text style={s.settingsRowText}>가족 연결 (보호자)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={onOpenTravelPreference}
          >
            <Text style={s.settingsRowText}>여행 편의 설정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <Text style={[s.settingsRowText, s.settingsRowDanger]}>
              로그아웃
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.settingsRow}
            activeOpacity={0.85}
            accessibilityRole="button"
            onPress={handleDeleteAccount}
          >
            <Text style={s.settingsRowMuted}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileView;
