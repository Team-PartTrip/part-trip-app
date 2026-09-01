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
import { toImageUrl } from '../../shared/api/image';

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

interface MainViewProps {
  /** 알림 화면이 생기면 연결한다. 없으면 배지만 보여준다. */
  onOpenNotifications?: () => void;
  /** 축제 · 이벤트 캘린더 (Func-002-03) */
  onOpenEvents?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenNotifications,
  onOpenEvents,
}) => {
  const [loading, setLoading] = useState(true);
  const [dday, setDday] = useState<DdayInfo | null>(null);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [unread, setUnread] = useState(0);
  // 조회가 실패한 것과 일정이 없는 것은 다르다. 같은 화면을 보여주면
  // 서버가 죽어도 "쉬는 중" 으로 읽힌다.
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        setFailed(false);
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
            setFailed(true);
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
          {/* 여행지 · 기간은 플래너(Func-005)에서만 정한다 */}
          <Text style={s.emptyText}>
            {failed
              ? '여행 정보를 불러오지 못했어요\n잠시 후 다시 시도해주세요'
              : '쉬는 중\n플래너에서 여행을 만들면 D-day 를 보여드려요'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nights = formatNights(dday.startDate, dday.endDate);

  return (
    <View style={s.safeArea}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <View style={s.headerTop}>
            {/* 헤더가 파란 배경이라 흰색 로고를 쓴다 */}
            <Image
              source={require('../../shared/assets/images/logo-white.png')}
              style={s.brand}
              resizeMode="contain"
              accessibilityRole="image"
              accessibilityLabel="PartTrip"
            />
            <View style={s.headerActions}>
              <TouchableOpacity
                style={s.circleBtn}
                activeOpacity={0.85}
                disabled={!onOpenNotifications}
                onPress={onOpenNotifications}
              >
                <Text style={s.circleEmoji}>🔔</Text>
                {unread > 0 && <View style={s.badge} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Func-002-01 은 D-day 를 보여주기만 한다. 누르는 동작은 없다 */}
          <View>
            <Text style={s.eyebrow}>다가오는 여행</Text>
            <Text style={s.dday}>{dday.dday}</Text>
            <Text style={s.tripTitle}>
              {nights ? `${dday.cityName} · ${nights}` : dday.cityName}
            </Text>
            <Text style={s.tripMeta}>
              {formatRange(dday.startDate, dday.endDate)}
              {dday.headcount ? ` · ${dday.headcount}명` : ''}
            </Text>
          </View>
        </SafeAreaView>

        {/* 축제 · 이벤트 캘린더 (Func-002-03) — 메인에서 들어갈 유일한 입구 */}
        <TouchableOpacity
          style={s.eventRow}
          activeOpacity={0.85}
          disabled={!onOpenEvents}
          onPress={onOpenEvents}
        >
          <View style={s.eventIcon}>
            <Text style={s.eventEmoji}>🎉</Text>
          </View>
          <View style={s.eventBody}>
            <Text style={s.eventTitle}>축제 · 이벤트 캘린더</Text>
            <Text style={s.eventSub}>
              {dday.countryName ?? '여행지'}의 이번 달 일정
            </Text>
          </View>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>

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
            </View>
          ) : (
            <View style={s.placeList}>
              {places.slice(0, 4).map((p, i) => (
                <View key={`${p.placeName}-${i}`} style={s.placeCard}>
                  {p.imageUrl ? (
                    <Image
                      source={{ uri: toImageUrl(p.imageUrl) }}
                      style={s.placeThumb}
                    />
                  ) : (
                    <View style={s.placeThumb} />
                  )}
                  <View style={s.placeInfo}>
                    <Text style={s.placeName} numberOfLines={1}>
                      {p.placeName}
                    </Text>
                    {/* 카테고리·주소는 없는 장소가 많다. 없으면 줄 자체를 빼서
                        빈 칸이 남지 않게 한다. */}
                    {!!(p.category || p.address) && (
                      <Text style={s.placeSub} numberOfLines={1}>
                        {[p.category, p.address].filter(Boolean).join(' · ')}
                      </Text>
                    )}
                  </View>
                  {p.rating !== null && (
                    <Text style={s.placeRating}>★ {p.rating.toFixed(1)}</Text>
                  )}
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
