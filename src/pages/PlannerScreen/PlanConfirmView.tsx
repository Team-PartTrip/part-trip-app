import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { planConfirmStyles as s } from './PlanConfirmView.styles';
import MemberAvatar from './MemberAvatar';
import {
  ConfirmedPlace,
  getConfirmedPlaces,
  getPlannerMembers,
  PlannerFinal,
  PlannerMember,
} from '../../entities/planner/api';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatShortDate,
} from '../../entities/planner/types';

interface Props {
  planId: number;
  onBack?: () => void;
  onStart?: () => void;
}

interface ConfirmedDay {
  key: string;
  /** "1일차 · 10.12". 날짜를 모르면 null 이라 제목을 안 그린다 */
  label: string | null;
  places: ConfirmedPlace[];
}

/**
 * 확정 장소를 날짜별로 묶는다.
 *
 * 날짜를 주는 곳이 하나도 없으면 묶지 않는다. 서버가 카테고리마다 한 곳만
 * 확정하던 동안에는 visitedDate 가 없어서, 그때는 예전 화면 그대로다.
 */
function groupByDay(
  places: ConfirmedPlace[],
  startDate: string,
): ConfirmedDay[] {
  if (!places.some(place => place.visitedDate)) {
    return [{ key: 'all', label: null, places }];
  }

  const byDate = new Map<string, ConfirmedPlace[]>();
  for (const place of places) {
    // 날짜가 빠진 것은 첫날로 본다. 서버가 섞어 보내도 사라지지 않게
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

/** 시작일로부터 며칠차인지. 타임존에 안 흔들리게 UTC 로 센다 */
function dayNumber(startDate: string, date: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const day = Date.parse(`${date}T00:00:00Z`);
  return Math.max(1, Math.round((day - start) / 86_400_000) + 1);
}

const PlanConfirmView: React.FC<Props> = ({ planId, onBack, onStart }) => {
  const [plan, setPlan] = useState<PlannerFinal | null>(null);
  const [members, setMembers] = useState<PlannerMember[]>([]);
  const [loading, setLoading] = useState(true);
  // 서버가 "아직 확정 전" 도 400 으로 알려줘서 그 문구를 그대로 보여준다
  const [error, setError] = useState<string | null>(null);

  // 다시 확인하기 버튼도 같은 함수를 부른다
  const load = useCallback(
    (alive: () => boolean) =>
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const [final, memberList] = await Promise.all([
            getConfirmedPlaces(planId),
            getPlannerMembers(planId).catch(() => []),
          ]);
          if (alive()) {
            setPlan(final);
            setMembers(memberList);
          }
        } catch (e: any) {
          if (alive()) {
            setPlan(null);
            setError(e?.message ?? '확정 결과를 불러오지 못했어요.');
          }
        } finally {
          if (alive()) {
            setLoading(false);
          }
        }
      })(),
    [planId],
  );

  useFocusEffect(
    useCallback(() => {
      let running = true;
      void load(() => running);
      return () => {
        running = false;
      };
    }, [load]),
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
      <SafeAreaView style={s.errorArea} edges={['top', 'bottom']}>
        <TouchableOpacity
          style={s.errorBackBtn}
          onPress={onBack}
          hitSlop={12}
        >
          <Text style={s.errorBack}>‹</Text>
        </TouchableOpacity>

        <View style={s.errorBody}>
          <Text style={s.errorTitle}>아직 확정된 일정이 없어요</Text>
          <Text style={s.errorDesc}>{error}</Text>
        </View>

        <View style={s.errorActions}>
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={() => void load(() => true)}
          >
            <Text style={s.primaryText}>다시 확인하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.secondaryBtn}
            activeOpacity={0.85}
            onPress={onBack}
          >
            <Text style={s.secondaryText}>진행 현황으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const confirmed = plan.places;

  /**
   * 날짜별로 묶는다.
   *
   * 서버가 카테고리마다 한 곳만 확정하던 동안에는 visitedDate 가 없다.
   * 그때는 묶지 않고 예전처럼 한 줄로 그린다. 날짜가 오기 시작하면
   * 그대로 일차별 목록이 된다.
   */
  const days = groupByDay(confirmed, plan.startDate);

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
        `${plan.title}`,
        `${plan.startDate.replace(/-/g, '.')} – ${formatShortDate(
          plan.endDate,
        )}`,
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
          <View style={s.backRow}>
            <TouchableOpacity onPress={onBack} hitSlop={12}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          </View>
          <View style={s.checkCircle}>
            <Text style={s.check}>✓</Text>
          </View>
          <Text style={s.headline}>투표가 완료됐어요</Text>
        </SafeAreaView>

        <View style={s.card}>
          <Text style={s.cardTitle}>{plan.title}</Text>
          <Text style={s.cardDate}>
            {plan.startDate.replace(/-/g, '.')} – {formatShortDate(plan.endDate)}
          </Text>
          <View style={s.cardMembers}>
            <View style={s.avatars}>
              {members.map((member, i) => (
                <MemberAvatar
                  key={member.userId}
                  nickname={member.nickName}
                  index={i}
                  size={28}
                  style={i > 0 && s.avatarOverlap}
                />
              ))}
            </View>
            <Text style={s.cardMeta}>{members.length}명 참여</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>확정된 일정</Text>

          {confirmed.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>아직 확정된 장소가 없어요.</Text>
            </View>
          ) : (
            days.map(day => (
              <View key={day.key}>
                {!!day.label && <Text style={s.dayTitle}>{day.label}</Text>}
                {day.places.map(item => (
                  // 한 투표에서 여러 곳이 확정되므로 voteId 로는 키가 겹친다
                  <View key={item.optionId} style={s.row}>
                    <View style={s.thumb}>
                      <Text style={s.thumbEmoji}>
                        {CATEGORY_EMOJI[item.category]}
                      </Text>
                    </View>
                    <View style={s.rowBody}>
                      <Text style={s.rowCategory}>
                        {CATEGORY_LABEL[item.category]}
                      </Text>
                      <Text style={s.rowName} numberOfLines={1}>
                        {item.placeName}
                      </Text>
                    </View>
                    <View style={s.rowPill}>
                      <Text style={s.rowPillText}>{item.voteCount}표</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        <SafeAreaView edges={['bottom']} style={s.actions}>
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={onStart}
          >
            <Text style={s.primaryText}>여행 시작하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.secondaryBtn}
            activeOpacity={0.85}
            onPress={share}
          >
            <Text style={s.secondaryText}>일정 공유하기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default PlanConfirmView;
