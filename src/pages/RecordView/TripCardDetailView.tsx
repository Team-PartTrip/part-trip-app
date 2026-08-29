import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { tripCardDetailStyles as s } from './TripCardDetailView.styles';
import {
  getTripCard,
  getTripCards,
  TimelineItem,
  TripCardSummary,
} from '../../entities/record/api';
import { formatDotDate } from '../../entities/record/types';
import { toImageUrl } from '../../shared/api/image';

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onAddPhoto?: () => void;
}

/** 타임라인 한 줄을 화면 문구로 바꾼다 */
function lineOf(item: TimelineItem): { title: string; subtitle: string } {
  if (item.type === 'PLACE') {
    return {
      title: item.placeName ?? '방문 장소',
      subtitle: item.address ?? '',
    };
  }
  return {
    title: item.comment ?? '사진',
    subtitle: item.takenAt ? item.takenAt.slice(11, 16) : '',
  };
}

const TripCardDetailView: React.FC<Props> = ({
  tripCardId,
  onBack,
  onAddPhoto,
}) => {
  const [entries, setEntries] = useState<TimelineItem[]>([]);
  const [card, setCard] = useState<TripCardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          // 상세 응답에는 나라·도시가 없어서 목록에서 가져온다 (명세서 API-003-03)
          const [detail, list] = await Promise.all([
            getTripCard(tripCardId),
            getTripCards().catch(() => [] as TripCardSummary[]),
          ]);
          if (!alive) {
            return;
          }
          setEntries(detail.timeline ?? []);
          setCard(list.find(item => item.cardId === tripCardId) ?? null);
        } catch {
          if (alive) {
            setEntries([]);
            setCard(null);
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
    }, [tripCardId]),
  );

  const place = card ? `${card.countryName} ${card.cityName}` : '여행';

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={s.titleBar}>
          <Text style={s.titleBarText}>{place} 여행팟</Text>
        </View>

        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : entries.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>카드에 담긴 기록이 없어요</Text>
            <Text style={s.emptyDesc}>
              사진을 추가하면 여기에 시간순으로 쌓여요.
            </Text>
          </View>
        ) : (
          <View style={s.timeline}>
            <View style={s.rail} />
            {entries.map((entry, i) => {
              const line = lineOf(entry);
              return (
                <React.Fragment key={`${entry.type}-${i}`}>
                  {/* 날짜가 바뀔 때만 구분 띠를 넣는다 */}
                  {i > 0 && entries[i - 1].date !== entry.date && (
                    <View style={s.dateBar}>
                      <Text style={s.dateBarText}>
                        {formatDotDate(entry.date)}  |  {place}
                      </Text>
                    </View>
                  )}

                  <View style={s.entry}>
                    <View style={s.entryImage}>
                      {entry.imageUrl ? (
                        <Image
                          source={{ uri: toImageUrl(entry.imageUrl) }}
                          style={s.entryPhoto}
                        />
                      ) : (
                        <Text style={s.entryImageText}>
                          {entry.type === 'PLACE' ? '방문 장소' : '사진'}
                        </Text>
                      )}
                    </View>
                    <View style={s.entryInfo}>
                      <Text style={s.entryTitle}>{line.title}</Text>
                      <Text style={s.entrySub}>{line.subtitle}</Text>
                    </View>
                    <View style={s.entryDot} />
                  </View>
                </React.Fragment>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={s.addCard}
          activeOpacity={0.85}
          onPress={onAddPhoto}
        >
          <Text style={s.addTitle}>사진 추가하기</Text>
          <Text style={s.addDesc}>갤러리에서 기록하고 싶은 사진 업로드</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TripCardDetailView;
