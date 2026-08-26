import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import {
  getPlanner,
  getVotes,
  PlannerDetail,
  VoteStatusInfo,
} from '../../entities/planner/api';
import {
  CATEGORIES,
  CATEGORY_LABEL,
  formatRange,
  PlaceCategory,
  planStatusLabel,
} from '../../entities/planner/types';

type RowState = 'confirmed' | 'voting' | 'none';

interface CategoryRow {
  category: PlaceCategory;
  state: RowState;
  sub: string;
  color: string;
  /** 진행 막대 비율 0 ~ 1 */
  ratio: number;
  pill: string;
}

function buildRow(
  category: PlaceCategory,
  vote: VoteStatusInfo | undefined,
): CategoryRow {
  if (!vote || vote.options.length === 0) {
    return {
      category,
      state: 'none',
      sub: '후보 없음',
      color: colors.textTertiary,
      ratio: 0,
      pill: '미정',
    };
  }

  if (vote.status === 'CONFIRMED') {
    const confirmed = vote.options.find(
      option => option.optionId === vote.confirmedOptionId,
    );
    return {
      category,
      state: 'confirmed',
      sub: confirmed?.placeName ?? '확정됨',
      color: colors.success,
      ratio: 1,
      pill: '확정',
    };
  }

  // 몇 명이 투표했는지는 서버가 세어서 내려준다
  const { votedMemberCount: voted, eligibleMemberCount: total } = vote;
  return {
    category,
    state: 'voting',
    sub: `투표 중 · ${voted}/${total}`,
    color: colors.accent,
    ratio: total > 0 ? voted / total : 0,
    pill: '진행',
  };
}

interface Props {
  planId: number;
  onBack?: () => void;
  onOpenVote?: (category: PlaceCategory, voteId?: number) => void;
}

const PlanStatusView: React.FC<Props> = ({ planId, onBack, onOpenVote }) => {
  const [plan, setPlan] = useState<PlannerDetail | null>(null);
  const [votes, setVotes] = useState<VoteStatusInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const [detail, voteList] = await Promise.all([
            getPlanner(planId),
            getVotes(planId).catch(() => []),
          ]);
          if (alive) {
            setPlan(detail);
            setVotes(voteList);
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

  const rows = CATEGORIES.map(category =>
    buildRow(
      category,
      votes.find(vote => vote.category === category),
    ),
  );

  const summary = [
    {
      label: '확정',
      value: rows.filter(row => row.state === 'confirmed').length,
      color: colors.success,
    },
    {
      label: '투표 중',
      value: rows.filter(row => row.state === 'voting').length,
      color: colors.accent,
    },
    {
      label: '미정',
      value: rows.filter(row => row.state === 'none').length,
      color: colors.textTertiary,
    },
  ];

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
            <View style={[s.statusPill, { backgroundColor: colors.accent }]}>
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

        <View style={s.summaryCard}>
          {summary.map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={s.summaryDivider} />}
              <View style={s.summaryCol}>
                <Text style={[s.summaryValue, { color: item.color }]}>
                  {item.value}
                </Text>
                <Text style={s.summaryLabel}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>카테고리별 현황</Text>

          {rows.map(row => (
            <TouchableOpacity
              key={row.category}
              style={s.row}
              activeOpacity={0.85}
              onPress={() =>
                onOpenVote?.(
                  row.category,
                  votes.find(v => v.category === row.category)?.voteId,
                )
              }
            >
              <View style={[s.dot, { backgroundColor: row.color }]} />
              <View style={s.rowBody}>
                <Text style={s.rowTitle}>{CATEGORY_LABEL[row.category]}</Text>
                <Text style={s.rowSub} numberOfLines={1}>
                  {row.sub}
                </Text>
                <View style={s.track}>
                  <View
                    style={[
                      s.fill,
                      {
                        width: `${row.ratio * 100}%`,
                        backgroundColor: row.color,
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={s.rowPill}>
                <Text style={[s.rowPillText, { color: row.color }]}>
                  {row.pill}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default PlanStatusView;
