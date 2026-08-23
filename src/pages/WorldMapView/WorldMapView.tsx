import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { worldMapStyles as s } from './WorldMapView.styles';
import { sampleSummary } from '../../entities/worldmap/sampleData';
import { flagOf, formatDate, VisitedCountry } from '../../entities/worldmap/types';

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
  const { visitedCount, totalCount, continents, countries } = sampleSummary;
  const percent = Math.round((visitedCount / totalCount) * 1000) / 10;
  const continentCount = continents.filter(c => c.visited > 0).length;
  const totalVisits = countries.reduce((sum, c) => sum + c.visitCount, 0);

  return (
    <View style={s.safeArea}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
          <Text style={s.title}>내 세계지도</Text>

          <View style={s.bigCount}>
            <Text style={s.bigValue}>{visitedCount}</Text>
            <Text style={s.bigTotal}>/ {totalCount}개국</Text>
          </View>
          <Text style={s.bigCaption}>전 세계의 {percent}%를 여행했어요</Text>

          <View style={s.headerTrack}>
            {/* 1% 미만이어도 막대가 보이도록 최소 너비를 준다 */}
            <View style={[s.headerFill, { width: `${Math.max(percent, 2)}%` }]} />
          </View>
        </SafeAreaView>

        <View style={s.summaryCard}>
          {[
            { value: String(continentCount), label: '대륙' },
            { value: String(visitedCount), label: '국가' },
            { value: String(totalVisits), label: '방문' },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={s.summaryDivider} />}
              <View style={s.summaryCol}>
                <Text style={s.summaryValue}>{item.value}</Text>
                <Text style={s.summaryLabel}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={s.section}>
          <View style={s.sectionHead}>
            <Text style={s.sectionTitle}>대륙별 진행</Text>
            <TouchableOpacity onPress={onOpenAchievement} hitSlop={8}>
              <Text style={s.sectionMore}>달성 현황 ›</Text>
            </TouchableOpacity>
          </View>

          {continents.map(c => (
            <View key={c.code} style={s.continentRow}>
              <View style={s.continentTop}>
                <Text style={s.continentName}>{c.name}</Text>
                <Text style={s.continentCount}>
                  {c.visited} / {c.total}
                </Text>
              </View>
              <View style={s.track}>
                <View
                  style={[s.fill, { width: `${(c.visited / c.total) * 100}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>획득한 국가</Text>

          {countries.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>아직 획득한 국가가 없어요</Text>
              <Text style={s.emptyDesc}>여행 기록을 남기면 국가가 채워져요.</Text>
            </View>
          ) : (
            <View style={s.grid}>
              {countries.map(c => (
                <TouchableOpacity
                  key={c.countryInfoId}
                  style={s.countryCard}
                  activeOpacity={0.85}
                  onPress={() => onOpenCountry?.(c)}
                >
                  <Text style={s.countryFlag}>{flagOf(c.countryCode)}</Text>
                  <Text style={s.countryName}>{c.countryName}</Text>
                  <Text style={s.countryMeta}>
                    {formatDate(c.firstVisitedAt)} 획득
                  </Text>
                  <View style={s.visitBadge}>
                    <Text style={s.visitBadgeText}>{c.visitCount}번 방문</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
