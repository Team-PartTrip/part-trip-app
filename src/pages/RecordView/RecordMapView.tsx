import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { recordMapStyles as s } from './RecordMapView.styles';
import {
  getTripCard,
  getTripCards,
  TimelineItem,
  TripCardSummary,
} from '../../entities/record/api';
import { formatShortDate } from '../../entities/record/types';

/** 지도에 찍을 한 지점. 지도 SDK 가 없어서 위·경도를 0~1 비율로 바꿔 쓴다 */
interface Spot {
  key: string;
  entryId: number | null;
  title: string;
  subtitle: string;
  date: string;
  x: number;
  y: number;
}

// 핀이 화면 가장자리에 붙지 않도록 남기는 여백
const PAD = 0.12;

/** 좌표가 있는 타임라인 항목을 지도 위 비율 좌표로 바꾼다 */
function toSpots(timeline: TimelineItem[]): Spot[] {
  const located = timeline.filter(
    item => item.latitude != null && item.longitude != null,
  );
  if (located.length === 0) {
    return [];
  }
  const lats = located.map(item => item.latitude as number);
  const lngs = located.map(item => item.longitude as number);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // 한 곳에서만 찍었으면 폭이 0이라 나눌 수 없다. 그럴 땐 가운데 둔다.
  const ratio = (value: number, min: number, max: number) =>
    max - min < 1e-9 ? 0.5 : PAD + ((value - min) / (max - min)) * (1 - PAD * 2);

  return located.map((item, index) => ({
    key: `${item.type}-${item.entryId ?? index}`,
    entryId: item.entryId,
    title:
      item.type === 'PLACE'
        ? item.placeName ?? '방문 장소'
        : item.comment ?? '사진',
    subtitle: item.type === 'PLACE' ? item.address ?? '' : '내가 찍은 사진',
    date: item.date,
    x: ratio(item.longitude as number, minLng, maxLng),
    // 위도는 클수록 북쪽이라 화면에서는 위로 간다
    y: 1 - ratio(item.latitude as number, minLat, maxLat),
  }));
}

const GRID_ROWS = [70, 140, 210, 280, 350, 420, 490];
const GRID_COLS = [60, 130, 200, 270, 340];

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
  const [mode, setMode] = useState<'map' | 'list'>('map');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
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

  const spots = useMemo(() => toSpots(timeline), [timeline]);
  const place = card ? `${card.countryName} · ${card.cityName}` : '여행';


  const list = (
    <>
      <View style={s.sheetHead}>
        <Text style={s.sheetTitle}>촬영 위치 {spots.length}곳</Text>
        <TouchableOpacity hitSlop={8} onPress={() => setMode('map')}>
          <Text style={[s.toggle, mode === 'map' ? s.toggleOn : s.toggleOff]}>
            지도
          </Text>
        </TouchableOpacity>
        <TouchableOpacity hitSlop={8} onPress={() => setMode('list')}>
          <Text style={[s.toggle, mode === 'list' ? s.toggleOn : s.toggleOff]}>
            목록
          </Text>
        </TouchableOpacity>
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

  if (mode === 'list') {
    return (
      <SafeAreaView edges={['top']} style={s.safeArea}>
        <View style={s.listHeader}>
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
        </View>
        <View style={[s.sheet, s.sheetFull]}>{list}</View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.safeArea}>
      <View style={s.map}>
        {GRID_ROWS.map(top => (
          <View
            key={`r${top}`}
            style={[s.gridLine, s.gridRow, { top }]}
          />
        ))}
        {GRID_COLS.map(left => (
          <View
            key={`c${left}`}
            style={[s.gridLine, s.gridCol, { left }]}
          />
        ))}
        <View style={s.landmass} />

        {spots.map((spot, i) => (
          <TouchableOpacity
            key={spot.key}
            style={[
              s.pin,
              { left: `${spot.x * 100}%`, top: `${spot.y * 100}%` },
            ]}
            activeOpacity={0.85}
            onPress={() => onOpenSpot?.({ tripCardId, entryId: spot.entryId })}
          >
            <Text style={s.pinText}>{i + 1}</Text>
          </TouchableOpacity>
        ))}

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

      <View style={[s.sheet, s.sheetPeek]}>
        <View style={s.handle} />
        {list}
      </View>
    </View>
  );
};

export default RecordMapView;
