import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { plannerStyles as s } from './PlannerScreen.styles';
import MemberAvatar from './MemberAvatar';
import colors from '../../shared/tokens/colors';
import {
  getPlanners,
  getPlannerMembers,
  joinPlanner,
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

/**
 * 붙여넣은 값에서 초대 코드만 꺼낸다.
 *
 * 사람들이 주고받는 것은 코드가 아니라 링크다
 * (http://.../planner/group?inviteCode=OSK-4821).
 * 링크를 통째로 붙여넣어도 되게 해야 "코드만 골라 적으세요" 를 안 시킨다.
 * 대소문자는 서버가 맞춰준다(PlannerMemberService.joinPlanner).
 */
export function extractInviteCode(input: string): string {
  const text = input.trim();
  const found = text.match(/[?&]inviteCode=([^&#\s]+)/i);
  if (!found) {
    return text;
  }
  try {
    return decodeURIComponent(found[1]);
  } catch {
    // 잘못 인코딩된 링크라도 코드 자리는 그대로 써본다
    return found[1];
  }
}

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
  // 초대 링크·코드로 참여하기 (API-005-13)
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const [joining, setJoining] = useState(false);
  // 삭제가 끝나기 전에 다시 누르면 같은 DELETE 가 두 번 나간다.
  // 두 번째는 서버가 거부해서, 첫 번째가 성공했는데도 실패 알림이 뜬다.
  //

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

  // 잘못된 코드 · 이미 참여 · 정원 초과는 모두 서버가 문구까지 준다.
  // 여기서 다시 쓰면 서버가 거절한 진짜 이유를 덮어버린다.
  const join = async () => {
    const code = extractInviteCode(joinInput);
    if (!code || joining) {
      return;
    }
    setJoining(true);
    try {
      const joined = await joinPlanner(code);
      setJoinOpen(false);
      setJoinInput('');
      onOpenPlan?.(joined.plannerId, joined.status);
    } catch (e: any) {
      Alert.alert('참여 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setJoining(false);
    }
  };

  const plans = (rows ?? []).filter(plan => matches(plan, filter));

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>플래너</Text>
          <View style={s.headerBtns}>
            <TouchableOpacity
              style={s.joinBtn}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="초대 코드로 참여하기"
              onPress={() => setJoinOpen(true)}
            >
              <Text style={s.joinText}>참여하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.createBtn}
              activeOpacity={0.85}
              onPress={onCreate}
            >
              <Text style={s.createText}>+ 생성</Text>
            </TouchableOpacity>
          </View>
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
              // 카드 안에 삭제 버튼을 넣으면 touchable 이 겹쳐서
              // 보이스오버·토크백이 삭제를 따로 못 짚는다. 형제로 둔다.
              <View key={plan.plannerId} style={s.card}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`${plan.title} 열기`}
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
                      <Text style={s.chevron}>›</Text>
                    </View>
                  </View>
                </TouchableOpacity>

              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={joinOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinOpen(false)}
      >
        <View style={s.modalBack}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>초대로 참여하기</Text>
            <Text style={s.modalDesc}>
              받은 초대 링크를 그대로 붙여넣어도 돼요.
            </Text>
            <TextInput
              style={s.modalInput}
              placeholder="초대 코드 또는 링크"
              placeholderTextColor={colors.placeholder}
              value={joinInput}
              onChangeText={setJoinInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={join}
              editable={!joining}
            />
            <View style={s.modalBtns}>
              <TouchableOpacity
                style={s.modalCancel}
                activeOpacity={0.85}
                disabled={joining}
                onPress={() => setJoinOpen(false)}
              >
                <Text style={s.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.modalOk, !joinInput.trim() && s.modalOkOff]}
                activeOpacity={0.85}
                disabled={joining || !joinInput.trim()}
                onPress={join}
              >
                {joining ? (
                  <ActivityIndicator size="small" color={colors.textOnPrimary} />
                ) : (
                  <Text style={s.modalOkText}>참여하기</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PlannerScreen;
