import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Text } from '../../shared/ui/Text';
import { planStatusStyles as s } from './PlanStatusView.styles';
import { touch48 } from '../../shared/ui/hitSlop';
import type {
  PlannerSchedule,
  RouteLeg,
  ScheduleSlot,
  SchedulePlace,
} from '../../entities/planner/api';
import { dayLabel } from '../../entities/planner/types';
import CategoryIcon from '../../entities/planner/CategoryIcon';
import colors from '../../shared/tokens/colors';
import {
  BedIcon,
  BusIcon,
  CarIcon,
  GripIcon,
  HomeIcon,
  PinIcon,
  TrainIcon,
  WalkIcon,
} from '../../shared/ui/icons';

function routeLines(route: RouteLeg): string[] {
  const total = route.durationMinutes ?? 0;
  if (route.transportMode !== 'PUBLIC_TRANSIT') {
    const how =
      route.transportMode === 'WALKING'
        ? '걸어서'
        : route.transportMode === 'TAXI'
        ? '택시로'
        : '자동차로';
    return [`${how} ${total}분`];
  }
  const rides = route.steps
    .filter(step => step.type === 'BUS' || step.type === 'SUBWAY')
    .map(step => {
      const kind = step.type === 'BUS' ? '버스' : '지하철';
      const stops = step.stopCount ? ` (${step.stopCount}정거장)` : '';
      return `${kind} ${step.name ?? ''} · ${step.boardingStop ?? ''} → ${
        step.alightingStop ?? ''
      }${stops}`;
    });
  const walk = route.walkingMinutes ? ` · 도보 ${route.walkingMinutes}분` : '';
  return rides.length > 0
    ? [...rides, `총 ${total}분${walk}`]
    : [`걸어서 ${total}분`];
}

const KAKAO_MODE: Record<string, string> = {
  PUBLIC_TRANSIT: 'traffic',
  WALKING: 'walk',
};

type Spot = Pick<SchedulePlace, 'name' | 'latitude' | 'longitude'>;

const kakaoPoint = (p: Spot) =>
  `${encodeURIComponent(p.name)},${p.latitude},${p.longitude}`;

function openDirections(to: SchedulePlace, from: Spot | null, mode: string) {
  if (to.latitude == null || to.longitude == null) {
    return;
  }
  const url =
    from?.latitude != null && from.longitude != null
      ? `https://map.kakao.com/link/by/${
          KAKAO_MODE[mode] ?? 'car'
        }/${kakaoPoint(from)}/${kakaoPoint(to)}`
      : `https://map.kakao.com/link/to/${kakaoPoint(to)}`;
  Linking.openURL(url).catch(() => Alert.alert('알림', '지도를 열 수 없어요.'));
}

