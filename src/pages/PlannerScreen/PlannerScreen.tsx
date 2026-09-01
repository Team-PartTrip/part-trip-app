import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { plannerStyles as s } from './PlannerScreen.styles';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import {
  deletePlanner,
  getPlanners,
  getPlannerMembers,
  PlannerListItem,
  PlannerMember,
} from '../../entities/planner/api';
import {
  formatRange,
  GroupStatus,
  planStatusLabel,
  today,
} from '../../entities/planner/types';

type FilterKey = 'ongoing' | 'upcoming' | 'done';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ongoing', label: '진행 중' },
  { key: 'upcoming', label: '예정' },
  { key: 'done', label: '완료' },
];

/** 목록 한 줄 + 그 플래너의 멤버들 */
interface PlannerRow extends PlannerListItem {
  members: PlannerMember[];
}

/** 상단 띠 · 상태 배지 색. 모집 중은 파랑, 투표/여행 중은 주황, 확정은 초록 */
function toneOf(status: GroupStatus): string {
  switch (status) {
    case 'PLANNING':
      return colors.primary;
    case 'VOTING':
    case 'TRAVELING':
      return colors.accent;
    case 'CONFIRMED':
      return colors.success;
    default:
      return colors.textTertiary;
  }
}

/** 카드 왼쪽 아래 문구 — 확정 전에는 참여 인원, 확정 뒤에는 상태를 보여준다 */
function metaOf(plan: PlannerRow): string {
  if (plan.status === 'CONFIRMED') {
    return '확정 완료';
  }
  if (plan.status === 'DONE') {
    return '여행 완료';
  }
  return `${plan.joinedMemberCount}/${plan.memberCount} 참여`;
}

/** 진행 중 = 아직 끝나지 않은 계획, 예정 = 출발 전, 완료 = 끝난 계획 */
function matches(plan: PlannerRow, filter: FilterKey): boolean {
  // 여행지·기간을 아직 안 정한 플래너는 끝났다고 볼 수 없다
  const isDone =
    plan.status === 'DONE' || (!!plan.endDate && plan.endDate < today());
  switch (filter) {
    case 'ongoing':
      return !isDone;
    case 'upcoming':
      return !isDone && !!plan.startDate && plan.startDate > today();
    default:
      return isDone;
  }
}

interface Props {
  onCreate?: () => void;
  onOpenPlan?: (plannerId: number, status: GroupStatus) => void;
}

const PlannerScreen: React.FC<Props> = ({ onCreate, onOpenPlan }) => {
  const [filter, setFilter] = useState<FilterKey>('ongoing');
  const [rows, setRows] = useState<PlannerRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        setFailed(false);
        try {
          const planners = await getPlanners();
          // 목록 응답에는 멤버가 없어서 아바타를 그리려면 따로 받아야 한다.
          // 내 플래너 수만큼이라 병렬로 한 번에 받는다.
          const members = await Promise.all(
            planners.map(p => getPlannerMembers(p.plannerId).catch(() => [])),
          );
          if (!alive) {
            return;
          }
          setRows(planners.map((p, i) => ({ ...p, members: members[i] })));
        } catch {
          if (alive) {
            setRows(null);
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

  // 되돌릴 수 없어서 한 번 묻는다. 서버는 그룹장만 받아준다(API-005-12).
  const confirmDelete = (plannerId: number, title: string) =>
    Alert.alert(
      '플래너 삭제',
      `"${title}" 을(를) 삭제할까요?\n투표와 멤버도 함께 사라져요. 되돌릴 수 없어요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlanner(plannerId);
              // 목록을 다시 부르지 않고 지운 것만 뺀다
              setRows(prev =>
                (prev ?? []).filter(row => row.plannerId !== plannerId),
              );
            } catch (e: any) {
              Alert.alert('삭제 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
            }
          },
        },
      ],
    );

  const plans = (rows ?? []).filter(plan => matches(plan, filter));

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>플래너</Text>
          <TouchableOpacity
            style={s.createBtn}
            activeOpacity={0.85}
            onPress={onCreate}
          >
            <Text style={s.createText}>+ 생성</Text>
          </TouchableOpacity>
        </View>

        <View style={s.filterRow}>
          {FILTERS.map(item => {
            const on = item.key === filter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[s.filterChip, on && s.filterChipOn]}
                activeOpacity={0.85}
                onPress={() => setFilter(item.key)}
              >
                <Text style={[s.filterText, on && s.filterTextOn]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : failed ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>계획을 불러오지 못했어요</Text>
            <Text style={s.emptyDesc}>
              네트워크를 확인하고 다시 들어와 주세요.
            </Text>
          </View>
        ) : plans.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>여기에 보여줄 계획이 없어요</Text>
            <Text style={s.emptyDesc}>
              오른쪽 위 + 생성으로 새 여행을 만들어 보세요.
            </Text>
          </View>
        ) : (
          plans.map(plan => {
            const tone = toneOf(plan.status);
            return (
              <TouchableOpacity
                key={plan.plannerId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => onOpenPlan?.(plan.plannerId, plan.status)}
              >
                <View style={[s.cardStripe, { backgroundColor: tone }]} />
                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>{plan.title}</Text>
                  <Text style={s.cardDate}>
                    {plan.startDate && plan.endDate
                      ? formatRange(plan.startDate, plan.endDate)
                      : '여행지 · 기간 미정'}
                  </Text>

                  <View style={s.cardMiddle}>
                    <View style={s.statusPill}>
                      <Text style={[s.statusText, { color: tone }]}>
                        {planStatusLabel(plan.status)}
                      </Text>
                    </View>
                    <View style={s.avatars}>
                      {plan.members.map((member, i) => (
                        <MemberAvatar
                          key={member.userId}
                          nickname={member.nickName}
                          index={i}
                          style={i > 0 && s.avatarOverlap}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={s.cardFooter}>
                    <Text style={s.cardMeta}>{metaOf(plan)}</Text>
                    {/* 삭제는 그룹장만 할 수 있다. 멤버에게 보여주면
                        눌러도 서버가 거부하는 버튼이 된다. */}
                    {plan.role === 'OWNER' && (
                      <TouchableOpacity
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={`${plan.title} 삭제`}
                        onPress={() => confirmDelete(plan.plannerId, plan.title)}
                      >
                        <Text style={s.cardDelete}>삭제</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={s.chevron}>›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default PlannerScreen;
