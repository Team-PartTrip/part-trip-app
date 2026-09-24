import React, { useCallback, useState } from 'react';
import { touch48 } from '../../shared/ui/hitSlop';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
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
import { KOREA } from '../../entities/region/regions';
import type { SchedulePlace, ScheduleSlot } from '../../entities/planner/api';
import { toImageUrl } from '../../shared/api/image';
import { BellIcon, CalendarIcon } from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';
import DandiWordmark from '../../shared/ui/DandiWordmark';
import { StarIcon } from '../../shared/ui/icons';

/**
 * 추천 목록.
 *
 * 서버는 평점 내림차순으로 준다. 그대로 앞에서 자르면 평점이 같은
 * 한 카테고리가 자리를 다 차지한다 — 오사카에서 액티비티 네 개가 나왔다.
 * 카테고리마다 1등을 먼저 뽑아 골고루 보이게 하고, 그래도 자리가 남으면
 * 남은 것에서 평점순으로 채운다.
 */
function pickRecommendations(places: TourPlace[], count: number): TourPlace[] {
  const picked: TourPlace[] = [];
  const seen = new Set<string>();

  for (const place of places) {
    const key = place.category ?? '';
    if (picked.length >= count) {
      break;
    }
    if (!seen.has(key)) {
      seen.add(key);
      picked.push(place);
    }
  }

  for (const place of places) {
    if (picked.length >= count) {
      break;
    }
    if (!picked.includes(place)) {
      picked.push(place);
    }
  }
  return picked;
}

/**
 * 상단에 깔 여행지 대표 사진.
 *
 * 나라별 이미지를 따로 두지 않는다. 추천 목록을 이미 받아오므로 그 중
 * 명소 사진을 쓴다. 명소에 사진이 없으면 아무 장소나 쓰고, 그것도 없으면
 * null 을 돌려 지금처럼 파란 배경만 남긴다.
 */
function heroImageOf(places: TourPlace[]): string | null {
  const withImage = places.filter(place => place.imageUrl);
  const picked =
    withImage.find(place => place.category === '명소') ?? withImage[0];
  return picked?.imageUrl ? toImageUrl(picked.imageUrl) : null;
}

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
  /** 추천 장소를 누르면 상세로 */
  onOpenPlace?: (place: TourPlace) => void;
}

/** 날짜가 모두 있는 여행 일정 (NO_TRIP 응답을 걸러낸 뒤의 모습) */
type TripDday = DdayInfo & {
  startDate: string;
  endDate: string;
};

/** 오늘 카드 중 장소를 정한 것만. 빈 칸은 갈 곳이 아니다 */
export function todayPlaces(
  slots: DdayInfo['todaySchedule'],
): (ScheduleSlot & { place: SchedulePlace })[] {
  return (slots ?? []).filter(
    (slot): slot is ScheduleSlot & { place: SchedulePlace } => !!slot.place,
  );
}

export function hasTrip(dday: DdayInfo | null): dday is TripDday {
  if (!dday || !dday.startDate || !dday.endDate) {
    return false;
  }
  if (!dday.status) {
    return true;
  }
  return dday.status !== 'NO_TRIP' && dday.status !== 'ENDED';
}

