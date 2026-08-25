import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planCartStyles as s } from './PlanCartView.styles';
import { sampleCartPlaces } from '../../entities/planner/sampleData';
import {
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  TourPlace,
} from '../../entities/planner/types';

type Mode = 'manual' | 'random';

interface Props {
  /** 장소 둘러보기(C4)에서 담아 온 후보. 비어 있으면 예시 장바구니를 보여준다 */
  places?: TourPlace[];
  onBack?: () => void;
  onConfirm?: (chosen: TourPlace[]) => void;
}

const PlanCartView: React.FC<Props> = ({ places, onBack, onConfirm }) => {
  const [items, setItems] = useState<TourPlace[]>(
    () => places ?? sampleCartPlaces(),
  );
  const [mode, setMode] = useState<Mode>('manual');
  const [chosenIds, setChosenIds] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<TourPlace | null>(null);

  const remove = (tourPlaceId: number) => {
    setItems(prev => prev.filter(item => item.tourPlaceId !== tourPlaceId));
    setChosenIds(prev => prev.filter(id => id !== tourPlaceId));
    setDrawn(prev => (prev?.tourPlaceId === tourPlaceId ? null : prev));
  };

  const toggle = (tourPlaceId: number) =>
    setChosenIds(prev =>
      prev.includes(tourPlaceId)
        ? prev.filter(id => id !== tourPlaceId)
        : [...prev, tourPlaceId],
    );

  const draw = () => {
    const picked = items[Math.floor(Math.random() * items.length)];
    setDrawn(picked);
    setChosenIds([picked.tourPlaceId]);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setChosenIds([]);
    setDrawn(null);
  };

  const chosen = items.filter(item => chosenIds.includes(item.tourPlaceId));
  // 랜덤 모드에서는 뽑기 전까지 확정할 게 없다
  const canConfirm = mode === 'random' ? !!drawn : chosen.length > 0;
  const buttonLabel =
    mode === 'random' && !drawn ? '랜덤으로 뽑기' : '선택 확정하기';

  const press = () => {
    if (mode === 'random' && !drawn) {
      if (items.length > 0) {
        draw();
      }
      return;
    }
    onConfirm?.(chosen);
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
        {items.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>장바구니가 비었어요</Text>
            <Text style={s.emptyDesc}>
              장소 둘러보기에서 가고 싶은 곳을 담아보세요.
            </Text>
          </View>
        ) : (
          items.map(item => {
            const on = chosenIds.includes(item.tourPlaceId);
            return (
              <TouchableOpacity
                key={item.tourPlaceId}
                style={[s.row, on && s.rowOn]}
                activeOpacity={0.85}
                disabled={mode === 'random'}
                onPress={() => toggle(item.tourPlaceId)}
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
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => remove(item.tourPlaceId)}
                >
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
          style={[s.primaryBtn, !canConfirm && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={mode === 'manual' ? !canConfirm : items.length === 0}
          onPress={press}
        >
          <Text style={s.primaryText}>{buttonLabel}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanCartView;
