import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { tripCardListStyles as s } from './TripCardListView.styles';
import { getTripCards, TripCardSummary } from '../../entities/record/api';
import { formatTripRange } from '../../entities/record/types';

const PAGE_WIDTH = Dimensions.get('window').width;

// 목록 응답에는 사진 수만 있다. 동행 인원·방문 장소·이동 거리는 서버가 주지 않아
// 지어내지 않고 뺐다. 대신 날짜로 계산되는 여행 기간을 보여준다.
function statsOf(card: TripCardSummary): { label: string; value: string }[] {
  const ms = new Date(card.endDate).getTime() - new Date(card.startDate).getTime();
  const nights = Number.isNaN(ms) ? 0 : Math.max(0, Math.round(ms / 86_400_000));
  return [
    { label: '여행 기간', value: `${nights}박 ${nights + 1}일` },
    { label: '남긴 사진', value: `${card.photoCount ?? 0}장` },
  ];
}

interface Props {
  onBack?: () => void;
  onOpenCard?: (tripCardId: number) => void;
  onManage?: () => void;
}

const TripCardListView: React.FC<Props> = ({
  onBack,
  onOpenCard,
  onManage,
}) => {
  const [cards, setCards] = useState<TripCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  // 조회 실패와 데이터 없음은 다르다. 같은 문구를 쓰면 서버가 죽어도
  // 기록이 없는 것처럼 보인다.
  const [failed, setFailed] = useState(false);
  const [index, setIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      // 다시 들어올 때마다 초기화한다. 안 그러면 한 번 실패한 뒤로는
      // 정상으로 빈 목록을 받아도 오류 문구가 그대로 남는다.
      setLoading(true);
      setFailed(false);
      // 새 목록이 이전보다 짧으면 index 가 범위 밖에 남아 공유가 안 된다
      setIndex(0);
      getTripCards()
        .then(list => alive && setCards(list))
        .catch(
          () =>
            alive && (setCards([]), setIndex(0), setFailed(true)),
        )
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, []),
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH));

  const share = () => {
    const card = cards[index];
    if (!card) {
      return;
    }
    Share.share({
      message: [
        `${card.cityName} — ${card.countryName}`,
        formatTripRange(card.startDate, card.endDate),
        ...statsOf(card).map(stat => `${stat.label} ${stat.value}`),
      ].join('\n'),
    });
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>여행카드</Text>
        {/* 카드 삭제(D12)로 들어갈 입구가 없어서 헤더 오른쪽에 두었다 */}
        <TouchableOpacity onPress={onManage} hitSlop={12}>
          <Text style={s.headerAction}>관리</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={s.loading} />
      ) : cards.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>
            {failed
              ? '여행카드를 불러오지 못했어요'
              : '아직 만들어진 여행카드가 없어요'}
          </Text>
          <Text style={s.emptyDesc}>
            {failed
              ? '잠시 후 다시 시도해주세요.'
              : '여행을 시작하면 카드가 만들어져요.'}
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
          >
            {cards.map(card => (
              <TouchableOpacity
                key={card.cardId}
                style={[s.page, { width: PAGE_WIDTH }]}
                activeOpacity={0.9}
                onPress={() => onOpenCard?.(card.cardId)}
              >
                <View style={s.card}>
                  <View style={s.cover}>
                    <Text style={s.coverText}>{card.cityName}</Text>
                  </View>
                  <View style={s.body}>
                    <Text style={s.cityName}>{card.cityName.toUpperCase()}</Text>
                    <Text style={s.tripMeta}>
                      {card.countryName} ·{' '}
                      {formatTripRange(card.startDate, card.endDate)}
                    </Text>
                    <View style={s.divider} />
                    {statsOf(card).map(stat => (
                      <View key={stat.label} style={s.statRow}>
                        <Text style={s.statLabel}>{stat.label}</Text>
                        <Text style={s.statValue}>{stat.value}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={s.badge}>
                    <Text style={s.badgeText}>★</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.dots}>
            {cards.map((card, i) => (
              <View
                key={card.cardId}
                style={[s.dot, i === index && s.dotOn]}
              />
            ))}
          </View>
        </>
      )}

      <View style={s.footer}>
        <TouchableOpacity
          style={s.shareBtn}
          activeOpacity={0.85}
          disabled={cards.length === 0}
          onPress={share}
        >
          <Text style={s.shareText}>여행카드 공유하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TripCardListView;
