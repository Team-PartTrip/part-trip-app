import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { worldMapStyles as s } from './WorldMapView.styles';
import { sampleSummary } from '../../entities/worldmap/sampleData';
import { flagOf, VisitedCountry } from '../../entities/worldmap/types';

// 피그마 E2 의 지도 일러스트. 402pt 프레임 안의 좌표를 그대로 적고,
// 실제 화면 폭에 맞춰 비율로 늘린다. (퍼센트 + aspectRatio 로 짜면
// 칸이 자리만 차지하고 안 그려지는 문제가 있어 픽셀로 계산한다)
const FRAME_WIDTH = 402;
const MAP_HEIGHT = 420;

interface Landmass {
  x: number;
  y: number;
  w: number;
  h: number;
  /** 방문한 대륙 덩어리는 파랗게 칠한다 */
  visited: boolean;
}

const LANDMASSES: Landmass[] = [
  { x: 40, y: 42, w: 90, h: 70, visited: false },
  { x: 140, y: 22, w: 120, h: 90, visited: true },
  { x: 268, y: 60, w: 90, h: 60, visited: true },
  { x: 60, y: 142, w: 110, h: 80, visited: false },
  { x: 186, y: 154, w: 120, h: 86, visited: true },
  { x: 300, y: 162, w: 70, h: 64, visited: true },
  { x: 92, y: 260, w: 120, h: 70, visited: false },
  { x: 232, y: 254, w: 120, h: 76, visited: true },
];

interface Props {
  onBack?: () => void;
  onOpenCountry?: (country: VisitedCountry) => void;
  onOpenAchievement?: () => void;
}

const WorldMapView: React.FC<Props> = ({
  onBack,
  onOpenCountry,
  onOpenAchievement,
}) => {
  const { visitedCount, countries } = sampleSummary;
  const scale = Dimensions.get('window').width / FRAME_WIDTH;

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView edges={['top']} style={s.header}>
          <View style={s.headerRow}>
            <Text style={s.title}>내 세계지도</Text>
            <TouchableOpacity onPress={onBack} hitSlop={12} style={s.backBtn}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={[s.map, { height: MAP_HEIGHT * scale }]}>
          {LANDMASSES.map((land, i) => (
            <View
              key={i}
              style={[
                s.landmass,
                land.visited ? s.landmassVisited : s.landmassIdle,
                {
                  left: land.x * scale,
                  top: land.y * scale,
                  width: land.w * scale,
                  height: land.h * scale,
                },
              ]}
            />
          ))}
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
            <Text style={s.sectionTitle}>획득한 국가</Text>
            {/* 피그마에는 없지만 달성 현황(E5)으로 들어갈 길이 여기밖에 없다 */}
            <TouchableOpacity onPress={onOpenAchievement} hitSlop={8}>
              <Text style={s.sectionMore}>달성 현황 ›</Text>
            </TouchableOpacity>
          </View>

          {countries.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>아직 획득한 국가가 없어요</Text>
              <Text style={s.emptyDesc}>여행 기록을 남기면 국가가 채워져요.</Text>
            </View>
          ) : (
            countries.map(c => (
              <TouchableOpacity
                key={c.countryInfoId}
                style={s.countryRow}
                activeOpacity={0.85}
                onPress={() => onOpenCountry?.(c)}
              >
                <View style={s.flagCircle}>
                  <Text style={s.flag}>{flagOf(c.countryCode)}</Text>
                </View>
                <View style={s.countryBody}>
                  <Text style={s.countryName}>{c.countryName}</Text>
                  <Text style={s.countryMeta}>{c.visitCount}회 방문</Text>
                </View>
                <Text style={s.chevron}>›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={s.note}>
          세계지도 API 연동 전이라 예시 데이터로 보여주고 있어요.
        </Text>
      </ScrollView>
    </View>
  );
};

export default WorldMapView;
