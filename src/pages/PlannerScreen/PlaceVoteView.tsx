import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { placeVoteStyles as s } from './PlaceVoteView.styles';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import {
  ME_USER_ID,
  samplePlanOf,
  sampleVotesOf,
} from '../../entities/planner/sampleData';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatDeadline,
  PlaceCategory,
  Vote,
  VoteStatus,
} from '../../entities/planner/types';

function statusMeta(status: VoteStatus): { text: string; color: string } {
  switch (status) {
    case 'OPEN':
      return { text: '진행 중', color: colors.accent };
    case 'CONFIRMED':
      return { text: '확정', color: colors.success };
    default:
      return { text: '마감', color: colors.textTertiary };
  }
}

interface Props {
  planId: number;
  /** 어느 카테고리로 열지. 없으면 아직 진행 중인 첫 카테고리를 연다 */
  category?: PlaceCategory;
  onBack?: () => void;
  /** 마지막 카테고리까지 넘기면 최종 확인(C8)으로 간다 */
  onDone?: () => void;
}

const PlaceVoteView: React.FC<Props> = ({
  planId,
  category,
  onBack,
  onDone,
}) => {
  const plan = samplePlanOf(planId);
  const [votes, setVotes] = useState<Vote[]>(() => sampleVotesOf(planId));
  const [current, setCurrent] = useState<PlaceCategory>(
    () =>
      category ??
      votes.find(vote => vote.status === 'OPEN' && vote.options.length > 0)
        ?.category ??
      CATEGORIES[0],
  );

  const vote = votes.find(item => item.category === current);
  const options = vote?.options ?? [];
  const status = vote?.status ?? 'OPEN';
  const meta = statusMeta(status);

  const myOptionId =
    options.find(option => option.voterIds.includes(ME_USER_ID))?.optionId ??
    null;
  const voterCount = new Set(
    options.flatMap(option => option.voterIds),
  ).size;
  const topCount = options.reduce(
    (max, option) => Math.max(max, option.voterIds.length),
    0,
  );

  // 한 카테고리에 한 표만 던질 수 있다 (서버 vote_record 의 uk_vote_record_vote_user)
  const castVote = (optionId: number) =>
    setVotes(prev =>
      prev.map(item =>
        item.category !== current
          ? item
          : {
              ...item,
              options: item.options.map(option => {
                const others = option.voterIds.filter(id => id !== ME_USER_ID);
                const keepMine =
                  option.optionId === optionId && option.optionId !== myOptionId;
                return {
                  ...option,
                  voterIds: keepMine ? [...others, ME_USER_ID] : others,
                };
              }),
            },
      ),
    );

  const goNext = () => {
    const index = CATEGORIES.indexOf(current);
    if (index < CATEGORIES.length - 1) {
      setCurrent(CATEGORIES[index + 1]);
      return;
    }
    onDone?.();
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={s.title}>{CATEGORY_LABEL[current]} 투표</Text>
          <View style={[s.statusPill, { backgroundColor: meta.color }]}>
            <Text style={s.statusText}>{meta.text}</Text>
          </View>
        </View>
        <Text style={s.subtitle}>
          {voterCount} / {plan.headcount}명 참여 ·{' '}
          {formatDeadline(vote?.deadline ?? null)} 마감
        </Text>
      </SafeAreaView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
        style={s.chipScroll}
      >
        {CATEGORIES.map(key => {
          const on = key === current;
          return (
            <TouchableOpacity
              key={key}
              style={[s.chip, on && s.chipOn]}
              activeOpacity={0.85}
              onPress={() => setCurrent(key)}
            >
              <Text style={[s.chipText, on && s.chipTextOn]}>
                {CATEGORY_LABEL[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {options.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>아직 담긴 후보가 없어요</Text>
            <Text style={s.emptyDesc}>
              장소 둘러보기에서 후보를 담으면 투표를 시작할 수 있어요.
            </Text>
          </View>
        ) : (
          options.map(option => {
            const mine = option.optionId === myOptionId;
            const count = option.voterIds.length;
            const leading = count > 0 && count === topCount;
            return (
              <View
                key={option.optionId}
                style={[s.card, mine && s.cardOn]}
              >
                <View style={s.cardTop}>
                  <View style={s.thumb}>
                    <Text style={s.thumbEmoji}>{CATEGORY_EMOJI[current]}</Text>
                  </View>
                  <View style={s.body}>
                    <Text style={s.name} numberOfLines={1}>
                      {option.placeName}
                    </Text>
                    <View style={s.countRow}>
                      <Text style={s.count}>{count}표</Text>
                      <View style={s.voters}>
                        {option.voterIds.map((userId, i) => {
                          const member = plan.members.find(
                            item => item.userId === userId,
                          );
                          return (
                            <MemberAvatar
                              key={userId}
                              nickname={member?.nickname ?? userId}
                              index={i}
                              size={24}
                              style={i > 0 && s.voterOverlap}
                            />
                          );
                        })}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      s.voteBtn,
                      mine && s.voteBtnOn,
                      status !== 'OPEN' && s.voteBtnOff,
                    ]}
                    activeOpacity={0.85}
                    disabled={status !== 'OPEN'}
                    onPress={() => castVote(option.optionId)}
                  >
                    <Text style={[s.voteText, mine && s.voteTextOn]}>
                      {mine ? '투표함' : '투표'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={s.track}>
                  <View
                    style={[
                      s.fill,
                      {
                        width: `${(count / plan.headcount) * 100}%`,
                        backgroundColor: leading
                          ? colors.primary
                          : colors.textTertiary,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          onPress={goNext}
        >
          <Text style={s.primaryText}>
            {current === CATEGORIES[CATEGORIES.length - 1]
              ? '투표 마치기'
              : '다음 카테고리'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlaceVoteView;
