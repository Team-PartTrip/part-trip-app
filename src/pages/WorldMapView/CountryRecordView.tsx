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
import { countryRecordStyles as s } from './CountryRecordView.styles';
import {
  getCountryHistory,
  CountryTravelHistory,
} from '../../entities/worldmap/api';
import {
  flagOf,
  formatDateRange,
  VisitedCountry,
} from '../../entities/worldmap/types';

// 카드 위 썸네일 스트립에 보여줄 칸 수 (피그마 E4 는 4칸)
const STRIP_CELLS = 4;

interface Props {
  country: VisitedCountry;
  onBack?: () => void;
  onOpenRecord?: (tripCardId: number) => void;
}

const CountryRecordView: React.FC<Props> = ({
  country,
  onBack,
  onOpenRecord,
}) => {
  const [history, setHistory] = useState<CountryTravelHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        setFailed(false);
        try {
          const data = await getCountryHistory(country.countryCode);
          if (alive) {
            setHistory(data);
          }
        } catch {
          if (alive) {
            setHistory(null);
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
    }, [country.countryCode]),
  );

  const records = history?.trips ?? [];
  // 도시는 서버가 이미 중복 없이 준다
  const cities = history?.cities ?? [];

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

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
              {/* 대륙·첫 방문일은 서버가 주지 않는다 */}
              <Text style={s.countryMeta}>{country.countryCode}</Text>
            </View>
          </View>

          <View style={s.statsRow}>
            {[
              { value: `${history?.visitCount ?? 0}회`, label: '방문 횟수' },
              { value: `${cities.length}곳`, label: '방문 도시' },
              // 사진 수는 세계지도 API 가 주지 않는다. 여행 카드 수로 둔다
              { value: `${records.length}건`, label: '여행 기록' },
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
              <Text style={s.emptyText}>
                {failed
                  ? '기록을 불러오지 못했어요'
                  : '아직 남긴 기록이 없어요'}
              </Text>
              <Text style={s.emptyDesc}>
                {failed
                  ? '잠시 후 다시 시도해주세요.'
                  : `${country.countryName} 여행 기록을 남겨보세요.`}
              </Text>
            </View>
          ) : (
            records.map(r => (
              <TouchableOpacity
                key={r.tripCardId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => onOpenRecord?.(r.tripCardId)}
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
                    />
                  ))}
                </View>

                <View style={s.cardFoot}>
                  {/* 서버가 제목을 주지 않아 도시 이름을 쓴다 */}
                  <Text style={s.cardTitle} numberOfLines={1}>
                    {r.cityName}
                  </Text>
                  <Text style={s.cardMeta}>
                    {formatDateRange(r.startDate, r.endDate)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CountryRecordView;
