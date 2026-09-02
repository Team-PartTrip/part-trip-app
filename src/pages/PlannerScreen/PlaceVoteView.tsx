import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import type { ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { placeVoteStyles as s } from './PlaceVoteView.styles';
import colors from '../../shared/tokens/colors';
import {
  addVoteOption,
  castBallot,
  confirmPlanner,
  createVote,
  getPlanner,
  getVotes,
  VoteSelection,
  VoteStatusInfo,
} from '../../entities/planner/api';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatDeadline,
  PlaceCategory,
  VoteStatus,
} from '../../entities/planner/types';

function statusMeta(status: VoteStatus): { text: string; color: ColorValue } {
  switch (status) {
    case 'OPEN':
      return { text: '진행 중', color: colors.accent };
    case 'CONFIRMED':
      return { text: '확정', color: colors.success };
    default:
      return { text: '마감', color: colors.textTertiary };
  }
}

/**
 * 공동 1위 후보들. 하나뿐이면 동점이 아니다.
 *
 * 서버는 마감할 때 같은 계산을 하고, 동점인데 고른 것이 없으면 확정을
 * 거부한다(PlannerConfirmService). 그래서 보내기 전에 여기서 먼저 묻는다.
 * 아무도 투표하지 않은 카테고리는 후보가 모두 0표라 늘 동점이 된다.
 */
