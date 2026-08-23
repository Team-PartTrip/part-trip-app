import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { achievementStyles as s } from './AchievementView.styles';
import { sampleMilestones, sampleSummary } from '../../entities/worldmap/sampleData';

interface Props {
  onBack?: () => void;
}

const AchievementView: React.FC<Props> = ({ onBack }) => {
  const { visitedCount, totalCount, continents } = sampleSummary;
  const percent = Math.round((visitedCount / totalCount) * 1000) / 10;
  const doneCount = sampleMilestones.filter(m => m.current >= m.goal).length;

  return (
    <View style={s.safeArea}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={s.header}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
          <Text style={s.title}>여행 달성 현황</Text>

          <Text style={s.headline}>
            {totalCount}개국 중 {visitedCount}개국을 다녀왔어요
          </Text>
          <View style={s.percentRow}>
            <Text style={s.percent}>{percent}</Text>
            <Text style={s.percentUnit}>%</Text>
          </View>

          <View style={s.headerTrack}>
            {/* 1% 미만이어도 막대가 보이도록 최소 너비를 준다 */}
            <View style={[s.headerFill, { width: `${Math.max(percent, 2)}%` }]} />
          </View>
        </SafeAreaView>

        <View style={s.section}>
          <Text style={s.sectionTitle}>대륙별 달성</Text>
          <View style={s.grid}>
            {continents.map(c => (
              <View key={c.code} style={s.continentCard}>
                <Text style={s.continentName}>{c.name}</Text>
                <Text style={s.continentCount}>
                  {c.visited} / {c.total}개국
                </Text>
                <View style={s.track}>
                  <View
                    style={[s.fill, { width: `${(c.visited / c.total) * 100}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>
            달성 뱃지 {doneCount}/{sampleMilestones.length}
          </Text>

          {sampleMilestones.map(m => {
            const done = m.current >= m.goal;
            return (
              <View key={m.key} style={s.milestone}>
                <View style={[s.milestoneIcon, done && s.milestoneIconDone]}>
                  <Text style={s.milestoneIconText}>{done ? '🏅' : '🔒'}</Text>
                </View>
                <View style={s.milestoneBody}>
                  <Text style={[s.milestoneLabel, !done && s.milestoneLabelLocked]}>
                    {m.label}
                  </Text>
                  <Text style={s.milestoneDesc}>{m.desc}</Text>
                </View>
                <View style={s.milestoneRight}>
                  {done ? (
                    <View style={s.doneBadge}>
                      <Text style={s.doneBadgeText}>달성</Text>
                    </View>
                  ) : (
                    <Text style={s.progressText}>
                      {m.current} / {m.goal}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Text style={s.note}>
          세계지도 API 연동 전이라 예시 데이터로 보여주고 있어요.
        </Text>
      </ScrollView>
    </View>
  );
};

export default AchievementView;
