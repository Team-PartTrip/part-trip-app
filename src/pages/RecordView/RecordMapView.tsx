import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { recordMapStyles as s } from './RecordMapView.styles';
import {
  getTripCard,
  getTripCards,
  placeOf,
  TimelineItem,
  TripCardSummary,
} from '../../entities/record/api';
import MapView, { Marker } from 'react-native-maps';
import { formatShortDate } from '../../entities/record/types';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PinIcon,
} from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';

/** 지도에 찍을 한 지점 */
interface Spot {
  key: string;
  entryId: number | null;
  title: string;
  subtitle: string;
  date: string;
  latitude: number;
  longitude: number;
}

/** 좌표가 있는 타임라인 항목만 지도에 찍는다 */
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

const KOREA_REGION = {
  latitude: 36.3,
  longitude: 127.8,
  latitudeDelta: 6.5,
  longitudeDelta: 5,
};

interface Props {
  tripCardId: number;
  onBack?: () => void;
  /** 촬영 위치를 눌러 그 사진을 본다 (D3) */
  onOpenSpot?: (spot: { tripCardId: number; entryId: number | null }) => void;
}

const RecordMapView: React.FC<Props> = ({ tripCardId, onBack, onOpenSpot }) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const mapRef = useRef<MapView>(null);
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
      Promise.all([getTripCard(tripCardId), getTripCards()])
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
  const SHEET_MIN = 96 + insets.bottom;
  const SHEET_FULL = Math.max(SHEET_MIN, windowHeight - insets.top - 64);
  const SHEET_COLLAPSED = Math.min(SHEET_PEEK, SHEET_FULL);
  const snaps = useMemo(
    () => [SHEET_MIN, SHEET_COLLAPSED, SHEET_FULL],
    [SHEET_MIN, SHEET_COLLAPSED, SHEET_FULL],
  );
  const sheetHeight = useRef(new Animated.Value(SHEET_COLLAPSED)).current;
  const startHeight = useRef(SHEET_COLLAPSED);

  const clampSheetHeight = useCallback(
    (height: number) => Math.min(SHEET_FULL, Math.max(SHEET_MIN, height)),
    [SHEET_MIN, SHEET_FULL],
  );

  useEffect(() => {
    sheetHeight.stopAnimation(current => {
      const next = clampSheetHeight(current);
      startHeight.current = next;
      sheetHeight.setValue(next);
    });
  }, [clampSheetHeight, sheetHeight]);

  const settle = useCallback(
    (height: number, velocity: number) => {
      // 빠르게 튕기면 그 방향의 다음 칸으로, 아니면 가까운 칸으로 붙인다
      let target = snaps.reduce((a, b) =>
        Math.abs(b - height) < Math.abs(a - height) ? b : a,
      );
      if (velocity < -0.5) {
        target = snaps.find(v => v > height) ?? SHEET_FULL;
      } else if (velocity > 0.5) {
        target = [...snaps].reverse().find(v => v < height) ?? SHEET_MIN;
      }
      startHeight.current = target;
      Animated.spring(sheetHeight, {
        toValue: target,
        useNativeDriver: false,
        bounciness: 0,
      }).start();
    },
    [snaps, SHEET_FULL, SHEET_MIN, sheetHeight],
  );

  const drag = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          sheetHeight.stopAnimation(current => {
            const next = clampSheetHeight(current);
            startHeight.current = next;
            sheetHeight.setValue(next);
          });
        },
        onPanResponderMove: (_, g) => {
          const next = clampSheetHeight(startHeight.current - g.dy);
          sheetHeight.setValue(next);
        },
        onPanResponderRelease: (_, g) => {
          const next = clampSheetHeight(startHeight.current - g.dy);
          settle(next, g.vy);
        },
        onPanResponderTerminate: (_, g) => {
          const next = clampSheetHeight(startHeight.current - g.dy);
          settle(next, g.vy);
        },
      }),
    [clampSheetHeight, settle, sheetHeight],
  );

  const spots = useMemo(() => toSpots(timeline), [timeline]);
  const mapPadding = useMemo(
    () => ({ top: insets.top + 64, right: 24, bottom: SHEET_COLLAPSED, left: 24 }),
    [insets.top, SHEET_COLLAPSED],
  );
  const fitSpots = useCallback(() => {
    if (spots.length === 0) {
      return;
    }
    mapRef.current?.fitToCoordinates(spots, {
      edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
      animated: false,
    });
  }, [spots]);
  useEffect(fitSpots, [fitSpots]);
  const place = card ? placeOf(card, ' · ') : '여행';

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
              onPress={() =>
                onOpenSpot?.({ tripCardId, entryId: spot.entryId })
              }
            >
              <View style={s.thumb}>
                <PinIcon size={20} color={colors.primary} />
              </View>
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{spot.title}</Text>
                <Text style={s.rowMeta}>
                  {spot.subtitle} · {formatShortDate(spot.date)}
                </Text>
              </View>
              <View style={s.chevron}>
                <ChevronRightIcon size={16} color={colors.textTertiary} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </>
  );

  return (
    <View style={s.safeArea}>
      <View style={s.map}>
        <MapView
          ref={mapRef}
          style={s.mapView}
          initialRegion={KOREA_REGION}
          mapPadding={mapPadding}
          onMapReady={fitSpots}
          toolbarEnabled={false}
        >
          {spots.map(spot => (
            <Marker
              key={spot.key}
              coordinate={spot}
              title={spot.title}
              description={formatShortDate(spot.date)}
              pinColor={colors.primary as string}
              onCalloutPress={() =>
                onOpenSpot?.({ tripCardId, entryId: spot.entryId })
              }
            />
          ))}
        </MapView>

        <View style={[s.topBar, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <View style={s.circleBtnText}>
              <ChevronLeftIcon size={18} color={colors.text} />
            </View>
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
