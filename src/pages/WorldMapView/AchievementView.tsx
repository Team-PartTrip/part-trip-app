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
import { achievementStyles as s } from './AchievementView.styles';
import { getSummary } from '../../entities/worldmap/api';
import type { WorldMapSummary } from '../../entities/worldmap/types';

/**
 * 도넛 진행률.
 *
 * SVG 라이브러리가 없어서 원을 좌·우 반쪽으로 자르고, 각 반쪽 안에서
 * "위+오른쪽 두 변만 색칠한 링"을 돌려 호를 만든다. 색칠된 구간은
 * 회전각 기준 (rot-45)~(rot+135) 이므로, 진행각 deg 를 보여주려면
 * rot = deg - 135 로 두면 된다. 오른쪽 반쪽은 180도에서 멈춘다.
 */
const ProgressRing: React.FC<{ percent: number; value: number }> = ({
  percent,
  value,
}) => {
  const deg = Math.min(100, Math.max(0, percent)) * 3.6;
  const rightRotate = Math.min(deg, 180) - 135;
  const leftRotate = Math.max(deg, 180) - 135;

  return (
    <View style={s.ring}>
      <View style={[s.ringHalf, s.ringHalfRight]}>
        <View
          style={[
            s.ringArc,
            s.ringArcRight,
            { transform: [{ rotate: `${rightRotate}deg` }] },
          ]}
        />
      </View>
      <View style={[s.ringHalf, s.ringHalfLeft]}>
        <View
          style={[
            s.ringArc,
            s.ringArcLeft,
            { transform: [{ rotate: `${leftRotate}deg` }] },
          ]}
        />
      </View>
      <Text style={s.ringValue}>{value}</Text>
      <Text style={s.ringUnit}>국가</Text>
    </View>
  );
};

interface Props {
  onBack?: () => void;
}

const AchievementView: React.FC<Props> = ({ onBack }) => {
  const [summary, setSummary] = useState<WorldMapSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const data = await getSummary();
          if (alive) {
            setSummary(data);
          }
        } catch {
          if (alive) {
            setSummary(null);
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
  const totalCount = summary?.totalCount ?? 0;
  const continents = summary?.continents ?? [];
  // 0 으로 나누면 NaN% 가 화면에 그대로 찍힌다
  const percent =
    totalCount > 0 ? Math.round((visitedCount / totalCount) * 1000) / 10 : 0;

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  // 다음 목표는 10개국 단위로 올린다 (5개국 → 10개국 → 20개국 …)
  const goal = visitedCount < 10 ? 10 : Math.ceil((visitedCount + 1) / 10) * 10;

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
          <Text style={s.title}>여행 달성 현황</Text>
        </SafeAreaView>

        <View style={s.summaryCard}>
          <ProgressRing percent={percent} value={visitedCount} />

          <View style={s.summaryBody}>
            <Text style={s.summaryEyebrow}>전 세계 {totalCount}개국 중</Text>
            <Text style={s.summaryPercent}>{percent}% 달성</Text>
            <View style={s.goalPill}>
              <Text style={s.goalPillText}>다음 목표 {goal}개국</Text>
            </View>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>대륙별 현황</Text>

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

      </ScrollView>
    </View>
  );
};

export default AchievementView;
