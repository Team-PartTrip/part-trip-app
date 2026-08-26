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

const PlanConfirmView: React.FC<Props> = ({ planId, onBack, onStart }) => {
  const [plan, setPlan] = useState<PlannerFinal | null>(null);
  const [members, setMembers] = useState<PlannerMember[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const [final, memberList] = await Promise.all([
            getConfirmedPlaces(planId),
            getPlannerMembers(planId).catch(() => []),
          ]);
          if (alive) {
            setPlan(final);
            setMembers(memberList);
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
        <View style={s.backRow}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={s.empty}>
          <Text style={s.emptyText}>확정 결과를 불러오지 못했어요.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const confirmed = plan.places;

  const share = () => {
    const lines = confirmed.map(
      item => `· ${CATEGORY_LABEL[item.category]} — ${item.placeName}`,
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
            confirmed.map(item => (
              <View key={item.voteId} style={s.row}>
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
