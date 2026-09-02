import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { recordMapStyles as s } from './RecordMapView.styles';
import {
  getTripCard,
  getTripCards,
  TimelineItem,
  TripCardSummary,
} from '../../entities/record/api';
import CountryTripMap from './CountryTripMap';
import { formatShortDate } from '../../entities/record/types';

/** 지도에 찍을 한 지점. 위·경도는 지도와 같은 투영을 태워야 해서 그대로 둔다 */
interface Spot {
  key: string;
  entryId: number | null;
  title: string;
  subtitle: string;
  date: string;
  latitude: number;
  longitude: number;
}

/** 좌표가 있는 타임라인 항목을 지도 위 비율 좌표로 바꾼다 */
function toSpots(timeline: TimelineItem[]): Spot[] {
  const located = timeline.filter(
    item => item.latitude != null && item.longitude != null,
  );
  if (located.length === 0) {
    return [];
  }
  return located.map((item, index) => ({
    key: `${item.type}-${item.entryId ?? index}`,
    entryId: item.entryId,
    title:
      item.type === 'PLACE'
        ? item.placeName ?? '방문 장소'
        : item.comment ?? '사진',
    subtitle: item.type === 'PLACE' ? item.address ?? '' : '내가 찍은 사진',
    date: item.date,
    latitude: item.latitude as number,
    longitude: item.longitude as number,
  }));
}


interface Props {
  tripCardId: number;
  onBack?: () => void;
  /** 촬영 위치를 눌러 그 사진을 본다 (D3) */
  onOpenSpot?: (spot: { tripCardId: number; entryId: number | null }) => void;
}

const RecordMapView: React.FC<Props> = ({
  tripCardId,
  onBack,
  onOpenSpot,
}) => {
  const insets = useSafeAreaInsets();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  // 지도를 그리려면 실제 픽셀 크기를 알아야 한다. 화면마다 다르다.
  const [mapSize, setMapSize] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [card, setCard] = useState<TripCardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  // 조회 실패와 데이터 없음은 다르다. 같은 문구를 쓰면 서버가 죽어도
  // 기록이 없는 것처럼 보인다.
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      setFailed(false);
      Promise.all([
        getTripCard(tripCardId),
        getTripCards().catch(() => [] as TripCardSummary[]),
      ])
        .then(([detail, cards]) => {
          if (!alive) {
            return;
          }
          setTimeline(detail.timeline ?? []);
          setCard(cards.find(item => item.cardId === tripCardId) ?? null);
        })
        .catch(() => {
          if (alive) {
            setTimeline([]);
            // tripCardId 가 바뀔 수 있는 화면이다. card 를 남기면 실패한
            // 화면이 이전 여행의 이름을 계속 보여준다.
            setCard(null);
            setFailed(true);
          }
        })
        .finally(() => {
          if (alive) {
            setLoading(false);
          }
        });
      return () => {
        alive = false;
      };
    }, [tripCardId]),
  );

  // ── 아래에서 끌어올리는 목록 ──
  //
  // 예전에는 '지도 / 목록' 을 눌러 화면을 통째로 바꿨다. 손잡이를 위아래로
  // 끌어 목록을 펼치고 접는 편이 지도를 보면서 쓰기 좋다.
  const SHEET_PEEK = 354;
  const SHEET_FULL = Dimensions.get('window').height - 120;
  // 위로 끌수록 값이 작아진다(높이가 커진다)
  const sheetHeight = useRef(new Animated.Value(SHEET_PEEK)).current;
  const startHeight = useRef(SHEET_PEEK);

  const settle = (height: number, velocity: number) => {
    // 빠르게 튕기면 그 방향으로, 아니면 가까운 쪽으로 붙인다
    const middle = (SHEET_PEEK + SHEET_FULL) / 2;
    const toFull =
      velocity < -0.5 ? true : velocity > 0.5 ? false : height > middle;
    const target = toFull ? SHEET_FULL : SHEET_PEEK;
    startHeight.current = target;
    Animated.spring(sheetHeight, {
      toValue: target,
      useNativeDriver: false,
      bounciness: 0,
    }).start();
  };

  const drag = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        const next = Math.min(
          SHEET_FULL,
          Math.max(SHEET_PEEK, startHeight.current - g.dy),
        );
        sheetHeight.setValue(next);
      },
      onPanResponderRelease: (_, g) => {
        const next = Math.min(
          SHEET_FULL,
          Math.max(SHEET_PEEK, startHeight.current - g.dy),
        );
        settle(next, g.vy);
      },
    }),
  ).current;

  const onMapLayout = (e: any) => {
    const { width, height } = e.nativeEvent.layout;
    setMapSize({ width, height });
  };

  const spots = useMemo(() => toSpots(timeline), [timeline]);
  const place = card ? `${card.countryName} · ${card.cityName}` : '여행';


  const list = (
    <>
      <View style={s.sheetHead}>
        <Text style={s.sheetTitle}>방문 장소 {spots.length}곳</Text>
      </View>

      <ScrollView
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator style={s.empty} />
        ) : spots.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>
              {failed
                ? '기록을 불러오지 못했어요'
                : '위치가 담긴 사진이 없어요'}
            </Text>
            <Text style={s.emptyDesc}>
              {failed
                ? '잠시 후 다시 시도해주세요.'
                : '위치 정보를 켜고 찍은 사진은 여기에 표시돼요.'}
            </Text>
          </View>
        ) : (
          spots.map(spot => (
            <TouchableOpacity
              key={spot.key}
              style={s.row}
              activeOpacity={0.85}
              onPress={() => onOpenSpot?.({ tripCardId, entryId: spot.entryId })}
            >
              <View style={s.thumb}>
                <Text style={s.thumbIcon}>📍</Text>
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{spot.title}</Text>
                <Text style={s.rowMeta}>
                  {spot.subtitle} · {formatShortDate(spot.date)}
                </Text>
              </View>
              <Text style={s.chevron}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );

  return (
    <View style={s.safeArea}>
      <View style={s.map} onLayout={onMapLayout}>
        {mapSize ? (
          <CountryTripMap
            countryName={card?.countryName}
            points={spots.map((spot, i) => ({
              key: spot.key,
              latitude: spot.latitude,
              longitude: spot.longitude,
              index: i,
            }))}
            width={mapSize.width}
            height={mapSize.height}
            onPressPoint={key => {
              const spot = spots.find(item => item.key === key);
              if (spot) {
                onOpenSpot?.({ tripCardId, entryId: spot.entryId });
              }
            }}
          />
        ) : null}

        <View style={[s.topBar, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <Text style={s.circleBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={s.placePill}>
            <Text style={s.placePillText}>{place}</Text>
          </View>
          <View style={s.topBarSpacer} />
        </View>
      </View>

      <Animated.View style={[s.sheet, { height: sheetHeight }]}>
        {/* 손잡이만 끌리게 한다. 목록 안에서 끌면 스크롤과 싸운다 */}
        <View {...drag.panHandlers} style={s.handleArea}>
          <View style={s.handle} />
        </View>
        {list}
      </Animated.View>
    </View>
  );
};

export default RecordMapView;
