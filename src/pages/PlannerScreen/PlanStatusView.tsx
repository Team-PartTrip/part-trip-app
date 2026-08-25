import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import { samplePlanOf, sampleVotesOf } from '../../entities/planner/sampleData';
import {
  CATEGORIES,
  CATEGORY_LABEL,
  formatRange,
  PlaceCategory,
  planStatusLabel,
  Vote,
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
  vote: Vote | undefined,
  headcount: number,
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

  const voted = new Set(vote.options.flatMap(option => option.voterIds)).size;
  return {
    category,
    state: 'voting',
    sub: `투표 중 · ${voted}/${headcount}`,
    color: colors.accent,
    ratio: headcount > 0 ? voted / headcount : 0,
    pill: '진행',
  };
}

interface Props {
  planId: number;
  onBack?: () => void;
  onOpenVote?: (category: PlaceCategory) => void;
}

const PlanStatusView: React.FC<Props> = ({ planId, onBack, onOpenVote }) => {
  const plan = samplePlanOf(planId);
  const votes = sampleVotesOf(planId);
  const rows = CATEGORIES.map(category =>
    buildRow(
      category,
      votes.find(vote => vote.category === category),
      plan.headcount,
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
              {plan.travelTitle}
            </Text>
            <View style={[s.statusPill, { backgroundColor: colors.accent }]}>
              <Text style={s.statusText}>{planStatusLabel(plan.status)}</Text>
            </View>
          </View>
          <Text style={s.meta}>
            {formatRange(plan.startDate, plan.endDate)} · {plan.headcount}명
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
              onPress={() => onOpenVote?.(row.category)}
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

        <Text style={s.note}>
          플래너 API 연동 전이라 예시 데이터로 보여주고 있어요.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PlanStatusView;