function tiedOptions(vote: VoteStatusInfo) {
  if (vote.options.length === 0) {
    return [];
  }
  const top = vote.options.reduce((max, o) => Math.max(max, o.voteCount), 0);
  const leaders = vote.options.filter(o => o.voteCount === top);
  return leaders.length > 1 ? leaders : [];
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
  const [votes, setVotes] = useState<VoteStatusInfo[]>([]);
  const [current, setCurrent] = useState<PlaceCategory | null>(
    category ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // 관광지 목록에 없는 곳을 직접 후보로 넣을 때 쓴다 (API-005-27)
  const [newPlace, setNewPlace] = useState('');
  const [adding, setAdding] = useState(false);
  // 동점이라 그룹장이 골라줘야 하는 투표들. 앞에서부터 하나씩 묻는다
  const [tieQueue, setTieQueue] = useState<VoteStatusInfo[]>([]);
  /**
   * 남은 동점과 지금까지 고른 것은 ref 가 정본이다.
   *
   * state 만 쓰면 화면이 다시 그려지기 전까지 두 번째 터치도 첫 번째와
   * 같은 값을 본다. 마지막 동점에서 빠르게 두 번 누르면 확정 요청이
   * 두 번 나가고, 두 번째는 이미 확정된 플래너를 건드린다.
   */
  const tieQueueRef = useRef<VoteStatusInfo[]>([]);
  const pickedRef = useRef<VoteSelection[]>([]);
  /** 요청이 나가는 동안 다시 못 누르게 막는다. state 는 한 박자 늦다 */
  const busyRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const list = await getVotes(planId);
          if (!alive) {
            return;
          }
          setVotes(list);
          // 어느 카테고리로 열지 정하지 않았으면 후보가 있는 진행 중 투표를 연다.
          // 마감이 지난 투표는 status 가 아직 OPEN 이어도 열지 않는다.
          // 열어봐야 버튼이 전부 막혀 있어 사용자가 직접 옮겨야 한다.
          setCurrent(
            prev =>
              prev ??
              list.find(
                v =>
                  v.status === 'OPEN' &&
                  !v.deadlinePassed &&
                  v.options.length > 0,
              )?.category ??
              CATEGORIES[0],
          );
        } catch {
          if (alive) {
            setVotes([]);
            setCurrent(prev => prev ?? CATEGORIES[0]);
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

  const active = current ?? CATEGORIES[0];
  const vote = votes.find(item => item.category === active);
  const options = vote?.options ?? [];
  const status = vote?.status ?? 'OPEN';
  // 마감 시각이 지나도 status 는 한동안 OPEN 으로 남는다. 그 사이에 누르면
  // 서버가 거부해서 실패 Alert 만 보게 되므로 여기서 먼저 막는다.
  const closed = status !== 'OPEN' || !!vote?.deadlinePassed;
  // 버튼을 막았으면 배지도 '마감' 이어야 한다. '진행 중' 인데 못 누르면
  // 사용자는 고장으로 읽는다.
  const meta = statusMeta(closed && status === 'OPEN' ? 'CLOSED' : status);
  const eligible = vote?.eligibleMemberCount ?? 0;

  const myOptionId =
    options.find(option => option.selectedByMe)?.optionId ?? null;
  const topCount = options.reduce(
    (max, option) => Math.max(max, option.voteCount),
    0,
  );

  // 한 카테고리에 한 표만 던질 수 있다 (서버 vote_record 의 uk_vote_record_vote_user).
  // 서버가 갱신된 현황을 따로 주지 않아서, 성공하면 목록을 다시 받는다.
  const castVote = async (optionId: number) => {
    if (!vote || sending) {
      return;
    }
    try {
      setSending(true);
      await castBallot(planId, vote.voteId, optionId);
      setVotes(await getVotes(planId));
    } catch (e: any) {
      Alert.alert('투표 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  /**
   * 이름만으로 후보를 넣는다.
   *
   * 장바구니에 담긴 장소가 없는 카테고리는 투표 자체가 없어서, 먼저 만든다.
   * 투표 만들기는 그룹장만 되므로 멤버에게는 그룹장에게 요청하도록 안내한다.
   */
  const addPlace = async () => {
    const name = newPlace.trim();
    if (!name || adding) {
      return;
    }
    setAdding(true);
    try {
      let voteId = vote?.voteId;
      if (voteId == null) {
        const planner = await getPlanner(planId);
        if (planner.role !== 'OWNER') {
          Alert.alert(
            '후보를 추가할 수 없어요',
            '이 카테고리의 투표를 먼저 만들어야 해요. 그룹장에게 요청해주세요.',
          );
          return;
        }
        voteId = (await createVote(planId, active)).voteId;
      }
      await addVoteOption(planId, voteId, name);
      setNewPlace('');
      setVotes(await getVotes(planId));
    } catch (e: any) {
      Alert.alert('추가 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setAdding(false);
    }
  };

  // 마지막 카테고리의 "투표 마치기" 가 일정 확정이다.
  // 확정을 해야 투표가 마감되고 여행 카드가 만들어진다.
  // 예전에는 화면만 넘겨서, 다음 화면이 늘 "확정된 일정이 없어요" 였다.
  const sendConfirm = async (selections: VoteSelection[]) => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setConfirming(true);
    try {
      await confirmPlanner(planId, selections);
      onDone?.();
    } catch (e: any) {
      // 방장이 아니거나 담긴 장소가 없으면 서버가 거부한다.
      // 그때 다음 화면으로 넘기면 빈 화면만 보게 되므로 여기 남는다.
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setConfirming(false);
    }
  };

  const goNext = async () => {
    const index = CATEGORIES.indexOf(active);
    if (index < CATEGORIES.length - 1) {
      setCurrent(CATEGORIES[index + 1]);
      return;
    }
    if (busyRef.current) {
      return;
    }

    // 확정은 그룹장만 된다. 동점을 먼저 물으면, 멤버는 다 골라놓고 나서야
    // "그룹장이 아닙니다" 를 보게 된다. 그래서 묻기 전에 먼저 확인한다.
    // 이 화면은 역할을 모르므로 확정을 누른 이때만 받아온다.
    setConfirming(true);
    let isOwner: boolean;
    try {
      isOwner = (await getPlanner(planId)).role === 'OWNER';
    } catch (e: any) {
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      setConfirming(false);
      return;
    }
    setConfirming(false);

    if (!isOwner) {
      Alert.alert(
        '확정할 수 없어요',
        '일정 확정은 그룹장만 할 수 있어요. 그룹장에게 요청해주세요.',
      );
      return;
    }

    // 동점인 채로 보내면 서버가 거부한다. 그룹장에게 물어본다.
    const ties = votes.filter(
      v => v.status !== 'CONFIRMED' && tiedOptions(v).length > 0,
    );
    if (ties.length > 0) {
      pickedRef.current = [];
      tieQueueRef.current = ties;
      setTieQueue(ties);
      return;
    }
    await sendConfirm([]);
  };

  /**
   * 동점 고르기를 접는다. 정본인 ref 도 같이 비워야 다시 열었을 때
   * 앞의 선택이 섞이지 않는다. 취소 버튼과 안드로이드 뒤로가기가
   * 같은 자리를 지나게 한다.
   */
  const closeTie = () => {
    tieQueueRef.current = [];
    pickedRef.current = [];
    setTieQueue([]);
  };

  /** 동점 하나를 정하고 다음 동점으로 넘어간다. 다 정하면 확정을 보낸다 */
  const pickTie = async (voteId: number, optionId: number) => {
    if (busyRef.current) {
      return;
    }
    const queue = tieQueueRef.current;
    // 이미 지나간 동점의 버튼이면 무시한다 (연타로 들어온 두 번째 터치)
    if (queue[0]?.voteId !== voteId) {
      return;
    }
    const next = [...pickedRef.current, { voteId, optionId }];
    const rest = queue.slice(1);
    pickedRef.current = next;
    tieQueueRef.current = rest;
    setTieQueue(rest);
    if (rest.length === 0) {
      await sendConfirm(next);
    }
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={s.title}>{CATEGORY_LABEL[active]} 투표</Text>
          <View style={[s.statusPill, { backgroundColor: meta.color }]}>
            <Text style={s.statusText}>{meta.text}</Text>
          </View>
        </View>
        <Text style={s.subtitle}>
          {vote?.votedMemberCount ?? 0} / {eligible}명 참여 ·{' '}
          {formatDeadline(vote?.deadline ?? null)}
        </Text>
      </SafeAreaView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
        style={s.chipScroll}
      >
        {CATEGORIES.map(key => {
          const on = key === active;
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
        {/* 관광지 목록에 없는 곳도 후보로 올릴 수 있어야 한다.
            마감된 투표에는 서버가 안 받으므로 아예 감춘다. */}
        {!loading && !closed && (
          <View style={s.addRow}>
            <TextInput
              style={s.addInput}
              placeholder="가고 싶은 곳을 직접 입력"
              placeholderTextColor={colors.placeholder}
              value={newPlace}
              onChangeText={setNewPlace}
              maxLength={255}
              returnKeyType="done"
              onSubmitEditing={addPlace}
              editable={!adding}
            />
            <TouchableOpacity
              style={[s.addBtn, !newPlace.trim() && s.addBtnOff]}
              activeOpacity={0.85}
              disabled={adding || !newPlace.trim()}
              onPress={addPlace}
            >
              {adding ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Text style={s.addBtnText}>추가</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : options.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>아직 담긴 후보가 없어요</Text>
            <Text style={s.emptyDesc}>
              장소 둘러보기에서 담거나, 위에 직접 입력해 후보를 올릴 수 있어요.
            </Text>
          </View>
        ) : (
          options.map(option => {
            const mine = option.optionId === myOptionId;
            const count = option.voteCount;
            const leading = count > 0 && count === topCount;
            return (
              <View key={option.optionId} style={[s.card, mine && s.cardOn]}>
                <View style={s.cardTop}>
                  <View style={s.thumb}>
                    <Text style={s.thumbEmoji}>{CATEGORY_EMOJI[active]}</Text>
                  </View>
                  <View style={s.body}>
                    <Text style={s.name} numberOfLines={1}>
                      {option.placeName}
                    </Text>
                    {/* 누가 찍었는지는 서버가 내려주지 않아 표 수만 보여준다 */}
                    <View style={s.countRow}>
                      <Text style={s.count}>{count}표</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      s.voteBtn,
                      mine && s.voteBtnOn,
                      (closed || sending) && s.voteBtnOff,
                    ]}
                    activeOpacity={0.85}
                    disabled={closed || sending}
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
                        width: `${
                          eligible > 0 ? (count / eligible) * 100 : 0
                        }%`,
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

      {/* 동점이라 그룹장이 골라야 하는 투표. 큐 앞에서부터 하나씩 묻는다 */}
      <Modal
        visible={tieQueue.length > 0}
        transparent
        animationType="fade"
        onRequestClose={closeTie}
      >
        <View style={s.tieBack}>
          <View style={s.tieCard}>
            <Text style={s.tieTitle}>
              {tieQueue[0]?.categoryLabel} 투표가 동점이에요
            </Text>
            <Text style={s.tieDesc}>
              {tieQueue.length > 1
                ? `어디로 할지 골라주세요. 남은 동점 ${tieQueue.length}개`
                : '어디로 할지 골라주세요.'}
            </Text>

            <ScrollView style={s.tieList}>
              {(tieQueue[0] ? tiedOptions(tieQueue[0]) : []).map(option => (
                <TouchableOpacity
                  key={option.optionId}
                  style={s.tieOption}
                  activeOpacity={0.85}
                  disabled={confirming}
                  onPress={() => pickTie(tieQueue[0].voteId, option.optionId)}
                >
                  <Text style={s.tieOptionName} numberOfLines={1}>
                    {option.placeName}
                  </Text>
                  <Text style={s.tieOptionCount}>{option.voteCount}표</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={s.tieCancel}
              activeOpacity={0.85}
              disabled={confirming}
              onPress={closeTie}
            >
              <Text style={s.tieCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          disabled={confirming}
          onPress={goNext}
        >
          {confirming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryText}>
              {active === CATEGORIES[CATEGORIES.length - 1]
                ? '투표 마치고 일정 확정'
                : '다음 카테고리'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlaceVoteView;
