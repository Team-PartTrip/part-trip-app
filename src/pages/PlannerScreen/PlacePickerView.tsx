import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { placePickerStyles as s } from './PlacePickerView.styles';
import { samplePlacesOf } from '../../entities/planner/sampleData';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatRange,
  PlaceCategory,
  PlanDraft,
  TourPlace,
} from '../../entities/planner/types';

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  /** 담은 장소를 장바구니(C6)로 넘긴다 */
  onOpenCart?: (picks: TourPlace[]) => void;
  /** 담은 장소로 카테고리별 투표(C5)를 연다 */
  onStartVote?: (picks: TourPlace[]) => void;
}

const PlacePickerView: React.FC<Props> = ({
  draft,
  onBack,
  onOpenCart,
  onStartVote,
}) => {
  const [category, setCategory] = useState<PlaceCategory>('RESTAURANT');
  const [picked, setPicked] = useState<TourPlace[]>([]);

  const places = samplePlacesOf(category);
  const isPicked = (place: TourPlace) =>
    picked.some(item => item.tourPlaceId === place.tourPlaceId);

  const toggle = (place: TourPlace) =>
    setPicked(prev =>
      prev.some(item => item.tourPlaceId === place.tourPlaceId)
        ? prev.filter(item => item.tourPlaceId !== place.tourPlaceId)
        : [...prev, place],
    );

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>장소 둘러보기</Text>
        <Text style={s.subtitle}>
          {draft.cityName} · {formatRange(draft.startDate, draft.endDate)}
        </Text>
      </SafeAreaView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
        style={s.chipScroll}
      >
        {CATEGORIES.map(key => {
          const on = key === category;
          return (
            <TouchableOpacity
              key={key}
              style={[s.chip, on && s.chipOn]}
              activeOpacity={0.85}
              onPress={() => setCategory(key)}
            >
              <Text style={[s.chipText, on && s.chipTextOn]}>
                {CATEGORY_LABEL[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={s.countRow}>
        <Text style={s.countText}>선택한 장소 {picked.length}</Text>
        <TouchableOpacity
          hitSlop={8}
          disabled={picked.length === 0}
          onPress={() => onOpenCart?.(picked)}
        >
          <Text style={[s.cartLink, picked.length === 0 && s.cartLinkOff]}>
            투표 후보로 넘기기
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {places.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>이 카테고리에는 아직 장소가 없어요.</Text>
          </View>
        ) : (
          places.map(place => {
            const on = isPicked(place);
            return (
              <TouchableOpacity
                key={place.tourPlaceId}
                style={[s.card, on && s.cardOn]}
                activeOpacity={0.85}
                onPress={() => toggle(place)}
              >
                <View style={s.thumb}>
                  <Text style={s.thumbEmoji}>
                    {CATEGORY_EMOJI[place.category]}
                  </Text>
                </View>
                <View style={s.body}>
                  <Text style={s.name} numberOfLines={1}>
                    {place.placeName}
                  </Text>
                  <Text style={s.meta}>
                    ★ {place.rating.toFixed(1)} · {place.area}
                  </Text>
                  <View style={[s.statePill, on && s.statePillOn]}>
                    <Text style={[s.stateText, on && s.stateTextOn]}>
                      {on ? '후보 담김' : '담기'}
                    </Text>
                  </View>
                </View>
                <View style={[s.toggle, on && s.toggleOn]}>
                  <Text style={[s.toggleText, on && s.toggleTextOn]}>
                    {on ? '✓' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, picked.length === 0 && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={picked.length === 0}
          onPress={() => onStartVote?.(picked)}
        >
          <Text style={s.primaryText}>투표 시작하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlacePickerView;
