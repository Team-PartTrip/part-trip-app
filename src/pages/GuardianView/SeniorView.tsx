import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Text } from '../../shared/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { guardianStyles as s } from './GuardianView.styles';
import colors from '../../shared/tokens/colors';
import { touch48 } from '../../shared/ui/hitSlop';
import ScheduleDays from '../PlannerScreen/ScheduleDays';
import { timeAgo } from '../NotificationView/notificationMeta';
import {
  getSeniorLocation,
  getSeniorPlanners,
  getSeniorSchedule,
  SeniorLocation,
} from '../../entities/guardian/api';
import type {
  PlannerListItem,
  PlannerSchedule,
} from '../../entities/planner/api';
import { formatRange, planStatusLabel } from '../../entities/planner/types';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  PinIcon,
} from '../../shared/ui/icons';

/** 카카오맵 웹 링크. 앱이 깔려 있으면 앱으로, 없으면 브라우저로 열린다 */
export function kakaoMapUrl(label: string, lat: number, lng: number): string {
  return `https://map.kakao.com/link/map/${encodeURIComponent(
    label,
  )},${lat},${lng}`;
}

interface Props {
  seniorUserId: string;
  nickName: string;
  onBack?: () => void;
}

function newer(
  prev: SeniorLocation | null,
  next: SeniorLocation | null,
): SeniorLocation | null {
  if (!prev || !next) {
    return next;
  }
  const nextAt = Date.parse(next.recordedAt);
  const prevAt = Date.parse(prev.recordedAt);
  if (Number.isNaN(nextAt) || Number.isNaN(prevAt)) {
    return next;
  }
  return nextAt >= prevAt ? next : prev;
}

const SeniorView: React.FC<Props> = ({ seniorUserId, nickName, onBack }) => {
  const [location, setLocation] = useState<SeniorLocation | null>(null);
  const [locationFailed, setLocationFailed] = useState(false);
  const [planners, setPlanners] = useState<PlannerListItem[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [schedules, setSchedules] = useState<
    Record<number, PlannerSchedule | 'failed'>
  >({});

  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const loadLocation = useCallback(() => {
    setLocationFailed(false);
    getSeniorLocation(seniorUserId)
      .then(found => mounted.current && setLocation(prev => newer(prev, found)))
      .catch(() => mounted.current && setLocationFailed(true));
  }, [seniorUserId]);

  // 화면이 열려 있는 동안 10초마다 조용히 다시 받는다. 실패해도 지금 보이는 위치는 그대로 둔다
  useFocusEffect(
    useCallback(() => {
      const timer = setInterval(() => {
        getSeniorLocation(seniorUserId)
          .then(
            found => mounted.current && setLocation(prev => newer(prev, found)),
          )
          .catch(() => {});
      }, 10_000);
      return () => clearInterval(timer);
    }, [seniorUserId]),
  );

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      loadLocation();
      getSeniorPlanners(seniorUserId)
        .then(list => alive && setPlanners(list))
        .catch(() => alive && setPlanners([]));
      return () => {
        alive = false;
      };
    }, [seniorUserId, loadLocation]),
  );

  const toggle = (plannerId: number) => {
    if (openId === plannerId) {
      setOpenId(null);
      return;
    }
    setOpenId(plannerId);
    if (!schedules[plannerId] || schedules[plannerId] === 'failed') {
      setSchedules(prev => {
        const next = { ...prev };
        delete next[plannerId];
        return next;
      });
      getSeniorSchedule(seniorUserId, plannerId)
        .then(schedule =>
          setSchedules(prev => ({ ...prev, [plannerId]: schedule })),
        )
        .catch(() =>
          setSchedules(prev => ({ ...prev, [plannerId]: 'failed' })),
        );
    }
  };

  const openMap = async () => {
    if (!location) {
      return;
    }
    const url = kakaoMapUrl(
      `${nickName}님`,
      location.latitude,
      location.longitude,
    );
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        '지도를 열지 못했어요',
        `${location.latitude}, ${location.longitude}`,
      );
    }
  };

  const renderSchedule = (plannerId: number) => {
    const schedule = schedules[plannerId];
    if (!schedule) {
      return <ActivityIndicator style={s.loading} color={colors.primary} />;
    }
    if (schedule === 'failed') {
      return <Text style={s.empty}>일정을 불러오지 못했어요</Text>;
    }
    if (schedule.days.every(day => day.slots.length === 0)) {
      return <Text style={s.empty}>아직 일정이 없어요</Text>;
    }
    return <ScheduleDays schedule={schedule} />;
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={touch48(32)}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
        >
          <View style={s.back}>
            <ChevronLeftIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
        <Text style={s.title} numberOfLines={1}>
          {nickName}님의 여행
        </Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.section}>지금 위치</Text>
        <View style={s.codeBox}>
          {location ? (
            <>
              <View style={s.locationRow}>
                <PinIcon size={20} color={colors.primary} />
                <Text style={s.locationText}>
                  {timeAgo(location.recordedAt)} 위치
                </Text>
              </View>
              <TouchableOpacity
                style={[s.primaryBtn, s.locationBtn]}
                activeOpacity={0.85}
                accessibilityRole="button"
                onPress={openMap}
              >
                <Text style={s.primaryText}>지도에서 보기</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={s.empty}>
              {locationFailed
                ? '위치를 불러오지 못했어요'
                : '지금은 여행 중이 아니거나 위치를 공유하지 않았어요'}
            </Text>
          )}
          <TouchableOpacity
            style={s.refresh}
            hitSlop={touch48(24)}
            accessibilityRole="button"
            onPress={loadLocation}
          >
            <Text style={s.refreshText}>새로 고침</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.section}>여행 일정</Text>
        {planners === null ? (
          <ActivityIndicator style={s.loading} color={colors.primary} />
        ) : planners.length === 0 ? (
          <Text style={s.empty}>아직 만든 여행이 없어요.</Text>
        ) : (
          planners.map(planner => (
            <View key={planner.plannerId}>
              <TouchableOpacity
                style={s.row}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityState={{ expanded: openId === planner.plannerId }}
                onPress={() => toggle(planner.plannerId)}
              >
                <View style={s.rowBody}>
                  <Text style={s.rowTitle} numberOfLines={1}>
                    {planner.title}
                  </Text>
                  <Text style={s.rowSub}>
                    {planner.startDate && planner.endDate
                      ? formatRange(planner.startDate, planner.endDate)
                      : '기간 미정'}{' '}
                    · {planStatusLabel(planner.status)}
                  </Text>
                </View>
                <View style={s.chevron}>
                  {openId === planner.plannerId ? (
                    <ChevronUpIcon size={18} color={colors.textTertiary} />
                  ) : (
                    <ChevronDownIcon size={18} color={colors.textTertiary} />
                  )}
                </View>
              </TouchableOpacity>
              {openId === planner.plannerId &&
                renderSchedule(planner.plannerId)}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default SeniorView;
