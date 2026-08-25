import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countryAcquiredStyles as s } from './CountryAcquiredView.styles';
import {
  CountryAcquiredParams,
  formatDate,
  objectParticle,
} from '../../entities/worldmap/types';

interface Props {
  params: CountryAcquiredParams;
  onClose?: () => void;
  onOpenCountry?: () => void;
  onOpenWorldMap?: () => void;
}

const CountryAcquiredView: React.FC<Props> = ({
  params,
  onClose,
  onOpenCountry,
  onOpenWorldMap,
}) => {
  const ratio =
    params.continentTotal > 0
      ? params.continentVisited / params.continentTotal
      : 0;

  return (
    <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onClose} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>

        <View style={s.halo}>
          <View style={s.badge}>
            <Text style={s.badgeCode}>{params.countryCode}</Text>
          </View>
          <View style={s.newPill}>
            <Text style={s.newPillText}>NEW</Text>
          </View>
        </View>

        <Text style={s.headline}>
          {params.countryName}
          {objectParticle(params.countryName)} 획득했어요!
        </Text>
        <Text style={s.sub}>
          {params.cityName} 여행 기록을 바탕으로 자동 등록됐어요
        </Text>

        <View style={s.infoCard}>
          {[
            {
              label: '국가',
              value: `${params.countryName} (${params.countryNameEn})`,
            },
            { label: '대륙', value: params.continentName },
            { label: '첫 방문', value: formatDate(params.acquiredAt) },
            { label: '방문 횟수', value: `${params.visitCount}회` },
          ].map(row => (
            <View key={row.label} style={s.infoRow}>
              <Text style={s.infoLabel}>{row.label}</Text>
              <Text style={s.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={s.notice}>
          <Text style={s.noticeText}>
            이미 획득한 국가는 중복 등록되지 않아요
          </Text>
        </View>

        <View style={s.progressCard}>
          <View style={s.progressTop}>
            <Text style={s.progressLabel}>{params.continentName} 진행도</Text>
            <Text style={s.progressCount}>
              {params.continentVisited} / {params.continentTotal}
            </Text>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${ratio * 100}%` }]} />
          </View>
        </View>

        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          onPress={onOpenWorldMap}
        >
          <Text style={s.primaryBtnText}>세계지도에서 보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.secondaryBtn}
          activeOpacity={0.85}
          onPress={onOpenCountry}
        >
          <Text style={s.secondaryBtnText}>기록 보러가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CountryAcquiredView;
