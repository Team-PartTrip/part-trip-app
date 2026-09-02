import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  getTourPlaces,
  TourPlace as ServerPlace,
} from '../../entities/main/api';
import {
  addCartPlaces,
  createPlanner,
  saveTravelPlan,
} from '../../entities/planner/api';
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
  /** 담기가 끝나면 실제로 쓸 plannerId 를 넘긴다 */
  onOpenCart?: (plannerId: number) => void;
  /** 담은 장소로 카테고리별 투표(C5)를 연다 */
  onStartVote?: (plannerId: number) => void;
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
  const plannerIdRef = useRef(draft.plannerId);

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
  /**
   * 담기 = 이 여행이 실제로 시작되는 지점이다.
   *
   * 여기까지 와야 플래너를 만든다. 앞 화면에서 만들면 여행지도 안 정하고
   * 나간 사람의 "기간 미정" 플래너가 목록에 쌓인다. 초대하기를 먼저 눌렀다면
   * 이미 만들어져 있으므로 그 id 를 쓴다.
   *
   * 만들자마자 여행지·기간을 저장한다. 그래야 서버가 카테고리별 투표를
   * 만들 수 있다.
   */
  const commit = useCallback(
    async (next?: (plannerId: number) => void) => {
      if (picked.length === 0 || sending) {
        return;
      }
      try {
        setSending(true);
        let plannerId = plannerIdRef.current;
        if (plannerId == null) {
          const created = await createPlanner({
            title: draft.title,
            memberCount: draft.headcount,
            isSolo: draft.isSolo,
          });
          plannerId = created.plannerId;
          plannerIdRef.current = plannerId;
        }
        await saveTravelPlan(plannerId, {
          countryName: draft.countryName,
          cityName: draft.cityName,
          startDate: draft.startDate,
          endDate: draft.endDate,
        });
        await addCartPlaces(plannerId, picked);
        setPicked([]);
        next?.(plannerId);
      } catch (e: any) {
        Alert.alert('담기 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSending(false);
      }
    },
    [draft, picked, sending],
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
                      place.rating != null
                        ? `★ ${place.rating.toFixed(1)}`
                        : null,
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
          style={[
            s.primaryBtn,
            (picked.length === 0 || sending) && s.primaryBtnOff,
          ]}
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
