import React, { useCallback, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { planCartStyles as s } from './PlanCartView.styles';
import {
  confirmPlanner,
  deleteVoteOption,
  drawRandomPlace,
  getVotes,
} from '../../entities/planner/api';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  PlaceCategory,
  VoteStatus,
} from '../../entities/planner/types';

type Mode = 'manual' | 'random';

/** 장바구니 한 줄. 서버에서는 카테고리 투표의 후보 하나다 */
interface CartItem {
  voteId: number;
  voteStatus: VoteStatus;
  optionId: number;
  tourPlaceId: number | null;
  placeName: string;
  category: PlaceCategory;
}

interface Props {
  plannerId: number;
  onBack?: () => void;
  onConfirm?: () => void;
}

const PlanCartView: React.FC<Props> = ({ plannerId, onBack, onConfirm }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>('manual');
  const [chosenIds, setChosenIds] = useState<number[]>([]);
  // 뽑힌 장소는 id 로만 들고, 실체는 items 에서 찾아 쓴다. 객체를 따로
  // 담아두면 items 만 갱신됐을 때 둘이 어긋난다.
  const [drawnId, setDrawnId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  /**
   * 실제 잠금은 ref 다. state 는 화면이 다시 그려져야 바뀌어서,
   * 연달아 누른 두 번째 터치도 첫 번째와 같은 값을 본다.
   * 담기·뽑기·빼기가 같은 잠금을 나눠 쓴다.
   */
  const busyRef = useRef(false);

  // 담은 목록은 카테고리별 투표의 후보로 저장돼 있다. 그래서 투표 현황을 펼쳐서 쓴다.
  const load = useCallback(async (alive: () => boolean) => {
    setLoading(true);
    setFailed(false);
    try {
      const votes = await getVotes(plannerId);
      const flat = votes.flatMap(vote =>
        vote.options.map(option => ({
          voteId: vote.voteId,
          voteStatus: vote.status,
          optionId: option.optionId,
          tourPlaceId: option.tourPlaceId,
          placeName: option.placeName,
          category: vote.category,
        })),
      );
      if (alive()) {
        setItems(flat);
      }
    } catch {
      if (alive()) {
        setItems([]);
        setFailed(true);
      }
    } finally {
      if (alive()) {
        setLoading(false);
      }
    }
  }, [plannerId]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      load(() => alive);
      return () => {
        alive = false;
      };
    }, [load]),
  );

  const remove = async (item: CartItem) => {
    if (busyRef.current) {
      return;
    }
    try {
      busyRef.current = true;
      setBusy(true);
      await deleteVoteOption(plannerId, item.voteId, item.optionId);
      setItems(prev => prev.filter(row => row.optionId !== item.optionId));
      setChosenIds(prev => prev.filter(id => id !== item.optionId));
      setDrawnId(prev => (prev === item.optionId ? null : prev));
    } catch (e: any) {
      Alert.alert('빼기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  // 서버는 카테고리(투표)마다 한 곳만 확정한다. 그래서 같은 카테고리에서
  // 다른 곳을 고르면 앞의 선택을 바꾼다. 둘 다 켜두면 화면에는 둘이 보이는데
  // 확정에는 하나만 들어간다.
  const toggle = (item: CartItem) =>
    setChosenIds(prev => {
      if (prev.includes(item.optionId)) {
        return prev.filter(id => id !== item.optionId);
      }
      const sameVote = items
        .filter(row => row.voteId === item.voteId)
        .map(row => row.optionId);
      return [...prev.filter(id => !sameVote.includes(id)), item.optionId];
    });

  // 뽑기는 서버가 한다. 어느 후보가 뽑혔는지는 관광지 id 로 맞춰본다.
  const draw = async () => {
    if (busyRef.current) {
      return;
    }
    try {
      busyRef.current = true;
      setBusy(true);
      const picked = await drawRandomPlace(plannerId);
      const matched =
        items.find(item => item.tourPlaceId === picked.placeId) ??
        items.find(item => item.placeName === picked.placeName) ??
        null;
      if (matched) {
        // 뽑힌 카테고리의 앞 선택만 바꾸고 나머지는 남긴다. 서버 뽑기는
        // 장바구니 전체에서 하나를 주므로, 카테고리를 다 채우려면 여러 번
        // 눌러야 한다. 매번 덮어쓰면 영원히 하나만 남는다.
        setDrawnId(matched.optionId);
        setChosenIds(prev => {
          const sameVote = items
            .filter(row => row.voteId === matched.voteId)
            .map(row => row.optionId);
          return [
            ...prev.filter(id => !sameVote.includes(id)),
            matched.optionId,
          ];
        });
      } else {
        Alert.alert('뽑기 결과', picked.placeName);
      }
    } catch (e: any) {
      Alert.alert('뽑기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setChosenIds([]);
    setDrawnId(null);
  };

  const chosen = items.filter(item => chosenIds.includes(item.optionId));
  const drawn = items.find(item => item.optionId === drawnId) ?? null;

  /**
   * 지금 고른 것들. 랜덤 모드는 뽑힌 하나가 곧 선택이다.
   */
  // 랜덤도 고른 결과는 chosenIds 에 쌓인다. 두 모드가 같은 값을 본다.
  const picks = chosen;

  /**
   * 아직 고르지 않은 카테고리.
   *
   * 서버는 카테고리마다 한 곳을 확정한다. 장바구니는 아무도 투표하지 않아
   * 모든 후보가 0표 동점이라, 안 고른 카테고리가 하나라도 있으면 확정이
   * "동점이에요" 로 거부된다. 그래서 누르기 전에 먼저 막는다.
   */
  const pendingLabels = Array.from(
    new Set(
      items
        .filter(item => !picks.some(pick => pick.voteId === item.voteId))
        .map(item => CATEGORY_LABEL[item.category]),
    ),
  );

  // 랜덤 모드에서는 뽑기 전까지 확정할 게 없다
  const canConfirm =
    picks.length > 0 && pendingLabels.length === 0;
  const buttonLabel =
    mode === 'random' && pendingLabels.length > 0
      ? '랜덤으로 뽑기'
      : '선택 확정하기';
  // 버튼이 지금 할 일이 있는지. 스타일과 비활성이 갈리면 꺼진 것처럼 보이는데
  // 눌리는 버튼이 된다(또는 그 반대). busy 까지 넣어 한 값으로 둘 다 결정한다.
  // 랜덤 모드에서 아직 뽑을 게 남았으면 버튼은 '뽑기' 로 동작한다.
  // 다 뽑았으면 직접 선택과 같은 조건으로 확정을 건다.
  const actionable =
    !busy &&
    (mode === 'random' && pendingLabels.length > 0
      ? items.length > 0
      : canConfirm);

  const press = async () => {
    if (busyRef.current) {
      return;
    }
    if (mode === 'random' && pendingLabels.length > 0) {
      if (items.length > 0) {
        draw();
      }
      return;
    }
    // "선택 확정하기" 가 일정 확정이다. 확정을 해야 투표가 마감되고
    // 여행 카드가 만들어진다. 예전에는 화면만 넘겨서 다음 화면이
    // 늘 "확정된 일정이 없어요" 였다.
    busyRef.current = true;
    setBusy(true);
    try {
      // 고른 것을 먼저 확정한다. 서버는 카테고리(투표)마다 한 곳만 확정하고,
      // 아무도 투표하지 않은 장바구니에서는 모든 후보가 0표 동점이다. 그래서
      // 이걸 건너뛰면 고른 것이 버려지거나 "동점 투표가 있습니다" 로 거부된다.
      // toggle 이 카테고리마다 하나만 남기므로 그대로 보내면 된다.
      // 고른 것을 확정 요청에 실어 한 번에 보낸다. 서버가 카테고리마다
      // 마감하고 고른 곳으로 확정한다. 예전에는 여기서 마감·확정을 하나씩
      // 돌렸는데, 중간에 실패하면 앞쪽만 확정된 채로 남았다.
      await confirmPlanner(
        plannerId,
        picks
          .filter(item => item.voteStatus !== 'CONFIRMED')
          .map(item => ({ voteId: item.voteId, optionId: item.optionId })),
      );
      onConfirm?.();
    } catch (e: any) {
      // 방장이 아니거나 담긴 장소가 없으면 서버가 거부한다
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>장바구니</Text>
        <Text style={s.desc}>
          소수 인원이라 투표 대신 직접 고르거나 랜덤으로 정할 수 있어요
        </Text>

        <View style={s.segment}>
          {(
            [
              { key: 'manual', label: '직접 선택' },
              { key: 'random', label: '랜덤 뽑기' },
            ] as { key: Mode; label: string }[]
          ).map(item => {
            const on = item.key === mode;
            return (
              <TouchableOpacity
                key={item.key}
                style={[s.segmentItem, on && s.segmentItemOn]}
                activeOpacity={0.85}
                onPress={() => switchMode(item.key)}
              >
                <Text style={[s.segmentText, on && s.segmentTextOn]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.countText}>담은 장소 {items.length}</Text>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : failed ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>장바구니를 불러오지 못했어요</Text>
            <Text style={s.emptyDesc}>
              네트워크를 확인하고 다시 들어와 주세요.
            </Text>
          </View>
        ) : items.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>장바구니가 비었어요</Text>
            <Text style={s.emptyDesc}>
              장소 둘러보기에서 가고 싶은 곳을 담아보세요.
            </Text>
          </View>
        ) : (
          items.map(item => {
            const on = chosenIds.includes(item.optionId);
            return (
              <TouchableOpacity
                key={item.optionId}
                style={[s.row, on && s.rowOn]}
                activeOpacity={0.85}
                disabled={mode === 'random'}
                onPress={() => toggle(item)}
              >
                <View style={s.thumb}>
                  <Text style={s.thumbEmoji}>
                    {CATEGORY_EMOJI[item.category]}
                  </Text>
                </View>
                <View style={s.body}>
                  <Text style={s.name} numberOfLines={1}>
                    {item.placeName}
                  </Text>
                  <View style={s.tag}>
                    <Text style={s.tagText}>
                      {CATEGORY_LABEL[item.category]}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity hitSlop={10} onPress={() => remove(item)}>
                  <Text style={s.remove}>✕</Text>
                </TouchableOpacity>
                <View style={[s.check, on && s.checkOn]}>
                  <Text style={s.checkText}>{on ? '✓' : ' '}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={s.hint}>
          <View style={s.hintIcon}>
            <Text style={s.hintEmoji}>🎲</Text>
          </View>
          <View style={s.hintBody}>
            <Text style={s.hintTitle}>
              {drawn ? '이 장소는 어때요?' : '고르기 어렵다면?'}
            </Text>
            <Text style={s.hintDesc}>
              {drawn
                ? `${drawn.placeName} · ${CATEGORY_LABEL[drawn.category]}`
                : '담은 장소 중에서 랜덤으로 하나를 뽑아 드려요'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        {pendingLabels.length > 0 && (
          <Text style={s.pending}>
            {pendingLabels.join(' · ')} 도 골라주세요
          </Text>
        )}
        <TouchableOpacity
          style={[s.primaryBtn, !actionable && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={!actionable}
          onPress={press}
        >
          <Text style={s.primaryText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanCartView;
