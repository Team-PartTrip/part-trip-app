import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import {
  ConfirmedPlace,
  deletePlanner,
  getConfirmedPlaces,
  getPlanner,
  PlannerDetail,
} from '../../entities/planner/api';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatRange,
  formatShortDate,
  GroupStatus,
  planStatusLabel,
} from '../../entities/planner/types';

/** 일정이 확정된 뒤의 상태. 이때부터 이 화면은 일정표가 된다 */
export function isSchedule(status: GroupStatus): boolean {
  return status === 'CONFIRMED' || status === 'TRAVELING' || status === 'DONE';
}

export interface ScheduleDay {
  key: string;
  /** "1일차 · 10.12". 날짜를 모르면 null 이라 제목을 안 그린다 */
  label: string | null;
  places: ConfirmedPlace[];
}

/** 시작일로부터 며칠차인지. 타임존에 안 흔들리게 UTC 로 센다 */
function dayNumber(startDate: string, date: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const day = Date.parse(`${date}T00:00:00Z`);
  return Math.max(1, Math.round((day - start) / 86_400_000) + 1);
}

/**
 * 확정 장소를 날짜별로 묶는다.
 *
 * 날짜를 주는 곳이 하나도 없으면 묶지 않는다. 날짜는 동선 배분(#130)이
 * 붙여주는데, 그 전에 확정된 계획은 visitedDate 가 없다.
 * 날짜가 빠진 장소는 첫날로 본다. 서버가 섞어 보내도 사라지지 않게.
 */
export function groupByDay(
  places: ConfirmedPlace[],
  startDate: string,
): ScheduleDay[] {
  if (!places.some(place => place.visitedDate)) {
    return [{ key: 'all', label: null, places }];
  }

  const byDate = new Map<string, ConfirmedPlace[]>();
  for (const place of places) {
    const date = place.visitedDate ?? startDate;
    const bucket = byDate.get(date);
    if (bucket) {
      bucket.push(place);
    } else {
      byDate.set(date, [place]);
    }
  }

  return [...byDate.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, group]) => ({
      key: date,
      label: `${dayNumber(startDate, date)}일차 · ${formatShortDate(date)}`,
      places: group,
    }));
}

interface Props {
  planId: number;
  onBack?: () => void;
  /** 삭제가 끝나면 목록으로 돌려보낸다. 이 화면은 이미 사라진 플래너를 본다 */
  onDeleted: () => void;
}

/**
 * 우리 여행 계획 (명세 Func-005-06).
 *
 * 확정되면 일정표가 된다. 확정 전 화면(AI 초안 · 리더 수정)은 서버 #158 ·
 * #131 을 기다린다. 투표는 기획에서 빠졌다(server #161).
 */
const PlanStatusView: React.FC<Props> = ({
  planId,
  onBack,
  onDeleted,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [plan, setPlan] = useState<PlannerDetail | null>(null);
  // 확정 후에만 채운다. 확정 전에 부르면 서버가 400 을 준다
  const [schedule, setSchedule] = useState<ConfirmedPlace[] | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const detail = await getPlanner(planId);
          const final = isSchedule(detail.status)
            ? await getConfirmedPlaces(planId).catch(() => null)
            : null;
          if (alive) {
            setPlan(detail);
            setSchedule(final?.places ?? null);
          }
        } catch {
          if (alive) {
            setPlan(null);
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
    }, [planId]),
  );

  // 되돌릴 수 없어서 한 번 묻는다. 서버는 그룹장만 받아준다(API-005-12).
  const confirmDelete = () =>
    Alert.alert(
      '플래너 삭제',
      `"${
        plan?.title ?? ''
      }" 을(를) 삭제할까요?\n멤버와 일정도 함께 사라져요. 되돌릴 수 없어요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await deletePlanner(planId);
              // 지운 플래너를 계속 보여줄 수 없다. 목록으로 보낸다.
              onDeleted();
            } catch (e: any) {
              Alert.alert(
                '삭제 실패',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  if (!plan) {
    return (
      <SafeAreaView style={s.safeArea} edges={['top']}>
        <TouchableOpacity onPress={onBack} hitSlop={12} style={s.errorBack}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <View style={s.errorBox}>
          <Text style={s.errorText}>계획을 불러오지 못했어요</Text>
        </View>
      </SafeAreaView>
    );
  }

  const confirmed = isSchedule(plan.status);

  const days =
    schedule && plan.startDate ? groupByDay(schedule, plan.startDate) : [];

  const share = () => {
    const lines = days.flatMap(day =>
      // 날짜가 없으면 제목 없이 장소만 나열한다
      (day.label ? [day.label] : []).concat(
        day.places.map(
          item => `· ${CATEGORY_LABEL[item.category]} — ${item.placeName}`,
        ),
      ),
    );
    Share.share({
      message: [
        plan.title,
        plan.startDate && plan.endDate
          ? formatRange(plan.startDate, plan.endDate)
          : '',
        '',
        ...lines,
      ].join('\n'),
    });
  };

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={1}>
              {plan.title}
            </Text>
            <View
              style={[
                s.statusPill,
                {
                  backgroundColor: confirmed ? colors.success : colors.accent,
                },
              ]}
            >
              <Text style={s.statusText}>{planStatusLabel(plan.status)}</Text>
            </View>
          </View>
          <Text style={s.meta}>
            {plan.startDate && plan.endDate
              ? `${formatRange(plan.startDate, plan.endDate)} · `
              : ''}
            {plan.joinedMemberCount}/{plan.memberCount}명
          </Text>
        </SafeAreaView>

        {confirmed ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>확정된 일정</Text>

            {schedule === null ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>일정을 불러오지 못했어요</Text>
              </View>
            ) : schedule.length === 0 ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>확정된 장소가 없어요</Text>
              </View>
            ) : (
              days.map(day => (
                <View key={day.key}>
                  {!!day.label && <Text style={s.dayTitle}>{day.label}</Text>}
                  {day.places.map((item, i) => (
                    // 같은 장소가 다른 날 또 나올 수 있어 순서까지 붙인다
                    <View key={`${item.tourPlaceId}-${i}`} style={s.row}>
                      <View style={s.thumb}>
                        <Text style={s.thumbEmoji}>
                          {CATEGORY_EMOJI[item.category]}
                        </Text>
                      </View>
                      <View style={s.rowBody}>
                        <Text style={s.rowSub}>
                          {CATEGORY_LABEL[item.category]}
                        </Text>
                        <Text style={s.rowTitle} numberOfLines={1}>
                          {item.placeName}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}

            {!!schedule && schedule.length > 0 && (
              <TouchableOpacity
                style={s.shareBtn}
                activeOpacity={0.85}
                onPress={share}
              >
                <Text style={s.shareText}>일정 공유하기</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={s.empty}>
            <Text style={s.emptyText}>아직 확정된 일정이 없어요</Text>
          </View>
        )}

        {plan.role === 'OWNER' && (
          <TouchableOpacity
            style={s.deleteBtn}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="플래너 삭제"
            disabled={deleting}
            onPress={confirmDelete}
          >
            {deleting ? (
              <ActivityIndicator size="small" color={colors.danger} />
            ) : (
              <Text style={s.deleteText}>플래너 삭제</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PlanStatusView;
