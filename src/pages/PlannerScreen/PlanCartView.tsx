import React, { useCallback, useState } from 'react';
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
  closeVote,
  confirmPlanner,
  confirmVote,
  deleteVoteOption,
  drawRandomPlace,
  getVotes,
} from '../../entities/planner/api';
import { CATEGORY_EMOJI, CATEGORY_LABEL, PlaceCategory } from '../../entities/planner/types';

type Mode = 'manual' | 'random';

/** 장바구니 한 줄. 서버에서는 카테고리 투표의 후보 하나다 */
interface CartItem {
  voteId: number;
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
  const [drawn, setDrawn] = useState<CartItem | null>(null);
  const [busy, setBusy] = useState(false);

  // 담은 목록은 카테고리별 투표의 후보로 저장돼 있다. 그래서 투표 현황을 펼쳐서 쓴다.
  const load = useCallback(async (alive: () => boolean) => {
    setLoading(true);
    setFailed(false);
    try {
      const votes = await getVotes(plannerId);
      const flat = votes.flatMap(vote =>
        vote.options.map(option => ({
          voteId: vote.voteId,
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
    if (busy) {
      return;
    }
    try {
      setBusy(true);
      await deleteVoteOption(plannerId, item.voteId, item.optionId);
      setItems(prev => prev.filter(row => row.optionId !== item.optionId));
      setChosenIds(prev => prev.filter(id => id !== item.optionId));
      setDrawn(prev => (prev?.optionId === item.optionId ? null : prev));
    } catch (e: any) {
      Alert.alert('빼기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  };

  const toggle = (optionId: number) =>
    setChosenIds(prev =>
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId],
    );

  // 뽑기는 서버가 한다. 어느 후보가 뽑혔는지는 관광지 id 로 맞춰본다.
  const draw = async () => {
    if (busy) {
      return;
    }
    try {
      setBusy(true);
      const picked = await drawRandomPlace(plannerId);
      const matched =
        items.find(item => item.tourPlaceId === picked.placeId) ??
        items.find(item => item.placeName === picked.placeName) ??
        null;
      if (matched) {
        setDrawn(matched);
        setChosenIds([matched.optionId]);
      } else {
        Alert.alert('뽑기 결과', picked.placeName);
      }
    } catch (e: any) {
      Alert.alert('뽑기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setChosenIds([]);
    setDrawn(null);
  };

  const chosen = items.filter(item => chosenIds.includes(item.optionId));
  // 랜덤 모드에서는 뽑기 전까지 확정할 게 없다
  const canConfirm = mode === 'random' ? !!drawn : chosen.length > 0;
  const buttonLabel =
    mode === 'random' && !drawn ? '랜덤으로 뽑기' : '선택 확정하기';
  // 버튼이 지금 할 일이 있는지. 스타일과 비활성이 갈리면 꺼진 것처럼 보이는데
  // 눌리는 버튼이 된다(또는 그 반대). busy 까지 넣어 한 값으로 둘 다 결정한다.
  const actionable =
    !busy && (mode === 'random' ? items.length > 0 : canConfirm);

  const press = async () => {
    if (mode === 'random' && !drawn) {
      if (items.length > 0) {
        draw();
      }
      return;
    }
    // "선택 확정하기" 가 일정 확정이다. 확정을 해야 투표가 마감되고
    // 여행 카드가 만들어진다. 예전에는 화면만 넘겨서 다음 화면이
    // 늘 "확정된 일정이 없어요" 였다.
    setBusy(true);
    try {
      // 고른 것을 먼저 확정한다. 서버는 카테고리(투표)마다 한 곳만 확정하고,
      // 아무도 투표하지 않은 장바구니에서는 모든 후보가 0표 동점이다. 그래서
      // 이걸 건너뛰면 고른 것이 버려지거나 "동점 투표가 있습니다" 로 거부된다.
      const picks = mode === 'random' ? (drawn ? [drawn] : []) : chosen;
      const pickByVote = new Map<number, number>();
      picks.forEach(item => {
        if (!pickByVote.has(item.voteId)) {
          pickByVote.set(item.voteId, item.optionId);
        }
      });
      for (const [voteId, optionId] of pickByVote) {
        // 확정은 마감된 투표만 된다. 이미 마감돼 있으면 그대로 넘어간다.
        await closeVote(plannerId, voteId).catch(() => {});
        await confirmVote(plannerId, voteId, optionId);
      }
      await confirmPlanner(plannerId);
      onConfirm?.();
    } catch (e: any) {
      // 방장이 아니거나 담긴 장소가 없으면 서버가 거부한다
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
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
                onPress={() => toggle(item.optionId)}
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
