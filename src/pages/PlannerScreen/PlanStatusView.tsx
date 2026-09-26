import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { touch48 } from '../../shared/ui/hitSlop';
import { planStatusStyles as s } from './PlanStatusView.styles';
import colors from '../../shared/tokens/colors';
import CategoryIcon from '../../entities/planner/CategoryIcon';
import MemberAvatar from './MemberAvatar';
import ScheduleDays from './ScheduleDays';
import { MenuAction, PlacePicker, SlotMenu } from './ScheduleEditModals';
import {
  addSlot,
  moveSlot,
  removeSlot,
  setPlace,
  swapPlaces,
  toSaveRequest,
} from '../../entities/planner/scheduleEdit';
import {
  ConfirmedPlace,
  confirmPlanner,
  deletePlanner,
  getConfirmedPlaces,
  getPlanner,
  getPlannerMembers,
  getSchedule,
  PlannerDetail,
  PlannerMember,
  removePlannerMember,
  PlannerSchedule,
  saveSchedule,
  ScheduleSlot,
} from '../../entities/planner/api';
import {
  CATEGORY_LABEL,
  formatRange,
  dayLabel,
  GroupStatus,
  planStatusLabel,
} from '../../entities/planner/types';
import { ChevronLeftIcon } from '../../shared/ui/icons';

/** 일정이 확정된 뒤의 상태. 이때부터 이 화면은 일정표가 된다 */
export function isSchedule(status: GroupStatus): boolean {
  return status === 'CONFIRMED' || status === 'TRAVELING' || status === 'DONE';
}

export interface ScheduleDay {
  key: string;
  /** "1일차 · 10.12". 날짜를 모르면 null 이라 제목을 안 그린다 */
  label: string | null;
  places: ConfirmedPlace[];
}

/** 장소를 정한 칸 수. 하나도 없으면 확정해도 여행카드가 비어 서버가 거부한다 */
export function filledCount(schedule: PlannerSchedule | null): number {
  return (schedule?.days ?? []).reduce(
    (sum, day) => sum + day.slots.filter(slot => slot.place).length,
    0,
  );
}

/**
 * 확정 장소를 날짜별로 묶는다.
 *
 * 날짜를 주는 곳이 하나도 없으면 묶지 않는다. 날짜는 동선 배분(#130)이
 * 붙여주는데, 그 전에 확정된 계획은 visitedDate 가 없다.
 * 날짜가 빠진 장소는 첫날로 본다. 서버가 섞어 보내도 사라지지 않게.
 */
export function groupByDay(
  places: ConfirmedPlace[],
  startDate: string,
): ScheduleDay[] {
  if (!places.some(place => place.visitedDate)) {
    return [{ key: 'all', label: null, places }];
  }

  const byDate = new Map<string, ConfirmedPlace[]>();
  for (const place of places) {
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
      label: dayLabel(startDate, date),
      places: group,
    }));
}

interface Props {
  planId: number;
  onBack?: () => void;
  /** 삭제가 끝나면 목록으로 돌려보낸다. 이 화면은 이미 사라진 플래너를 본다 */
  onDeleted: () => void;
}

/**
 * 우리 여행 계획 (명세 Func-005-06).
 *
 * 확정 전에는 AI 가 짠 일정 카드(server #158)를 보여주고, 그룹장이 확정하면
 * 같은 화면이 날짜별 일정표가 된다. 카드 고치기는 서버 #131 을 기다린다.
 */
