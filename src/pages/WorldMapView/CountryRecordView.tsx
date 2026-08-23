import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countryRecordStyles as s } from './CountryRecordView.styles';
import { sampleRecordsOf } from '../../entities/worldmap/sampleData';
import { flagOf, formatDate, VisitedCountry } from '../../entities/worldmap/types';

interface Props {
  country: VisitedCountry;
  onBack?: () => void;
  onOpenRecord?: (recordId: number) => void;
}

const CountryRecordView: React.FC<Props> = ({ country, onBack, onOpenRecord }) => {
  const records = sampleRecordsOf(country.countryInfoId);
  const photoTotal = records.reduce((sum, r) => sum + r.photoCount, 0);

  return (
    <View style={s.safeArea}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
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
                {formatDate(country.firstVisitedAt)} 처음 방문
              </Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={s.statsCard}>
          {[
            { value: `${country.visitCount}번`, label: '방문', small: false },
            {
              value: formatDate(country.lastVisitedAt ?? country.firstVisitedAt),
              label: '최근 방문',
              small: true,
            },
            { value: String(photoTotal), label: '사진', small: false },
          ].map((item, i) => (
            <React.Fragment key={item.label}>
              {i > 0 && <View style={s.statDivider} />}
              <View style={s.statCol}>
                <Text style={item.small ? s.statValueSm : s.statValue}>
                  {item.value}
                </Text>
                <Text style={s.statLabel}>{item.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

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
            records.map(r => (
              <TouchableOpacity
                key={r.recordId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => onOpenRecord?.(r.recordId)}
              >
                <View style={s.thumb}>
                  <Text style={s.thumbText}>{r.photoCount}장</Text>
                </View>
                <View style={s.cardBody}>
                  <Text style={s.cardTitle} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Text style={s.cardMeta}>
                    {r.cityName}  ·  {formatDate(r.visitedAt)}
                  </Text>
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

export default CountryRecordView;