const RouteLine: React.FC<{
  route: RouteLeg;
  from: Spot | null;
  to: SchedulePlace | null;
}> = ({ route, from, to }) => {
  const Icon =
    route.transportMode === 'PUBLIC_TRANSIT'
      ? BusIcon
      : route.transportMode === 'WALKING'
      ? WalkIcon
      : CarIcon;
  const lines = routeLines(route);
  const last = lines.pop();
  return (
    <View style={s.route}>
      <Icon size={16} color={colors.textSecondary} />
      <View style={s.routeBody}>
        {lines.map(line => (
          <Text key={line} style={s.routeText}>
            {line}
          </Text>
        ))}
        <View style={s.routeLast}>
          <Text style={s.routeText}>{last}</Text>
          {to?.latitude != null && (
            <TouchableOpacity
              style={s.routeMap}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`${to.name}까지 카카오맵으로 길 안내`}
              onPress={() => openDirections(to, from, route.transportMode)}
            >
              <Image
                source={require('../../shared/assets/images/kakaomap.png')}
                style={s.routeMapLogo}
              />
              <Text style={s.routeMapText}>길 안내</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

/** 리더가 카드를 고칠 때만 넘긴다 (명세 Func-011-03). 없으면 보기 전용이다 */
export interface ScheduleEditHandlers {
  /** 저장 중에는 막는다. 저장 결과가 오기 전에 또 고치면 id 가 어긋난다 */
  disabled: boolean;
  /** 다른 카드와 바꿀 카드를 고르는 중이면 그 칸 id */
  swapping: number | null;
  onPick: (slot: ScheduleSlot, date: string) => void;
  onMenu: (
    slot: ScheduleSlot,
    date: string,
    index: number,
    count: number,
  ) => void;
  onMove: (date: string, from: number, to: number) => void;
  onSwapTarget: (slot: ScheduleSlot) => void;
  onAdd: (date: string) => void;
  /** 끄는 동안 바깥 스크롤을 멈춘다. 안 그러면 끌다가 화면이 같이 움직인다 */
  onDragging: (dragging: boolean) => void;
}

export function dropIndex(from: number, dy: number, heights: number[]): number {
  let to = from;
  let left = dy;
  while (left > 0 && to < heights.length - 1 && left > heights[to + 1] / 2) {
    left -= heights[to + 1];
    to += 1;
  }
  while (left < 0 && to > 0 && -left > heights[to - 1] / 2) {
    left += heights[to - 1];
    to -= 1;
  }
  return to;
}

const DayCards: React.FC<{
  date: string;
  slots: ScheduleSlot[];
  origin: Origin | null;
  edit?: ScheduleEditHandlers;
}> = ({ date, slots, origin, edit }) => {
  const heights = useRef<number[]>([]);
  const tops = useRef<number[]>([]);
  const dy = useRef(new Animated.Value(0)).current;
  const [dragging, setDragging] = useState<number | null>(null);
  // 끄는 동안 다른 카드가 미리 비켜 서는 거리. 놓으면 0 으로 돌리고 순서를 바꾼다
  const offsets = useRef<Animated.Value[]>([]);
  const offsetOf = (i: number) =>
    (offsets.current[i] ??= new Animated.Value(0));
  const hoverTo = useRef<number | null>(null);

  const shiftOthers = (from: number, to: number) => {
    // 카드 사이 간격까지 더해야 비켜 선 자리가 딱 맞는다
    const gap =
      tops.current.length > 1 && heights.current[0] != null
        ? Math.max(0, tops.current[1] - tops.current[0] - heights.current[0])
        : 0;
    const pitch = (heights.current[from] ?? 0) + gap;
    slots.forEach((_, i) => {
      if (i === from) {
        return;
      }
      const target =
        from < to && i > from && i <= to
          ? -pitch
          : to < from && i >= to && i < from
          ? pitch
          : 0;
      Animated.timing(offsetOf(i), {
        toValue: target,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
  };
  const resetShift = () => {
    hoverTo.current = null;
    offsets.current.forEach(v => v.setValue(0));
  };
  useLayoutEffect(resetShift, [slots]);

  // ponytail: 칸마다 렌더 때 새로 만든다. 칸 수가 하루 10개 안쪽이라 문제없다
  const handle = (index: number) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => !edit?.disabled,
      onMoveShouldSetPanResponder: () => !edit?.disabled,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        dy.setValue(0);
        hoverTo.current = index;
        setDragging(index);
        edit?.onDragging(true);
      },
      onPanResponderMove: (_, g) => {
        dy.setValue(g.dy);
        const to = dropIndex(index, g.dy, heights.current);
        if (to !== hoverTo.current) {
          hoverTo.current = to;
          shiftOthers(index, to);
        }
      },
      onPanResponderRelease: (_, g) => {
        const to = dropIndex(index, g.dy, heights.current);
        setDragging(null);
        dy.setValue(0);
        // 옮길 때는 새 순서가 그려진 뒤에 푼다(아래 useEffect). 먼저 풀면 한 번 튄다
        if (to === index || Math.abs(g.dy) < 6) {
          resetShift();
        }
        edit?.onDragging(false);
        // 거의 안 움직였으면 끈 게 아니라 누른 것이다 — 메뉴를 연다
        if (Math.abs(g.dy) < 6) {
          edit?.onMenu(slots[index], date, index, slots.length);
        } else if (to !== index) {
          edit?.onMove(date, index, to);
        }
      },
      onPanResponderTerminate: () => {
        setDragging(null);
        dy.setValue(0);
        resetShift();
        edit?.onDragging(false);
      },
    }).panHandlers;

  return (
    <>
      {slots.map((slot, index) => {
        const swapSource = edit?.swapping === slot.slotId;
        const choosingTarget = edit?.swapping != null && !swapSource;
        const body = slot.place ? (
          <>
            <View style={s.thumb}>
              <CategoryIcon
                category={slot.place.category}
                color={colors.primary}
              />
            </View>
            <View style={s.rowBody}>
              <Text style={s.rowSub}>
                {slot.order}번째
                {slot.place.categoryLabel
                  ? ` · ${slot.place.categoryLabel}`
                  : ''}
              </Text>
              <Text style={s.rowTitle} numberOfLines={1}>
                {slot.place.name}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[s.rowBody, s.emptySlotText]}>
            {slot.order}번째 · {edit ? '+ 장소 고르기' : '비어 있는 칸'}
          </Text>
        );

        return (
          <Animated.View
            key={slot.slotId}
            onLayout={e => {
              heights.current[index] = e.nativeEvent.layout.height;
              tops.current[index] = e.nativeEvent.layout.y;
            }}
            style={[
              {
                transform: [
                  { translateY: dragging === index ? dy : offsetOf(index) },
                ],
              },
              dragging === index && s.dragging,
            ]}
          >
            {/* 끌거나 바꾸거나 저장하는 동안은 순서가 맞지 않아 숨긴다 */}
            {dragging === null &&
              edit?.swapping == null &&
              !edit?.disabled &&
              slot.routeStatus === 'READY' &&
              slot.routeFromPrevious && (
                <RouteLine
                  route={slot.routeFromPrevious}
                  from={
                    slots
                      .slice(0, index)
                      .reverse()
                      .find(prev => prev.place)?.place ?? origin
                  }
                  to={slot.place}
                />
              )}
            <TouchableOpacity
              style={[
                slot.place ? s.row : s.emptySlot,
                s.editRow,
                swapSource && s.swapSource,
              ]}
              activeOpacity={edit ? 0.8 : 1}
              disabled={
                !edit || edit.disabled || (!!slot.place && !choosingTarget)
              }
              accessibilityRole={edit ? 'button' : undefined}
              accessibilityLabel={
                choosingTarget
                  ? `${slot.order}번째 칸과 바꾸기`
                  : !slot.place && edit
                  ? `${slot.order}번째 칸에 장소 고르기`
                  : undefined
              }
              onPress={() =>
                choosingTarget
                  ? edit?.onSwapTarget(slot)
                  : edit?.onPick(slot, date)
              }
            >
              {body}
              {edit && !choosingTarget && (
                <View
                  {...handle(index)}
                  hitSlop={touch48(32)}
                  style={s.handle}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`${slot.order}번째 칸 옮기기 · 바꾸기 메뉴`}
                  onAccessibilityTap={() =>
                    edit.onMenu(slot, date, index, slots.length)
                  }
                >
                  <View style={s.handleText}>
                    <GripIcon size={24} color={colors.textSecondary} />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      })}
      {edit && (
        <TouchableOpacity
          style={s.addSlot}
          activeOpacity={0.8}
          disabled={edit.disabled}
          accessibilityRole="button"
          onPress={() => edit.onAdd(date)}
        >
          <Text style={s.addSlotText}>+ 칸 추가</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export interface Origin extends Spot {
  lodging: boolean;
}

export function dayOrigins(schedule: PlannerSchedule): (Origin | null)[] {
  const departure = schedule.departure
    ? { ...schedule.departure, lodging: false }
    : null;
  return schedule.days.map((day, i) => {
    if (i === 0) {
      return departure;
    }
    const last = [...schedule.days[i - 1].slots]
      .reverse()
      .find(slot => slot.place)?.place;
    return last?.category === 'ACCOMMODATION'
      ? {
          name: last.name,
          latitude: last.latitude,
          longitude: last.longitude,
          lodging: true,
        }
      : departure;
  });
}

const OriginRow: React.FC<{ origin: Origin }> = ({ origin }) => {
  const Icon = origin.lodging
    ? BedIcon
    : origin.name.includes('집')
    ? HomeIcon
    : origin.name.endsWith('역')
    ? TrainIcon
    : PinIcon;
  return (
    <View style={s.row}>
      <View style={s.thumb}>
        <Icon size={22} color={colors.primary} />
      </View>
      <View style={s.rowBody}>
        <Text style={s.rowSub}>
          0번째 · {origin.lodging ? '숙소에서 출발' : '출발'}
        </Text>
        <Text style={s.rowTitle}>{origin.name}</Text>
      </View>
    </View>
  );
};

const ScheduleDays: React.FC<{
  schedule: PlannerSchedule;
  edit?: ScheduleEditHandlers;
}> = ({ schedule, edit }) => {
  const origins = dayOrigins(schedule);
  return (
    <>
      {schedule.days.map((day, i) => (
        <View key={day.date}>
          <Text style={s.dayTitle}>
            {dayLabel(schedule.startDate, day.date)}
          </Text>
          {origins[i] && <OriginRow origin={origins[i]} />}
          <DayCards
            date={day.date}
            slots={day.slots}
            origin={origins[i]}
            edit={edit}
          />
        </View>
      ))}
      {schedule.days.some(d =>
        d.slots.some(
          slot => slot.routeFromPrevious?.transportMode === 'PUBLIC_TRANSIT',
        ),
      ) && (
        <View style={s.routeCredit}>
          <Text style={s.routeText}>대중교통 정보: 아로정보기술 컨텐츠</Text>
          <View style={s.odsayMark}>
            <Image
              source={require('../../shared/assets/images/powered-by-odsay.png')}
              style={s.odsayMarkImage}
              accessibilityLabel="powered by ODsay"
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ScheduleDays;