const PlanStatusView: React.FC<Props> = ({ planId, onBack, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const [plan, setPlan] = useState<PlannerDetail | null>(null);
  // 확정 후에만 채운다. 확정 전에 부르면 서버가 400 을 준다
  const [schedule, setSchedule] = useState<ConfirmedPlace[] | null>(null);
  // 확정 전에만 채운다. AI 초안 카드
  const [draft, setDraft] = useState<PlannerSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [members, setMembers] = useState<PlannerMember[]>([]);
  // 내보내는 중인 멤버. 연타로 같은 요청이 두 번 나가는 것을 막는다
  const [removing, setRemoving] = useState<string | null>(null);
  // ── 일정 카드 고치기 (Func-011-03) ──
  const [saving, setSaving] = useState(false);
  const [swapping, setSwapping] = useState<number | null>(null);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [menu, setMenu] = useState<{
    title: string;
    actions: MenuAction[];
  } | null>(null);
  const [picking, setPicking] = useState<{
    slotId: number;
    date: string;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const detail = await getPlanner(planId);
          const confirmed = isSchedule(detail.status);
          const [final, cards, people] = await Promise.all([
            confirmed ? getConfirmedPlaces(planId).catch(() => null) : null,
            confirmed ? null : getSchedule(planId).catch(() => null),
            // 초대 링크를 보내고 돌아오면 화면이 다시 포커스되며 새로 받는다
            getPlannerMembers(planId).catch(() => []),
          ]);
          if (alive) {
            setPlan(detail);
            setSchedule(final?.places ?? null);
            setDraft(cards);
            setMembers(people);
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

  const applyEdit = async (next: PlannerSchedule) => {
    const before = draft;
    setDraft(next);
    setSaving(true);
    try {
      setDraft(await saveSchedule(planId, toSaveRequest(next)));
    } catch (e: any) {
      setDraft(before);
      Alert.alert(
        '저장하지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setSaving(false);
    }
  };

  const openMenu = (
    slot: ScheduleSlot,
    date: string,
    index: number,
    count: number,
  ) => {
    if (!draft) {
      return;
    }
    const actions: MenuAction[] = [];
    if (index > 0) {
      actions.push({
        label: '위로 옮기기',
        onPress: () => applyEdit(moveSlot(draft, date, index, index - 1)),
      });
    }
    if (index < count - 1) {
      actions.push({
        label: '아래로 옮기기',
        onPress: () => applyEdit(moveSlot(draft, date, index, index + 1)),
      });
    }
    actions.push({
      label: '다른 칸과 바꾸기',
      onPress: () => setSwapping(slot.slotId),
    });
    if (slot.place) {
      actions.push({
        label: '다른 장소로 바꾸기',
        onPress: () => setPicking({ slotId: slot.slotId, date }),
      });
      actions.push({
        label: '장소 비우기',
        onPress: () => applyEdit(setPlace(draft, slot.slotId, null)),
      });
    }
    actions.push({
      label: '칸 지우기',
      danger: true,
      onPress: () => applyEdit(removeSlot(draft, slot.slotId)),
    });
    setMenu({
      title: slot.place ? slot.place.name : `${slot.order}번째 빈 칸`,
      actions,
    });
  };

  // 확정하면 여행카드가 만들어지고 카드를 더 고칠 수 없다. 한 번 묻는다
  const confirmSchedule = () =>
    Alert.alert(
      '이 일정으로 확정할까요?',
      '확정하면 여행카드가 만들어지고, 일정은 더 고칠 수 없어요.\n빈 칸은 빼고 확정돼요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확정',
          onPress: async () => {
            setConfirming(true);
            try {
              await confirmPlanner(planId);
              // 확정되면 같은 화면이 일정표로 바뀐다
              const [detail, final] = await Promise.all([
                getPlanner(planId),
                getConfirmedPlaces(planId).catch(() => null),
              ]);
              setPlan(detail);
              setSchedule(final?.places ?? null);
              setDraft(null);
            } catch (e: any) {
              Alert.alert(
                '확정하지 못했어요',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
            } finally {
              setConfirming(false);
            }
          },
        },
      ],
    );

  // 초안이 나온 뒤에 부른다(명세 Func-005-01). 링크만 보낸다 — 안내 문구를
  // 붙이면 '복사' 했을 때 문구까지 딸려가 받은 사람이 링크를 떼어내야 한다
  const invite = async () => {
    if (!plan?.inviteLink) {
      Alert.alert(
        '알림',
        '초대 링크를 받지 못했어요. 잠시 후 다시 시도해주세요.',
      );
      return;
    }
    try {
      await Share.share({ message: plan.inviteLink });
    } catch {
      Alert.alert('초대 링크', plan.inviteLink);
    }
  };

  // 되돌릴 수 없어서 한 번 묻는다. 서버는 그룹장만 받아준다(API-005-22)
  const confirmRemove = (member: PlannerMember) =>
    Alert.alert(
      '멤버 내보내기',
      `${member.nickName}님을 내보낼까요?\n다시 들어오려면 초대가 필요해요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '내보내기',
          style: 'destructive',
          onPress: async () => {
            setRemoving(member.userId);
            try {
              await removePlannerMember(planId, member.userId);
              setMembers(prev => prev.filter(m => m.userId !== member.userId));
            } catch (e: any) {
              Alert.alert(
                '내보내지 못했어요',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
            } finally {
              setRemoving(null);
            }
          },
        },
      ],
    );

  // 되돌릴 수 없어서 한 번 묻는다. 서버는 그룹장만 받아준다(API-005-12).
  const confirmDelete = () =>
    Alert.alert(
      '플래너 삭제',
      `"${
        plan?.title ?? ''
      }" 을(를) 삭제할까요?\n멤버와 일정도 함께 사라져요. 되돌릴 수 없어요.`,
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
              onDeleted();
            } catch (e: any) {
              Alert.alert(
                '삭제 실패',
                e?.message ?? '잠시 후 다시 시도해주세요.',
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
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
        <TouchableOpacity onPress={onBack} hitSlop={12} style={s.errorBack}>
          <View style={s.back}>
            <ChevronLeftIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
        <View style={s.errorBox}>
          <Text style={s.errorText}>계획을 불러오지 못했어요</Text>
        </View>
      </SafeAreaView>
    );
  }

  const confirmed = isSchedule(plan.status);

  const days =
    schedule && plan.startDate ? groupByDay(schedule, plan.startDate) : [];

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
        plan.title,
        plan.startDate && plan.endDate
          ? formatRange(plan.startDate, plan.endDate)
          : '',
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
        scrollEnabled={!scrollLocked}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <View style={s.back}>
              <ChevronLeftIcon size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={1}>
              {plan.title}
            </Text>
            <View
              style={[
                s.statusPill,
                {
                  backgroundColor: confirmed ? colors.success : colors.accent,
                },
              ]}
            >
              <Text style={s.statusText}>{planStatusLabel(plan.status)}</Text>
            </View>
          </View>
          <Text style={s.meta}>
            {plan.startDate && plan.endDate
              ? `${formatRange(plan.startDate, plan.endDate)} · `
              : ''}
            {members.length || plan.joinedMemberCount}/{plan.memberCount}명
          </Text>
        </SafeAreaView>

        {/* 혼자 여행이면 초대할 사람이 없다 */}
        {plan.memberCount > 1 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>
              함께할 사람 {members.length}/{plan.memberCount}명
            </Text>
            {members.map((member, i) => (
              <View key={member.userId} style={s.row}>
                <MemberAvatar nickname={member.nickName} index={i} size={36} />
                <View style={s.rowBody}>
                  <Text style={s.rowTitle}>{member.nickName}</Text>
                  <Text style={s.rowSub}>
                    {member.role === 'OWNER' ? '리더' : '참여 완료'}
                  </Text>
                </View>
                {/* 그룹장만 내보낸다. 자기 자신 줄에는 안 보인다. 참여는 확정 전까지만 받는다 */}
                {plan.role === 'OWNER' &&
                  member.role !== 'OWNER' &&
                  !confirmed && (
                    <TouchableOpacity
                      hitSlop={touch48(24)}
                      accessibilityRole="button"
                      accessibilityLabel={`${member.nickName} 내보내기`}
                      disabled={removing !== null}
                      onPress={() => confirmRemove(member)}
                    >
                      <Text style={s.removeText}>
                        {removing === member.userId ? '…' : '내보내기'}
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            ))}
            {/* 서버는 확정 전(PLANNING)에만, 정원 안에서만 참여를 받는다 */}
            {plan.role === 'OWNER' &&
              !confirmed &&
              members.length < plan.memberCount && (
                <TouchableOpacity
                  style={s.inviteBtn}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  onPress={invite}
                >
                  <Text style={s.inviteText}>+ 링크로 초대하기</Text>
                </TouchableOpacity>
              )}
          </View>
        )}

        {confirmed ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>확정된 일정</Text>

            {schedule === null ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>일정을 불러오지 못했어요</Text>
              </View>
            ) : schedule.length === 0 ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>확정된 장소가 없어요</Text>
              </View>
            ) : (
              days.map(day => (
                <View key={day.key}>
                  {!!day.label && <Text style={s.dayTitle}>{day.label}</Text>}
                  {day.places.map((item, i) => (
                    // 같은 장소가 다른 날 또 나올 수 있어 순서까지 붙인다
                    <View key={`${item.tourPlaceId}-${i}`} style={s.row}>
                      <View style={s.thumb}>
                        <CategoryIcon
                          category={item.category}
                          color={colors.primary}
                        />
                      </View>
                      <View style={s.rowBody}>
                        <Text style={s.rowSub}>
                          {CATEGORY_LABEL[item.category]}
                        </Text>
                        <Text style={s.rowTitle} numberOfLines={1}>
                          {item.placeName}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}

            {!!schedule && schedule.length > 0 && (
              <TouchableOpacity
                style={s.shareBtn}
                activeOpacity={0.85}
                onPress={share}
              >
                <Text style={s.shareText}>일정 공유하기</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={s.section}>
            <Text style={s.sectionTitle}>AI가 짠 일정</Text>

            {plan.role === 'OWNER' && !!draft && (
              <Text style={s.editHint}>
                {swapping !== null
                  ? '바꿀 칸을 눌러주세요'
                  : '빈 칸을 눌러 장소를 고르고, 오른쪽 손잡이를 끌거나 눌러 옮겨요'}
              </Text>
            )}
            {swapping !== null && (
              <TouchableOpacity
                style={s.swapCancel}
                accessibilityRole="button"
                onPress={() => setSwapping(null)}
              >
                <Text style={s.swapCancelText}>바꾸기 취소</Text>
              </TouchableOpacity>
            )}

            {!draft ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>일정을 불러오지 못했어요</Text>
              </View>
            ) : plan.role !== 'OWNER' &&
              draft.days.every(day => day.slots.length === 0) ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>아직 일정이 없어요</Text>
              </View>
            ) : (
              <ScheduleDays
                schedule={draft}
                // 리더만 고친다(server #131). 멤버 · 보호자는 보기만
                edit={
                  plan.role === 'OWNER'
                    ? {
                        disabled: saving,
                        swapping,
                        onPick: (slot, date) =>
                          setPicking({ slotId: slot.slotId, date }),
                        onMenu: openMenu,
                        onMove: (date, from, to) =>
                          applyEdit(moveSlot(draft, date, from, to)),
                        onSwapTarget: slot => {
                          if (swapping !== null) {
                            applyEdit(swapPlaces(draft, swapping, slot.slotId));
                          }
                          setSwapping(null);
                        },
                        onAdd: date => applyEdit(addSlot(draft, date)),
                        onDragging: setScrollLocked,
                      }
                    : undefined
                }
              />
            )}

            {plan.role === 'OWNER' && filledCount(draft) > 0 ? (
              <TouchableOpacity
                style={s.confirmBtn}
                activeOpacity={0.85}
                accessibilityRole="button"
                disabled={confirming}
                onPress={confirmSchedule}
              >
                {confirming ? (
                  <ActivityIndicator color={colors.textOnPrimary} />
                ) : (
                  <Text style={s.confirmText}>이 일정으로 확정하기</Text>
                )}
              </TouchableOpacity>
            ) : plan.role !== 'OWNER' && filledCount(draft) > 0 ? (
              <Text style={s.note}>리더가 확정하면 일정표가 돼요.</Text>
            ) : null}
          </View>
        )}

        {plan.role === 'OWNER' && (
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

      <SlotMenu
        title={menu?.title ?? null}
        actions={menu?.actions ?? []}
        onClose={() => setMenu(null)}
      />
      <PlacePicker
        plannerId={planId}
        date={picking?.date ?? null}
        title={
          picking && draft
            ? `${dayLabel(draft.startDate, picking.date)} 장소 고르기`
            : ''
        }
        onPick={place => {
          if (picking && draft) {
            applyEdit(setPlace(draft, picking.slotId, place));
          }
        }}
        onClose={() => setPicking(null)}
      />
    </View>
  );
};

export default PlanStatusView;
