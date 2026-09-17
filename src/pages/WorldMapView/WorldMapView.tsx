import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { worldMapStyles as s } from './WorldMapView.styles';
import WorldMapSvg from './WorldMapSvg';
import { getSummary } from '../../entities/worldmap/api';
import {
  flagOf,
  VisitedCountry,
  WorldMapSummary,
} from '../../entities/worldmap/types';

// 피그마 E2 의 지도 일러스트. 402pt 프레임 안의 좌표를 그대로 적고,
// 실제 화면 폭에 맞춰 비율로 늘린다. (퍼센트 + aspectRatio 로 짜면

interface Props {
  onBack?: () => void;
  onOpenCountry?: (country: VisitedCountry) => void;
}

const WorldMapView: React.FC<Props> = ({
  onBack,
  onOpenCountry,
}) => {
  const { width } = useWindowDimensions();
  const [summary, setSummary] = useState<WorldMapSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        setFailed(false);
        try {
          const data = await getSummary();
          if (alive) {
            setSummary(data);
          }
        } catch {
          if (alive) {
            setSummary(null);
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
    }, []),
  );

  const visitedCount = summary?.visitedCount ?? 0;
  const countries = summary?.countries ?? [];

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
          <View style={s.headerRow}>
            <Text style={s.title}>내가 다녀온 곳</Text>
            <TouchableOpacity onPress={onBack} hitSlop={12} style={s.backBtn}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={s.map}>
          <WorldMapSvg
            visitedCodes={countries.map(c => c.countryCode)}
            width={width - 48}
          />
        </View>

        <View style={s.legend}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, s.legendDotVisited]} />
            <Text style={s.legendText}>방문한 국가 {visitedCount}</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, s.legendDotIdle]} />
            <Text style={s.legendText}>미방문</Text>
          </View>
        </View>

        <View style={s.section}>
          <View style={s.sectionHead}>
            {/* 명세 Func-006: 획득 · 달성 같은 수집 표현을 쓰지 않는다 */}
            <Text style={s.sectionTitle}>다녀온 나라</Text>
          </View>

          {countries.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>
                {failed
                  ? '지도를 불러오지 못했어요'
                  : '아직 다녀온 나라가 없어요'}
              </Text>
              <Text style={s.emptyDesc}>
                {failed
                  ? '잠시 후 다시 시도해주세요.'
                  : '여행 기록을 남기면 지도에 나라가 표시돼요.'}
              </Text>
            </View>
          ) : (
            countries.map(c => (
              <TouchableOpacity
                key={c.countryCode}
                style={s.countryRow}
                activeOpacity={0.85}
                onPress={() => onOpenCountry?.(c)}
              >
                <View style={s.flagCircle}>
                  <Text style={s.flag}>{flagOf(c.countryCode)}</Text>
                </View>
                <View style={s.countryBody}>
                  <Text style={s.countryName}>{c.countryName}</Text>
                  {/* 방문 횟수는 목록에 안 온다. 국가를 열면 받아온다 */}
                  <Text style={s.countryMeta}>{c.countryCode}</Text>
                </View>
                <Text style={s.chevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WorldMapView;
