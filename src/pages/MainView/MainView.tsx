import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { mainStyles as s } from './MainView.styles';
import {
  getDday,
  getTourPlaces,
  DdayInfo,
  TourPlace,
} from '../../entities/main/api';
import { getUnreadCount } from '../../entities/notification/api';
import {
  PREP_STATUS_LABEL,
  PrepStatus,
  SAMPLE_READINESS,
} from '../../entities/main/readiness';
import { toImageUrl } from '../../shared/api/image';
import colors from '../../shared/tokens/colors';

// "2026-08-23" + "2026-08-27" → "2026.08.23 – 08.27"
// 해가 바뀌면 끝 날짜에도 연도를 남긴다 → "2026.06.10 – 2027.03.27"
function formatRange(start: string, end: string): string {
  const from = start.split('-');
  const to = end.split('-');
  const sameYear = from[0] === to[0];
  return `${from.join('.')} – ${(sameYear ? to.slice(1) : to).join('.')}`;
}

// "3박 4일"
function formatNights(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms)) {
    return '';
  }
  const nights = Math.max(0, Math.round(ms / 86_400_000));
  return `${nights}박 ${nights + 1}일`;
}

// 확정은 초록, 투표 중은 주황, 미정은 흐리게 — 상태를 색으로도 구분한다
const STATUS_COLOR: Record<PrepStatus, string> = {
  CONFIRMED: colors.success,
  VOTING: colors.accent,
  TODO: colors.textSub,
};

interface MainViewProps {
  onOpenDestination?: () => void;
  /** 알림 화면이 생기면 연결한다. 없으면 배지만 보여준다. */
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  /** "플래너에서 투표 이어가기" 행 */
  onOpenPlanner?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenDestination,
  onOpenNotifications,
  onOpenProfile,
  onOpenPlanner,
}) => {
  const [loading, setLoading] = useState(true);
  const [dday, setDday] = useState<DdayInfo | null>(null);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [unread, setUnread] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const [d, count] = await Promise.all([
            getDday(),
            getUnreadCount()
              .then(r => r.unreadCount)
              .catch(() => 0),
          ]);
          if (!alive) {
            return;
          }
          setDday(d);
          setUnread(count);

          // 일정이 없으면 countryName 도 null 이라 추천 장소를 물어볼 게 없다
          if (!d.countryName) {
            return;
          }
          const tour = await getTourPlaces(d.countryName).catch(() => []);
          if (alive) {
            setPlaces(tour);
          }
        } catch {
          if (alive) {
            setDday(null);
          }
        } finally {
          if (alive) {
            setLoading(false);
          }
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  // 서버는 일정이 없을 때도 200 으로 "쉬는 중" 을 주는데, 그때는 날짜가 null 이다.
  // 날짜가 없으면 D-Day 를 그릴 수 없으니 일정 없음 화면과 똑같이 다룬다.
  if (!dday || !dday.startDate || !dday.endDate) {
    return (
      <SafeAreaView style={s.safeArea} edges={['top']}>
        <View style={s.empty}>
          <Text style={s.emptyText}>
            아직 등록된 여행 일정이 없어요{'\n'}여행지를 선택해보세요
          </Text>
          <TouchableOpacity
            style={s.emptyBtn}
            activeOpacity={0.85}
            onPress={onOpenDestination}
          >
            <Text style={s.emptyBtnText}>여행지 선택하러 가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const nights = formatNights(dday.startDate, dday.endDate);
  const prep = SAMPLE_READINESS;

  return (
    <View style={s.safeArea}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.brand}>PartTrip</Text>
            <View style={s.headerActions}>
              <TouchableOpacity
                style={s.circleBtn}
                activeOpacity={0.85}
                disabled={!onOpenNotifications}
                onPress={onOpenNotifications}
              >
                <Image
                  source={require('../../shared/assets/images/tab-planner.png')}
                  resizeMode="contain"
                  style={s.circleIcon}
                />
                {unread > 0 && <View style={s.badge} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={s.circleBtn}
                activeOpacity={0.85}
                disabled={!onOpenProfile}
                onPress={onOpenProfile}
              >
                <Image
                  source={require('../../shared/assets/images/tab-profile.png')}
                  resizeMode="contain"
                  style={s.circleIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={s.eyebrow}>다가오는 여행</Text>
          <Text style={s.dday}>{dday.dday}</Text>
          <Text style={s.tripTitle}>
            {nights ? `${dday.cityName} · ${nights}` : dday.cityName}
          </Text>
          <Text style={s.tripMeta}>
            {formatRange(dday.startDate, dday.endDate)}
            {dday.headcount ? ` · ${dday.headcount}명` : ''}
          </Text>

          {/* 준비 진행률 — 플래너 API(#65) 전까지는 예시 값이다 */}
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${prep.percent}%` }]} />
          </View>
          <Text style={s.progressLabel}>준비 {prep.percent}% 완료</Text>
        </SafeAreaView>

        {/* 항공 / 숙소 / 일정 — 파란 헤더에 절반쯤 걸쳐 놓인다 */}
        <View style={s.statusCard}>
          {[
            { label: '항공', status: prep.flight },
            { label: '숙소', status: prep.accommodation },
            { label: '일정', status: prep.schedule },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={s.statusDivider} />}
              <View style={s.statusCol}>
                <Text style={s.statusLabel}>{item.label}</Text>
                <Text
                  style={[s.statusValue, { color: STATUS_COLOR[item.status] }]}
                >
                  {PREP_STATUS_LABEL[item.status]}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>여행 준비</Text>

          <TouchableOpacity
            style={s.prepRow}
            activeOpacity={0.85}
            disabled={!onOpenPlanner}
            onPress={onOpenPlanner}
          >
            <View style={s.prepIcon} />
            <View style={s.prepBody}>
              <Text style={s.prepTitle}>플래너에서 투표 이어가기</Text>
              <Text style={[s.prepSub, { color: colors.accent }]}>
                {prep.pendingVotes}건 대기 중
              </Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>

          <View style={s.prepRow}>
            <View style={s.prepIcon} />
            <View style={s.prepBody}>
              <Text style={s.prepTitle}>체크리스트 작성</Text>
              <Text style={[s.prepSub, { color: colors.textSub }]}>
                {prep.checklistTotal}개 중 {prep.checklistDone}개 완료
              </Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>이번 주 추천</Text>

          {places.length === 0 ? (
            // 관광지 데이터가 없는 나라도 많다. 빈 화면 대신 이유를 알려준다.
            <View style={s.noPlaces}>
              <Text style={s.noPlacesText}>
                아직 {dday.countryName} 추천 장소가 없어요
              </Text>
              <Text style={s.noPlacesDesc}>
                추천 장소가 준비된 여행지를 고르면{'\n'}가볼 만한 곳을 모아서 보여드려요.
              </Text>
              <TouchableOpacity
                style={s.noPlacesBtn}
                activeOpacity={0.85}
                onPress={onOpenDestination}
              >
                <Text style={s.noPlacesBtnText}>여행지 바꾸기</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.placeRow}>
              {places.slice(0, 3).map((p, i) => (
                <View key={`${p.placeName}-${i}`} style={s.placeCard}>
                  {p.imageUrl ? (
                    <Image
                      source={{ uri: toImageUrl(p.imageUrl) }}
                      style={s.placeThumb}
                    />
                  ) : (
                    <View style={s.placeThumb} />
                  )}
                  <Text style={s.placeName} numberOfLines={1}>
                    {p.placeName}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MainView;
