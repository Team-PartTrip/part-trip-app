import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tripCardListStyles as s } from './TripCardListView.styles';
import { sampleTripCards } from '../../entities/record/sampleData';
import {
  cardTitleOf,
  formatTripRange,
  TripCard,
} from '../../entities/record/types';

const PAGE_WIDTH = Dimensions.get('window').width;

function statsOf(card: TripCard): { label: string; value: string }[] {
  return [
    { label: '함께한 사람', value: `${card.companionCount}명` },
    { label: '방문 장소', value: `${card.placeCount}곳` },
    { label: '남긴 사진', value: `${card.photoCount}장` },
    { label: '이동 거리', value: `${card.distanceKm}km` },
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
  const cards = sampleTripCards;
  const [index, setIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(event.nativeEvent.contentOffset.x / PAGE_WIDTH));

  const share = () => {
    const card = cards[index];
    if (!card) {
      return;
    }
    Share.share({
      message: [
        `${cardTitleOf(card)} — ${card.title}`,
        `${card.countryName} · ${formatTripRange(card.startDate, card.endDate)}`,
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

      {cards.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>아직 만들어진 여행카드가 없어요</Text>
          <Text style={s.emptyDesc}>여행을 시작하면 카드가 만들어져요.</Text>
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
                key={card.tripCardId}
                style={[s.page, { width: PAGE_WIDTH }]}
                activeOpacity={0.9}
                onPress={() => onOpenCard?.(card.tripCardId)}
              >
                <View style={s.card}>
                  <View style={s.cover}>
                    <Text style={s.coverText}>{card.title}</Text>
                  </View>
                  <View style={s.body}>
                    <Text style={s.cityName}>{cardTitleOf(card)}</Text>
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
                key={card.tripCardId}
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
