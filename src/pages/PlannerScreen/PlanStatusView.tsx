import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import type { ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import {
  deletePlanner,
  getPlanner,
  getVotes,
  remindVotes,
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
  color: ColorValue;
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
  /** 삭제가 끝나면 목록으로 돌려보낸다. 이 화면은 이미 사라진 플래너를 본다 */
  onDeleted?: () => void;
}

const PlanStatusView: React.FC<Props> = ({
  planId,
  onBack,
  onOpenVote,
  onDeleted,
}) => {
  const [deleting, setDeleting] = useState(false);
  const [reminding, setReminding] = useState(false);
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

  // 되돌릴 수 없어서 한 번 묻는다. 서버는 그룹장만 받아준다(API-005-12).
  const confirmDelete = () =>
    Alert.alert(
      '플래너 삭제',
      `"${
        plan?.title ?? ''
      }" 을(를) 삭제할까요?\n투표와 멤버도 함께 사라져요. 되돌릴 수 없어요.`,
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
              onDeleted?.();
            } catch (e: any) {
              Alert.alert(
                '삭제 실패',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
              setDeleting(false);
            }
          },
        },
      ],
    );

  // 누를 때마다 팀원 전원에게 알림이 나간다. 요청이 끝날 때까지 잠근다.
  const handleRemind = async () => {
    setReminding(true);
    try {
      const result = await remindVotes(planId);
      // 전원이 투표를 마쳤으면 notifiedCount 가 0 이다. 서버 문구를 그대로 쓴다.
      Alert.alert('투표 독촉', result.message);
    } catch (e: any) {
      Alert.alert(
        '보내지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setReminding(false);
    }
  };

  // 서버는 열린 투표가 하나도 없으면 독촉을 거부한다(VoteReminderService)
  const hasOpenVote = votes.some(vote => vote.status === 'OPEN');

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

        {/* 독촉·삭제는 그룹장만 할 수 있다. 멤버에게 보여주면 눌러도 서버가
            거부하는 버튼이 된다. */}
        {plan?.role === 'OWNER' && (
          <TouchableOpacity
            style={[s.remindBtn, !hasOpenVote && s.remindBtnDisabled]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="투표 독촉하기"
            // 열린 투표가 없으면 서버가 거부한다. 미리 막는다.
            disabled={reminding || !hasOpenVote}
            onPress={handleRemind}
          >
            {reminding ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text
                style={[s.remindText, !hasOpenVote && s.remindTextDisabled]}
              >
                {hasOpenVote ? '투표 독촉하기' : '진행 중인 투표가 없어요'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {plan?.role === 'OWNER' && (
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
