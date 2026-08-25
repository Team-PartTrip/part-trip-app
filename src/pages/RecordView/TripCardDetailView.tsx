import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tripCardDetailStyles as s } from './TripCardDetailView.styles';
import {
  sampleEntriesOf,
  sampleTripCardOf,
} from '../../entities/record/sampleData';
import { formatDotDate } from '../../entities/record/types';

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onAddPhoto?: () => void;
}

const TripCardDetailView: React.FC<Props> = ({
  tripCardId,
  onBack,
  onAddPhoto,
}) => {
  const card = sampleTripCardOf(tripCardId);
  const entries = sampleEntriesOf(tripCardId);
  const place = `${card.countryName} ${card.cityName}`;

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

        {entries.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>카드에 담긴 기록이 없어요</Text>
            <Text style={s.emptyDesc}>
              사진을 추가하면 여기에 시간순으로 쌓여요.
            </Text>
          </View>
        ) : (
          <View style={s.timeline}>
            <View style={s.rail} />
            {entries.map((entry, i) => (
              <React.Fragment key={`${entry.kind}-${entry.id}`}>
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
                    <Text style={s.entryImageText}>
                      {entry.kind === 'place' ? '방문 장소 이미지' : '촬영된 이미지'}
                    </Text>
                    <Text style={s.entryImageText}>{entry.imageCaption}</Text>
                  </View>
                  <View style={s.entryInfo}>
                    <Text style={s.entryTitle}>{entry.title}</Text>
                    <Text style={s.entrySub}>{entry.subtitle}</Text>
                  </View>
                  <View style={s.entryDot} />
                </View>
              </React.Fragment>
            ))}
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
