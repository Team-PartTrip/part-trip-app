import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { recordStyles as s } from './RecordView.styles';
import { getTripCards, TripCardSummary } from '../../entities/record/api';
import { formatTripRange, today } from '../../entities/record/types';

/** 카드 위쪽 사진 띠 — 실제 썸네일이 붙기 전까지 옅어지는 네 칸으로 둔다 */
const STRIP_OPACITY = [1, 0.88, 0.76, 0.64];

interface Props {
  /** 여행 하나를 열어 촬영 위치를 본다 (D1) */
  onOpenTrip?: (tripCardId: number) => void;
  onOpenTripCards?: () => void;
}

const RecordView: React.FC<Props> = ({
  onOpenTrip,
  onOpenTripCards,
}) => {
  const [year, setYear] = useState('전체');
  const [all, setAll] = useState<TripCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // 조회 실패와 데이터 없음은 다르다. 같은 문구를 쓰면 서버가 죽어도
  // 기록이 없는 것처럼 보인다.
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      // 다시 들어올 때마다 초기화한다. 안 그러면 한 번 실패한 뒤로는
      // 정상으로 빈 목록을 받아도 오류 문구가 그대로 남는다.
      setLoading(true);
      setFailed(false);
      getTripCards()
        .then(list => alive && setAll(list))
        .catch(() => alive && (setAll([]), setFailed(true)))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, []),
  );

  // 연도 칩은 가지고 있는 여행에서 뽑는다
  const years = Array.from(
    new Set(all.map(card => card.startDate.slice(0, 4))),
  ).sort((a, b) => b.localeCompare(a));
  const filters = ['전체', ...years];

  const cards = all.filter(
    card => year === '전체' || card.startDate.startsWith(year),
  );

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <View style={s.headerRow}>
          <Text style={s.pageTitle}>기록</Text>
          {/* 축제·이벤트는 기능명세서 v3 에서 메인(Func-002-03)으로 옮겨가서
              여기 버튼을 뺐다. 피그마 D2 와 같이 버튼은 하나뿐이다. */}
          <TouchableOpacity
            style={s.headerBtn}
            activeOpacity={0.8}
            onPress={onOpenTripCards}
          >
            <Text style={s.headerBtnIcon}>🎴</Text>
          </TouchableOpacity>
        </View>

        <View style={s.filterRow}>
          {filters.map(item => {
            const on = item === year;
            return (
              <TouchableOpacity
                key={item}
                style={[s.chip, on && s.chipOn]}
                activeOpacity={0.85}
                onPress={() => setYear(item)}
              >
                <Text style={[s.chipText, on && s.chipTextOn]}>{item}</Text>
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
        ) : cards.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>
              {failed
                ? '기록을 불러오지 못했어요'
                : '이 연도에 남긴 기록이 없어요'}
            </Text>
            <Text style={s.emptyDesc}>
              {failed
                ? '잠시 후 다시 시도해주세요.'
                : '여행을 시작하면 기록이 여기에 쌓여요.'}
            </Text>
          </View>
        ) : (
          cards.map(card => (
            <TouchableOpacity
              key={card.cardId}
              style={s.card}
              activeOpacity={0.9}
              onPress={() => onOpenTrip?.(card.cardId)}
            >
              <View style={s.strip}>
                {STRIP_OPACITY.map((opacity, i) => (
                  <View key={i} style={[s.stripTile, { opacity }]} />
                ))}
              </View>
              {card.startDate <= today() && today() <= card.endDate && (
                <View style={s.travelBadge}>
                  <Text style={s.travelBadgeText}>여행 중</Text>
                </View>
              )}

              <View style={s.cardBottom}>
                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>
                    {card.countryName} {card.cityName}
                  </Text>
                  <Text style={s.cardDate}>
                    {formatTripRange(card.startDate, card.endDate)}
                  </Text>
                </View>
                <View style={s.countPill}>
                  <Text style={s.countPillText}>
                    사진 {card.photoCount ?? 0}장
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default RecordView;
