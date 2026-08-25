import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planConfirmStyles as s } from './PlanConfirmView.styles';
import MemberAvatar from './MemberAvatar';
import { samplePlanOf, sampleVotesOf } from '../../entities/planner/sampleData';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatShortDate,
  PlaceCategory,
  votedMemberCount,
} from '../../entities/planner/types';

interface ConfirmedPlace {
  category: PlaceCategory;
  placeName: string;
  voteCount: number;
}

interface Props {
  planId: number;
  onBack?: () => void;
  onStart?: () => void;
}

const PlanConfirmView: React.FC<Props> = ({ planId, onBack, onStart }) => {
  const plan = samplePlanOf(planId);
  const votes = sampleVotesOf(planId);

  // 확정된 후보가 있으면 그걸, 아직이면 최다 득표를 그 카테고리의 결과로 본다
  const confirmed: ConfirmedPlace[] = votes
    .filter(vote => vote.options.length > 0)
    .map(vote => {
      const winner =
        vote.options.find(
          option => option.optionId === vote.confirmedOptionId,
        ) ??
        vote.options.reduce((best, option) =>
          option.voterIds.length > best.voterIds.length ? option : best,
        );
      return {
        category: vote.category,
        placeName: winner.placeName,
        voteCount: winner.voterIds.length,
      };
    });

  const voted = votedMemberCount(votes);
  const allVoted = voted >= plan.headcount;

  const share = () => {
    const lines = confirmed.map(
      item => `· ${CATEGORY_LABEL[item.category]} — ${item.placeName}`,
    );
    Share.share({
      message: [
        `${plan.travelTitle}`,
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
          <Text style={s.cardTitle}>{plan.travelTitle}</Text>
          <Text style={s.cardDate}>
            {plan.startDate.replace(/-/g, '.')} – {formatShortDate(plan.endDate)}
          </Text>
          <View style={s.cardMembers}>
            <View style={s.avatars}>
              {plan.members.map((member, i) => (
                <MemberAvatar
                  key={member.groupMemberId}
                  nickname={member.nickname}
                  index={i}
                  size={28}
                  style={i > 0 && s.avatarOverlap}
                />
              ))}
            </View>
            <Text style={s.cardMeta}>
              {allVoted
                ? `${plan.headcount}명 모두 참여`
                : `${voted}/${plan.headcount}명 참여`}
            </Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>확정된 일정</Text>

          {confirmed.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>아직 확정된 장소가 없어요.</Text>
            </View>
          ) : (
            confirmed.map(item => (
              <View key={item.category} style={s.row}>
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
