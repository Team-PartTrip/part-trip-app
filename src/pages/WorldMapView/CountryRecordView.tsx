import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countryRecordStyles as s } from './CountryRecordView.styles';
import {
  sampleRecordsOf,
  sampleSummary,
} from '../../entities/worldmap/sampleData';
import {
  flagOf,
  formatDateRange,
  VisitedCountry,
} from '../../entities/worldmap/types';

// 카드 위 썸네일 스트립에 보여줄 칸 수 (피그마 E4 는 4칸)
const STRIP_CELLS = 4;

/** "2024-03-12" → "2024.03" */
function toMonthLabel(date: string): string {
  const [year, month] = date.split('-');
  return `${year}.${month}`;
}

interface Props {
  country: VisitedCountry;
  onBack?: () => void;
  onOpenRecord?: (recordId: number) => void;
}

const CountryRecordView: React.FC<Props> = ({
  country,
  onBack,
  onOpenRecord,
}) => {
  const records = sampleRecordsOf(country.countryInfoId);
  const photoTotal = records.reduce((sum, r) => sum + r.photoCount, 0);
  // 같은 도시를 여러 번 갔을 수 있어서 중복을 없앤다
  const cities = Array.from(new Set(records.map(r => r.cityName)));
  const continentName =
    sampleSummary.continents.find(c => c.code === country.continent)?.name ??
    '-';

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>

          <View style={s.countryRow}>
            <View style={s.flagCircle}>
              <Text style={s.flag}>{flagOf(country.countryCode)}</Text>
            </View>
            <View style={s.countryInfo}>
              <Text style={s.countryName}>{country.countryName}</Text>
              <Text style={s.countryMeta}>
                {continentName} · 첫 방문 {toMonthLabel(country.firstVisitedAt)}
              </Text>
            </View>
          </View>

          <View style={s.statsRow}>
            {[
              { value: `${country.visitCount}회`, label: '방문 횟수' },
              { value: `${cities.length}곳`, label: '방문 도시' },
              // photoCount 의 합이라 사진 수다. 기록 수는 records.length 다.
              { value: `${photoTotal}장`, label: '총 사진' },
            ].map(item => (
              <View key={item.label} style={s.statCol}>
                <Text style={s.statValue}>{item.value}</Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </SafeAreaView>

        {cities.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>방문 도시</Text>
            <View style={s.chipRow}>
              {cities.map(city => (
                <View key={city} style={s.chip}>
                  <Text style={s.chipText}>{city}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>여행 기록</Text>

          {records.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>아직 남긴 기록이 없어요</Text>
              <Text style={s.emptyDesc}>
                {country.countryName} 여행 기록을 남겨보세요.
              </Text>
            </View>
          ) : (
            records.map(r => {
              const rest = r.photoCount - STRIP_CELLS;
              return (
                <TouchableOpacity
                  key={r.recordId}
                  style={s.card}
                  activeOpacity={0.85}
                  onPress={() => onOpenRecord?.(r.recordId)}
                >
                  {/* 사진 URL 이 없어서 지금은 빈 칸으로 자리만 잡는다 */}
                  <View style={s.strip}>
                    {Array.from({ length: STRIP_CELLS }, (_, i) => (
                      <View
                        key={i}
                        style={[
                          s.stripCell,
                          i === 0 && s.stripFirst,
                          i === STRIP_CELLS - 1 && s.stripLast,
                        ]}
                      >
                        {i === STRIP_CELLS - 1 && rest > 0 && (
                          <Text style={s.stripMoreText}>+{rest}</Text>
                        )}
                      </View>
                    ))}
                  </View>

                  <View style={s.cardFoot}>
                    <Text style={s.cardTitle} numberOfLines={1}>
                      {r.title}
                    </Text>
                    <Text style={s.cardMeta}>
                      {formatDateRange(r.visitedAt, r.endedAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <Text style={s.note}>
          세계지도 API 연동 전이라 예시 데이터로 보여주고 있어요.
        </Text>
      </ScrollView>
    </View>
  );
};

export default CountryRecordView;