const MainView: React.FC<MainViewProps> = ({
  onOpenNotifications,
  onOpenEvents,
  onOpenPlace,
}) => {
  const [loading, setLoading] = useState(true);
  const [dday, setDday] = useState<DdayInfo | null>(null);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [unread, setUnread] = useState(0);
  // 조회가 실패한 것과 일정이 없는 것은 다르다. 같은 화면을 보여주면
  // 서버가 죽어도 여행이 없는 것으로 읽힌다.
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

          // 일정이 없으면 도시도 null 이라 추천 장소를 물어볼 게 없다
          if (!d.cityName) {
            return;
          }
          // 도시를 안 넘기면 나라 전체에서 뽑혀, 강릉 여행에 부산 장소가
          // 섞여 나온다.
          const tour = await getTourPlaces(KOREA, {
            cityName: d.cityName ?? undefined,
          }).catch(() => []);
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

  const hero = heroImageOf(places);
  const recommended = pickRecommendations(places, 4);

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  // 서버는 일정이 없을 때도 200 으로 status 'NO_TRIP' 을 준다.
  if (!hasTrip(dday)) {
    return (
      <SafeAreaView style={s.safeArea} edges={['top']}>
        <View style={s.empty}>
          {/* 여행지 · 기간은 플래너(Func-005)에서만 정한다 */}
          <Text style={s.emptyText}>
            {failed
              ? '여행 정보를 불러오지 못했어요\n잠시 후 다시 시도해주세요'
              : '다음 여행이 아직 없어요\n플래너에서 여행을 만들어보세요'}
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
        <ImageBackground
          source={hero ? { uri: hero } : undefined}
          style={s.headerImage}
          imageStyle={s.headerImageInner}
        >
          {/* 사진 위에서도 흰 글씨가 읽히게 어둡게 덮는다 */}
          {!!hero && <View style={s.headerScrim} />}
          <SafeAreaView edges={['top']} style={s.header}>
            <View style={s.headerTop}>
              {/* 헤더가 파란 배경이라 흰색 로고를 쓴다 */}
              <DandiWordmark
                height={26}
                color={colors.textOnPrimary as string}
              />
              <View style={s.headerActions}>
                <TouchableOpacity
                  hitSlop={touch48(32)}
                  style={s.circleBtn}
                  activeOpacity={0.85}
                  disabled={!onOpenNotifications}
                  onPress={onOpenNotifications}
                  // 아이콘만 있는 버튼이라 읽어줄 글자가 없다
                  accessibilityRole="button"
                  accessibilityLabel={unread > 0 ? `알림 ${unread}건` : '알림'}
                >
                  <BellIcon size={17} color={colors.primary} />
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
        </ImageBackground>

        {/* 여행 중에는 오늘 갈 곳이 가장 먼저다 (Func-002-02) */}
        {dday.status === 'DURING' && (
          <View style={s.today}>
            <Text style={s.todayTitle}>오늘 갈 곳</Text>
            {todayPlaces(dday.todaySchedule).length === 0 ? (
              <Text style={s.todayEmpty}>오늘은 정해진 일정이 없어요</Text>
            ) : (
              todayPlaces(dday.todaySchedule).map((slot, i) => (
                <View key={slot.slotId} style={s.todayRow}>
                  <View style={s.todayNum}>
                    <Text style={s.todayNumText}>{i + 1}</Text>
                  </View>
                  <View style={s.todayBody}>
                    <Text style={s.todayName}>{slot.place.name}</Text>
                    {!!slot.place.categoryLabel && (
                      <Text style={s.todaySub}>{slot.place.categoryLabel}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* 축제 · 이벤트 캘린더 (Func-002-03) — 메인에서 들어갈 유일한 입구 */}
        <TouchableOpacity
          style={s.eventRow}
          activeOpacity={0.85}
          disabled={!onOpenEvents}
          onPress={onOpenEvents}
        >
          <View style={s.eventIcon}>
            <CalendarIcon size={22} color={colors.primary} />
          </View>
          <View style={s.eventBody}>
            <Text style={s.eventTitle}>축제 · 이벤트 캘린더</Text>
            <Text style={s.eventSub}>이번 달 국내 축제</Text>
          </View>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>

        <View style={s.section}>
          <Text style={s.sectionTitle}>이번 주 추천</Text>

          {places.length === 0 ? (
            // 관광지 데이터가 없는 나라도 많다. 빈 화면 대신 이유를 알려준다.
            <View style={s.noPlaces}>
              <Text style={s.noPlacesText}>
                아직 {dday.cityName} 추천 장소가 없어요
              </Text>
              <Text style={s.noPlacesDesc}>
                추천 장소가 준비된 여행지를 고르면{'\n'}가볼 만한 곳을 모아서
                보여드려요.
              </Text>
            </View>
          ) : (
            <View style={s.placeList}>
              {recommended.map(p => (
                <TouchableOpacity
                  key={String(p.tourPlaceId)}
                  style={s.placeCard}
                  activeOpacity={0.85}
                  disabled={!onOpenPlace}
                  onPress={() => onOpenPlace?.(p)}
                >
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
                    <View style={s.placeRatingRow}>
                      <StarIcon size={12} color={colors.textSecondary} />
                      <Text style={s.placeRating}>{p.rating.toFixed(1)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MainView;
