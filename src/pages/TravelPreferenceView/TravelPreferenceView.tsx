import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { travelPreferenceStyles as s } from './TravelPreferenceView.styles';
import colors from '../../shared/tokens/colors';
import { touch48 } from '../../shared/ui/hitSlop';
import {
  getTravelPreference,
  PreferredTransport,
  saveTravelPreference,
  TravelPreference,
} from '../../entities/profile/api';
import { ChevronLeftIcon, MinusIcon, PlusIcon } from '../../shared/ui/icons';

const TRANSPORTS: { value: PreferredTransport; label: string }[] = [
  { value: 'WALKING', label: '걸어서' },
  { value: 'PUBLIC_TRANSIT', label: '대중교통' },
  { value: 'TAXI', label: '택시' },
  { value: 'CAR', label: '자가용' },
];
const MIN_COUNT = 1;
const MAX_COUNT = 10;

interface Props {
  onBack?: () => void;
}

/** 여행 편의 설정. 고르지 않아도 되고, AI 가 일정을 짤 때만 쓴다 */
const TravelPreferenceView: React.FC<Props> = ({ onBack }) => {
  const [pref, setPref] = useState<TravelPreference | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getTravelPreference()
      .then(setPref)
      .catch(() =>
        Alert.alert('설정을 불러오지 못했어요', '잠시 후 다시 시도해주세요.', [
          { text: '확인', onPress: onBack },
        ]),
      );
  }, [onBack]);

  const save = async () => {
    if (!pref || saving) {
      return;
    }
    setSaving(true);
    try {
      await saveTravelPreference(pref);
      onBack?.();
    } catch (e: any) {
      Alert.alert(
        '저장하지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      setSaving(false);
    }
  };

  const chip = (label: string, on: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={label}
      style={[s.chip, on && s.chipOn]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
    >
      <Text style={[s.chipText, on && s.chipTextOn]}>{label}</Text>
    </TouchableOpacity>
  );

  const count = pref?.dailyScheduleCount ?? MIN_COUNT;
  const setCount = (next: number) =>
    setPref(p =>
      p
        ? {
            ...p,
            dailyScheduleCount: Math.min(MAX_COUNT, Math.max(MIN_COUNT, next)),
          }
        : p,
    );

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={touch48(32)}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
        >
          <View style={s.back}>
            <ChevronLeftIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
        <Text style={s.title}>여행 편의 설정</Text>
      </SafeAreaView>

      {!pref ? (
        <ActivityIndicator style={s.loading} color={colors.primary} />
      ) : (
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.lead}>
            AI가 일정을 짤 때 참고해요. 정하지 않아도 괜찮아요.
          </Text>

          <Text style={s.section}>주로 어떻게 다니세요?</Text>
          <View style={s.chips}>
            {TRANSPORTS.map(t =>
              chip(t.label, pref.preferredTransport === t.value, () =>
                setPref({ ...pref, preferredTransport: t.value }),
              ),
            )}
          </View>

          <Text style={s.section}>계단을 오르내리기 괜찮으세요?</Text>
          <View style={s.chips}>
            {chip('괜찮아요', pref.canUseStairs, () =>
              setPref({ ...pref, canUseStairs: true }),
            )}
            {chip('어려워요', !pref.canUseStairs, () =>
              setPref({ ...pref, canUseStairs: false }),
            )}
          </View>

          <Text style={s.section}>하루에 몇 곳 다닐까요?</Text>
          <View style={s.stepper}>
            <TouchableOpacity
              style={s.stepBtn}
              accessibilityRole="button"
              accessibilityLabel="한 곳 줄이기"
              disabled={count <= MIN_COUNT}
              onPress={() => setCount(count - 1)}
            >
              <MinusIcon
                size={22}
                color={count <= MIN_COUNT ? colors.textTertiary : colors.text}
              />
            </TouchableOpacity>
            <Text style={s.count}>{count}곳</Text>
            <TouchableOpacity
              style={s.stepBtn}
              accessibilityRole="button"
              accessibilityLabel="한 곳 늘리기"
              disabled={count >= MAX_COUNT}
              onPress={() => setCount(count + 1)}
            >
              <PlusIcon
                size={22}
                color={count >= MAX_COUNT ? colors.textTertiary : colors.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={s.hint}>
            일정을 만들 때 "일정 밀도" 지침을 고르면 그쪽을 따라요.
          </Text>
        </ScrollView>
      )}

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, (!pref || saving) && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={!pref || saving}
          accessibilityRole="button"
          onPress={save}
        >
          {saving ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={s.primaryText}>저장</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default TravelPreferenceView;
