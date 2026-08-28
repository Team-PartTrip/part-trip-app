import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { placePickerStyles as s } from './PlacePickerView.styles';
import { getTourPlaces, TourPlace as ServerPlace } from '../../entities/main/api';
import { addCartPlaces } from '../../entities/planner/api';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  formatRange,
  PlaceCategory,
  PlanDraft,
} from '../../entities/planner/types';

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  /** 담은 장소를 장바구니(C6)로 넘긴다 */
  onOpenCart?: () => void;
  /** 담은 장소로 카테고리별 투표(C5)를 연다 */
  onStartVote?: () => void;
}

const PlacePickerView: React.FC<Props> = ({
  draft,
  onBack,
  onOpenCart,
  onStartVote,
}) => {
  const [category, setCategory] = useState<PlaceCategory>('RESTAURANT');
  const [places, setPlaces] = useState<ServerPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setFailed(false);
      try {
        // 서버는 카테고리를 한글로 받는다 (TourPlaceService 참고)
        const list = await getTourPlaces(draft.countryName, {
          cityName: draft.cityName,
          category: CATEGORY_LABEL[category] as any,
        });
        if (alive) {
          setPlaces(list);
        }
      } catch {
        if (alive) {
          setPlaces([]);
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
  }, [draft.countryName, draft.cityName, category]);

  const toggle = (tourPlaceId: number) =>
    setPicked(prev =>
      prev.includes(tourPlaceId)
        ? prev.filter(id => id !== tourPlaceId)
        : [...prev, tourPlaceId],
    );

  // 담기와 동시에 서버가 카테고리별 투표를 만들어준다.
  // 그래서 장바구니로 가든 투표로 가든 먼저 담아두어야 다음 화면에 내용이 있다.
  const commit = useCallback(
    async (next?: () => void) => {
      if (picked.length === 0 || sending) {
        return;
      }
      try {
        setSending(true);
        await addCartPlaces(draft.plannerId, picked);
        setPicked([]);
        next?.();
      } catch (e: any) {
        Alert.alert('담기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSending(false);
      }
    },
    [draft.plannerId, picked, sending],
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
          disabled={picked.length === 0 || sending}
          onPress={() => commit(onOpenCart)}
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
        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : failed ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>장소를 불러오지 못했어요.</Text>
          </View>
        ) : places.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>이 카테고리에는 아직 장소가 없어요.</Text>
          </View>
        ) : (
          places.map(place => {
            const on = picked.includes(place.tourPlaceId);
            return (
              <TouchableOpacity
                key={place.tourPlaceId}
                style={[s.card, on && s.cardOn]}
                activeOpacity={0.85}
                onPress={() => toggle(place.tourPlaceId)}
              >
                <View style={s.thumb}>
                  <Text style={s.thumbEmoji}>{CATEGORY_EMOJI[category]}</Text>
                </View>
                <View style={s.body}>
                  <Text style={s.name} numberOfLines={1}>
                    {place.placeName}
                  </Text>
                  {/* 평점·주소가 없는 장소가 많아 있는 것만 붙인다 */}
                  <Text style={s.meta} numberOfLines={1}>
                    {[
                      place.rating != null ? `★ ${place.rating.toFixed(1)}` : null,
                      place.address,
                    ]
                      .filter(Boolean)
                      .join(' · ') || '정보 없음'}
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
          style={[s.primaryBtn, (picked.length === 0 || sending) && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={picked.length === 0 || sending}
          onPress={() => commit(onStartVote)}
        >
          <Text style={s.primaryText}>
            {sending ? '담는 중…' : '투표 시작하기'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlacePickerView;
