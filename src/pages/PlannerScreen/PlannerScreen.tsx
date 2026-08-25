import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { plannerStyles as s } from './PlannerScreen.styles';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import { samplePlans, sampleVotesOf } from '../../entities/planner/sampleData';
import {
  formatRange,
  planStatusLabel,
  today,
  TravelPlan,
  votedMemberCount,
} from '../../entities/planner/types';

type FilterKey = 'ongoing' | 'upcoming' | 'done';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ongoing', label: '진행 중' },
  { key: 'upcoming', label: '예정' },
  { key: 'done', label: '완료' },
];

/** 상단 띠 · 상태 배지 색. 모집 중은 파랑, 투표/여행 중은 주황, 확정은 초록 */
function toneOf(plan: TravelPlan): string {
  switch (plan.status) {
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
function metaOf(plan: TravelPlan): string {
  if (plan.status === 'CONFIRMED') {
    return '확정 완료';
  }
  if (plan.status === 'DONE') {
    return '여행 완료';
  }
  if (plan.status === 'VOTING') {
    return `${votedMemberCount(sampleVotesOf(plan.planId))}/${
      plan.headcount
    } 참여`;
  }
  return `${plan.members.length}/${plan.headcount} 참여`;
}

/** 진행 중 = 아직 끝나지 않은 계획, 예정 = 출발 전, 완료 = 끝난 계획 */
function matches(plan: TravelPlan, filter: FilterKey): boolean {
  const isDone = plan.status === 'DONE' || plan.endDate < today();
  switch (filter) {
    case 'ongoing':
      return !isDone;
    case 'upcoming':
      return !isDone && plan.startDate > today();
    default:
      return isDone;
  }
}

interface Props {
  onCreate?: () => void;
  onOpenPlan?: (planId: number) => void;
}

const PlannerScreen: React.FC<Props> = ({ onCreate, onOpenPlan }) => {
  const [filter, setFilter] = useState<FilterKey>('ongoing');
  const plans = samplePlans.filter(plan => matches(plan, filter));

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
        {plans.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>여기에 보여줄 계획이 없어요</Text>
            <Text style={s.emptyDesc}>
              오른쪽 위 + 생성으로 새 여행을 만들어 보세요.
            </Text>
          </View>
        ) : (
          plans.map(plan => {
            const tone = toneOf(plan);
            return (
              <TouchableOpacity
                key={plan.planId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => onOpenPlan?.(plan.planId)}
              >
                <View style={[s.cardStripe, { backgroundColor: tone }]} />
                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>{plan.travelTitle}</Text>
                  <Text style={s.cardDate}>
                    {formatRange(plan.startDate, plan.endDate)}
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
                          key={member.groupMemberId}
                          nickname={member.nickname}
                          index={i}
                          style={i > 0 && s.avatarOverlap}
                        />
                      ))}
                    </View>
                  </View>

                  <View style={s.cardFooter}>
                    <Text style={s.cardMeta}>{metaOf(plan)}</Text>
                    <Text style={s.chevron}>›</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <Text style={s.note}>
          플래너 API 연동 전이라 예시 데이터로 보여주고 있어요.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PlannerScreen;
