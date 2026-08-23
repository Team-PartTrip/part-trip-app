import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { countryAcquiredStyles as s } from './CountryAcquiredView.styles';
import {
  CountryAcquiredParams,
  flagOf,
  formatDate,
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
}) => (
  <SafeAreaView style={s.safeArea} edges={['top', 'bottom']}>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={onClose} hitSlop={12}>
        <Text style={s.close}>✕</Text>
      </TouchableOpacity>

      <View style={s.body}>
        <View style={s.ribbon}>
          <Text style={s.ribbonText}>NEW COUNTRY</Text>
        </View>

        <View style={s.flagCircle}>
          <Text style={s.flag}>{flagOf(params.countryCode)}</Text>
        </View>

        <Text style={s.headline}>{params.countryName}을(를) 획득했어요!</Text>
        <Text style={s.sub}>
          세계지도에 {params.countryName}이(가) 칠해졌어요.{'\n'}
          기록을 남기면 여행이 더 오래 남아요.
        </Text>

        <View style={s.statsCard}>
          {[
            { value: `${params.order}번째`, label: '획득 국가', small: false },
            { value: params.continentName, label: '대륙', small: false },
            { value: formatDate(params.acquiredAt), label: '획득일', small: true },
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
      </View>

      <TouchableOpacity style={s.primaryBtn} activeOpacity={0.85} onPress={onOpenCountry}>
        <Text style={s.primaryBtnText}>기록 보러가기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.85} onPress={onOpenWorldMap}>
        <Text style={s.secondaryBtnText}>세계지도에서 보기</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>
);

export default CountryAcquiredView;
