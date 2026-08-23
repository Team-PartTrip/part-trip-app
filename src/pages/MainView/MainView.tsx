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
  onOpenDestination?: () => void;
  /** 알림 화면이 생기면 연결한다. 없으면 배지만 보여준다. */
  onOpenNotifications?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenDestination,
  onOpenNotifications,
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

  if (!dday) {
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
            </View>
          </View>

          <Text style={s.eyebrow}>다가오는 여행</Text>
          <Text style={s.dday}>{dday.dday}</Text>
          <Text style={s.tripTitle}>
            {nights ? `${dday.cityName} · ${nights}` : dday.cityName}
          </Text>
          <Text style={s.tripMeta}>
            {formatRange(dday.startDate, dday.endDate)}
          </Text>

          {/* 준비 진행률 · 항공/숙소/일정 상태 · 여행 준비 목록은
              플래너 API(#65)가 생기면 여기에 붙는다. 값이 없는 동안에는
              가짜 수치를 보여주지 않고 섹션 자체를 그리지 않는다. */}
        </SafeAreaView>

        {places.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>이번 주 추천</Text>
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
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MainView;
