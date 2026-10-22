import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import { Text, TextInput } from '../../shared/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { planBlocksStyles as s } from './PlanBlocksView.styles';
import WizardHeader from './WizardHeader';
import colors from '../../shared/tokens/colors';
import { touch48 } from '../../shared/ui/hitSlop';
import Geolocation from '@react-native-community/geolocation';
import { currentPosition } from '../../shared/lib/locationSharing';
import PlaceSearchModal from '../../shared/ui/PlaceSearchModal';
import VoiceButton, { voiceStyles } from '../../shared/ui/VoiceButton';
import {
  AVOID_FOODS,
  AVOID_FOODS_NOTICE,
  AvoidFood,
  getTravelPreference,
  Home,
  saveTravelPreference,
  toggleAvoidFood,
  TravelPreference,
  walkingMinutesOf,
} from '../../entities/profile/api';
import {
  mobilityAnswers,
  mobilityOf,
  MOBILITY,
  Mobility,
} from '../../entities/profile/mobility';
import { getAddress, getCities } from '../../entities/main/api';
import {
  isMetro,
  isSameRegion,
  REGIONS,
  regionOf,
  shortName,
  SUGGESTED_CITIES,
} from '../../entities/region/regions';
import {
  generatePlanner,
  getBlocks,
  PlannerBlock,
  warningText,
} from '../../entities/planner/api';
import {
  chipOptions,
  densityOf,
  FEATURED,
  HIDDEN_BLOCKS,
  initialPicked,
  Picked,
  MAX_DAILY_PLACES,
  PLACE_NAME_BLOCKS,
  toggle,
  toPayload,
  walkingOf,
} from '../../entities/planner/blocks';
import { formatRange, PlanDraft } from '../../entities/planner/types';
import { ChevronDownIcon, ChevronUpIcon, PinIcon } from '../../shared/ui/icons';

// 글자를 칠 때마다 서버를 부르지 않도록 기다리는 시간
const SEARCH_DELAY_MS = 300;
// 서버 CountryCodeMapper 가 아는 이름. 이걸 넘기면 한국 안에서만 찾는다
const KOREA_FOR_SEARCH = '한국';

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  /** 플래너와 AI 초안이 만들어졌다 */
  onCreated: (plannerId: number) => void;
}

const PlanBlocksView: React.FC<Props> = ({ draft, onBack, onCreated }) => {
  // 시·도 → 시·군 두 단계로 고른다 (server #162 는 regionCode 가 필수다)
  const [regionCode, setRegionCode] = useState('');
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<string[] | null>(null);
  const [blocks, setBlocks] = useState<PlannerBlock[] | null>(null);
  const [blocksFailed, setBlocksFailed] = useState(false);
  const trip = {
    isSolo: draft.isSolo,
    dayTrip: draft.startDate === draft.endDate,
  };
  const [picked, setPicked] = useState<Picked>(() => initialPicked(trip));
  const [placeNames, setPlaceNames] = useState<Record<string, string>>({});
  const [customDensity, setCustomDensity] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [departure, setDeparture] = useState<{
    name: string;
    latitude: number;
    longitude: number;
    /** 지금 있는 곳 칩으로 고름. 이름은 그 자리 주소다 */
    here?: boolean;
  } | null>(null);
  const [locating, setLocating] = useState(false);
  const [searchingDeparture, setSearchingDeparture] = useState(false);
  const [home, setHome] = useState<Home | null>(null);
  // 여행 편의 설정에 저장된 값을 미리 골라 둔다. 여기서 바꾸면 설정도 바뀐다
  const [pref, setPref] = useState<TravelPreference | null>(null);
  const [avoidFoods, setAvoidFoods] = useState<AvoidFood[] | null>(null);
  const [mobility, setMobility] = useState<Mobility[] | null>(null);

  useEffect(() => {
    getTravelPreference()
      .then(p => {
        setHome(p.home ?? null);
        setPref(p);
        setAvoidFoods(p.avoidFoods ?? null);
        setMobility(mobilityOf(p));
      })
      .catch(() => {});
  }, []);
  // 버튼 disabled 는 렌더 값이라 연타를 다 막지 못한다
  const generatingRef = useRef(false);

  // 만드는 중에 나가서 다시 만들면 플래너가 하나 더 생긴다. 그동안만 밀어서 뒤로 가기를 막는다
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !generating });
  }, [navigation, generating]);
  useEffect(() => {
    if (!generating) {
      return;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [generating]);

  const loadBlocks = useCallback(() => {
    setBlocksFailed(false);
    getBlocks()
      .then(setBlocks)
      .catch(() => setBlocksFailed(true));
  }, []);

  useEffect(loadBlocks, [loadBlocks]);

  useEffect(() => {
    const keyword = query.trim();
    // 서버가 두 글자 미만은 빈 목록을 준다. 요청마다 돈이 나가서다
    if (keyword.length < 2) {
      setFound(null);
      return;
    }
    let alive = true;
    const timer = setTimeout(() => {
      getCities(keyword, KOREA_FOR_SEARCH)
        .then(
          list =>
            alive &&
            setFound(
              list
                .filter(
                  c => !c.regionName || isSameRegion(c.regionName, regionCode),
                )
                .map(c => c.cityName),
            ),
        )
        .catch(() => alive && setFound([]));
    }, SEARCH_DELAY_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query, regionCode]);

  const chooseRegion = (code: string) => {
    setRegionCode(code);
    setQuery('');
    setFound(null);
    const region = regionOf(code);
    setCity(region && isMetro(code) ? shortName(region.name) : '');
  };

  const resetPlace = () => {
    setRegionCode('');
    setCity('');
  };

  const chooseCity = (name: string) => {
    setCity(name);
    setQuery('');
    setFound(null);
  };

  const generate = async () => {
    if (!regionCode || !city || generatingRef.current) {
      return;
    }
    generatingRef.current = true;
    setGenerating(true);
    try {
      // 바뀐 것만 저장한다. 안 고르고 넘어가면 다음 일정 때 다시 묻는다
      const answers: Partial<TravelPreference> = {};
      if (
        pref &&
        avoidFoods &&
        (pref.avoidFoods == null ||
          [...avoidFoods].sort().join() !== [...pref.avoidFoods].sort().join())
      ) {
        answers.avoidFoods = avoidFoods;
      }
      const nextMobility =
        pref && mobility ? mobilityAnswers(mobility, pref) : null;
      if (pref && nextMobility) {
        if (
          nextMobility.usesWheelchair !== pref.usesWheelchair ||
          nextMobility.limitedWalking !== pref.limitedWalking ||
          nextMobility.maxWalkingMinutes !== walkingMinutesOf(pref) ||
          nextMobility.canUseStairs !== pref.canUseStairs
        ) {
          Object.assign(answers, nextMobility);
        }
      }
      if (pref && Object.keys(answers).length > 0) {
        await saveTravelPreference({ ...pref, ...answers }).catch(() => {});
      }
      const walking = walkingOf(mobility, nextMobility?.maxWalkingMinutes);
      const payload = toPayload(
        walking ? { ...picked, WALKING: [walking] } : picked,
        placeNames,
      );
      const schedule = await generatePlanner({
        title: draft.title,
        memberCount: draft.headcount,
        isSolo: draft.isSolo,
        regionCode,
        cityName: city,
        startDate: draft.startDate,
        endDate: draft.endDate,
        blocks: payload,
        departurePoint: departure
          ? {
              placeName: departure.name,
              latitude: departure.latitude,
              longitude: departure.longitude,
            }
          : undefined,
      });
      const warning = warningText(schedule.warnings);
      if (warning) {
        Alert.alert('확인해 주세요', warning, [
          { text: '확인', onPress: () => onCreated(schedule.plannerId) },
        ]);
      } else {
        onCreated(schedule.plannerId);
      }
    } catch (e: any) {
      // 서버 문구를 그대로 쓴다. "반드시 포함할 곳이 3곳인데…" 처럼 고칠 방법까지 담겨 있다
      Alert.alert(
        '일정을 만들지 못했어요',
        e?.message ?? '잠시 후 다시 시도해주세요.',
      );
    } finally {
      generatingRef.current = false;
      setGenerating(false);
    }
  };

  const renderDeparture = (block: PlannerBlock) => {
    const here = !!departure?.here;
    const atHome =
      !departure && !!home && usesHome(picked.DEPARTURE_PLACE?.[0]);
    const chip = (
      label: string,
      on: boolean,
      onPress: () => void,
      icon?: React.ReactNode,
    ) => (
      <TouchableOpacity
        key={label}
        style={[s.chip, s.locate, on && s.chipOn]}
        activeOpacity={0.8}
        disabled={locating}
        hitSlop={touch48(44, 'vertical')}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={onPress}
      >
        {icon}
        <Text style={[s.chipText, on && s.chipTextOn]}>{label}</Text>
      </TouchableOpacity>
    );
    return (
      <View key={block.type} style={s.block}>
        <Text style={s.blockLabel}>{block.label}</Text>
        <View style={s.chips}>
          {chip(
            '장소 찾기',
            !!departure && !here,
            () => setSearchingDeparture(true),
            <PinIcon
              size={16}
              color={
                !!departure && !here ? colors.textOnPrimary : colors.primary
              }
            />,
          )}
          {chip('우리 집', atHome, () => {
            if (!home) {
              Alert.alert(
                '알림',
                '마이 > 여행 편의 설정에서 우리 집을 먼저 등록해주세요.',
              );
              return;
            }
            setDeparture(null);
            pickDeparture(HOME);
          })}
          {chip(locating ? '위치 찾는 중…' : HERE, here, locateDeparture)}
        </View>
        <View style={s.departure}>
          <Text style={s.departureText}>
            출발지:{' '}
            {departure
              ? departure.name
              : atHome
              ? `우리 집 (${home?.name})`
              : '정하지 않음'}
          </Text>
          <Text style={s.departureHint}>
            첫날 첫 방문지를 출발지에서 가까운 곳으로 정해요. 다른 도시에서
            출발한다면 여행지에 도착하는 역이나 터미널을 골라 주세요.
          </Text>
        </View>
      </View>
    );
  };

  const renderBlock = (block: PlannerBlock) => {
    if (block.type === 'DEPARTURE_PLACE') {
      return renderDeparture(block);
    }
    if (PLACE_NAME_BLOCKS.includes(block.type)) {
      return (
        <View key={block.type} style={s.block}>
          <Text style={s.blockLabel}>{block.label}</Text>
          <TextInput
            style={s.input}
            placeholder="장소 이름을 쉼표로 나눠 적어주세요"
            placeholderTextColor={colors.placeholder}
            value={placeNames[block.type] ?? ''}
            onChangeText={text =>
              setPlaceNames(prev => ({ ...prev, [block.type]: text }))
            }
            accessibilityLabel={block.label}
            maxLength={200}
          />
        </View>
      );
    }
    const values = picked[block.type] ?? [];
    return (
      <View key={block.type} style={s.block}>
        <Text style={s.blockLabel}>
          {block.label}
          {block.multiple ? (
            <Text style={s.blockHint}> 여러 개 고를 수 있어요</Text>
          ) : null}
        </Text>
        <View style={s.chips}>
          {chipOptions(block, trip).map(option => {
            const on = values.includes(option);
            return (
              <TouchableOpacity
                key={option}
                style={[s.chip, on && s.chipOn]}
                activeOpacity={0.8}
                hitSlop={touch48(44, 'vertical')}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  if (block.type === 'DAILY_DENSITY') {
                    setCustomDensity('');
                  }
                  setPicked(prev => toggle(prev, block, option));
                }}
              >
                <Text style={[s.chipText, on && s.chipTextOn]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {block.type === 'DAILY_DENSITY' && (
          <TextInput
            style={s.input}
            placeholder={`직접 입력 (하루 1~${MAX_DAILY_PLACES}곳)`}
            placeholderTextColor={colors.placeholder}
            value={customDensity}
            keyboardType="number-pad"
            maxLength={2}
            accessibilityLabel="하루에 갈 장소 수 직접 입력"
            onChangeText={text => {
              const parsed = densityOf(text);
              setCustomDensity(parsed ? parsed.digits : '');
              setPicked(prev => ({
                ...prev,
                DAILY_DENSITY: parsed ? [parsed.value] : [],
              }));
            }}
          />
        )}
      </View>
    );
  };

  const pickDeparture = (value: string) =>
    setPicked(prev => ({ ...prev, DEPARTURE_PLACE: [value] }));

  const locateDeparture = () => {
    setLocating(true);
    Geolocation.requestAuthorization();
    currentPosition()
      .then(async p => {
        const address = await getAddress(p.latitude, p.longitude).catch(
          () => null,
        );
        setDeparture({ name: address ?? HERE, ...p, here: true });
        pickDeparture(CUSTOM);
      })
      .catch(() =>
        Alert.alert(
          '알림',
          '지금 위치를 찾지 못했어요. 위치 권한을 확인해주세요.',
        ),
      )
      .finally(() => setLocating(false));
  };

  const asked = (blocks ?? []).filter(b => !HIDDEN_BLOCKS.includes(b.type));
  const featured = asked.filter(
    b => FEATURED.includes(b.type) || PLACE_NAME_BLOCKS.includes(b.type),
  );
  const rest = asked.filter(
    b => !FEATURED.includes(b.type) && !PLACE_NAME_BLOCKS.includes(b.type),
  );
  const pickedCount = toPayload(picked, placeNames).length;

  return (
    <View style={s.safeArea}>
      <WizardHeader
        title="여행지와 취향"
        step={3}
        onBack={generating ? undefined : onBack}
      />

      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={s.trip}>
          <Text style={s.tripText}>
            {draft.title} · {formatRange(draft.startDate, draft.endDate)} ·{' '}
            {draft.headcount}명
          </Text>
        </View>

        <Text style={s.section}>어디로 가세요?</Text>
        {regionCode && city ? (
          <View style={s.cityPicked}>
            <View style={s.cityPickedName}>
              <PinIcon size={18} color={colors.primary} />
              <Text style={s.cityPickedText}>
                {shortName(regionOf(regionCode)?.name ?? '')}
                {isMetro(regionCode) ? '' : ` ${city}`}
              </Text>
            </View>
            <TouchableOpacity
              hitSlop={touch48(24)}
              accessibilityRole="button"
              accessibilityLabel="지역 다시 고르기"
              onPress={resetPlace}
            >
              <Text style={s.cityChange}>바꾸기</Text>
            </TouchableOpacity>
          </View>
        ) : !regionCode ? (
          <View style={s.chips}>
            {REGIONS.map(region => (
              <TouchableOpacity
                key={region.code}
                style={s.chip}
                activeOpacity={0.8}
                hitSlop={touch48(44, 'vertical')}
                accessibilityRole="button"
                accessibilityLabel={region.name}
                onPress={() => chooseRegion(region.code)}
              >
                <Text style={s.chipText}>{shortName(region.name)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <>
            <View style={s.cityPicked}>
              <View style={s.cityPickedName}>
                <PinIcon size={18} color={colors.primary} />
                <Text style={s.cityPickedText}>
                  {regionOf(regionCode)?.name}
                </Text>
              </View>
              <TouchableOpacity
                hitSlop={touch48(24)}
                accessibilityRole="button"
                accessibilityLabel="시·도 다시 고르기"
                onPress={resetPlace}
              >
                <Text style={s.cityChange}>바꾸기</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.sectionHint}>어느 도시로 가세요?</Text>
            <View style={voiceStyles.row}>
              <TextInput
                style={[s.input, voiceStyles.input]}
                placeholder="도시 이름으로 찾기 (예: 강릉)"
                placeholderTextColor={colors.placeholder}
                value={query}
                onChangeText={setQuery}
                accessibilityLabel="여행할 도시 찾기"
              />
              <VoiceButton onText={setQuery} />
            </View>
            <View style={s.chips}>
              {(found ?? SUGGESTED_CITIES[regionCode] ?? []).map(name => (
                <TouchableOpacity
                  key={name}
                  style={s.chip}
                  activeOpacity={0.8}
                  hitSlop={touch48(44, 'vertical')}
                  accessibilityRole="button"
                  onPress={() => chooseCity(name)}
                >
                  <Text style={s.chipText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {found?.length === 0 && (
              <Text style={s.empty}>찾는 도시가 없어요</Text>
            )}
          </>
        )}

        {pref && (
          <>
            <Text style={s.section}>다니실 때 불편한 점이 있으세요?</Text>
            <Text style={s.sectionHint}>
              AI가 장소를 고를 때 참고해요. {rememberNote(mobilityOf(pref))}
            </Text>
            <View style={[s.chips, s.block]}>
              {[...MOBILITY, { value: null, label: '괜찮아요' }].map(m => {
                const on =
                  m.value === null
                    ? mobility?.length === 0
                    : !!mobility?.includes(m.value);
                return (
                  <TouchableOpacity
                    key={m.label}
                    style={[s.chip, on && s.chipOn]}
                    activeOpacity={0.8}
                    hitSlop={touch48(44, 'vertical')}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() =>
                      setMobility(prev => {
                        if (m.value === null) {
                          return [];
                        }
                        const list = prev ?? [];
                        return list.includes(m.value)
                          ? list.filter(v => v !== m.value)
                          : [...list, m.value];
                      })
                    }
                  >
                    <Text style={[s.chipText, on && s.chipTextOn]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {pref && (
          <>
            <Text style={s.section}>피하는 음식이 있으세요?</Text>
            <Text style={s.sectionHint}>
              AI가 맛집을 고를 때 빼요. {AVOID_FOODS_NOTICE}{' '}
              {rememberNote(pref.avoidFoods)}
            </Text>
            <View style={[s.chips, s.block]}>
              {[...AVOID_FOODS, { value: null, label: '없어요' }].map(f => {
                const on =
                  f.value === null
                    ? avoidFoods?.length === 0
                    : !!avoidFoods?.includes(f.value);
                return (
                  <TouchableOpacity
                    key={f.label}
                    style={[s.chip, on && s.chipOn]}
                    activeOpacity={0.8}
                    hitSlop={touch48(44, 'vertical')}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() =>
                      setAvoidFoods(prev =>
                        f.value === null ? [] : toggleAvoidFood(prev, f.value),
                      )
                    }
                  >
                    <Text style={[s.chipText, on && s.chipTextOn]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <Text style={s.section}>어떤 여행을 원하세요?</Text>
        <Text style={s.sectionHint}>
          고른 대로 AI가 일정을 짜요. 안 골라도 괜찮아요.
        </Text>

        {blocksFailed ? (
          <TouchableOpacity
            style={s.retry}
            onPress={loadBlocks}
            accessibilityRole="button"
          >
            <Text style={s.retryText}>
              선택지를 불러오지 못했어요. 다시 불러오기
            </Text>
          </TouchableOpacity>
        ) : !blocks ? (
          <ActivityIndicator style={s.loading} color={colors.primary} />
        ) : (
          <>
            {featured.map(renderBlock)}
            <TouchableOpacity
              style={s.more}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ expanded: showAll }}
              onPress={() => setShowAll(v => !v)}
            >
              <View style={s.moreRow}>
                <Text style={s.moreText}>
                  {showAll
                    ? '간단히 보기'
                    : `더 자세히 정하기 (${rest.length}가지)`}
                </Text>
                {showAll ? (
                  <ChevronUpIcon size={16} color={colors.primary} />
                ) : (
                  <ChevronDownIcon size={16} color={colors.primary} />
                )}
              </View>
            </TouchableOpacity>
            {showAll && rest.map(renderBlock)}
          </>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        {generating && (
          <Text style={s.waiting}>AI가 일정을 짜고 있어요. 10초쯤 걸려요.</Text>
        )}
        <TouchableOpacity
          style={[
            s.primaryBtn,
            (!regionCode || !city || generating) && s.primaryBtnOff,
          ]}
          activeOpacity={0.85}
          disabled={!regionCode || !city || generating}
          accessibilityRole="button"
          onPress={generate}
        >
          {generating ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={s.primaryText}>
              {city
                ? `AI로 일정 만들기${
                    pickedCount > 0 ? ` · ${pickedCount}개 반영` : ''
                  }`
                : '어디로 갈지 먼저 골라주세요'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
      <PlaceSearchModal
        visible={searchingDeparture}
        title="출발지 찾기"
        placeholder="예) 동대구역, 우리 동네"
        onSelect={place => {
          setSearchingDeparture(false);
          setDeparture(place);
          pickDeparture(CUSTOM);
        }}
        onClose={() => setSearchingDeparture(false)}
      />
    </View>
  );
};

/** 처음 묻는지, 저장된 값을 채워 보여주는지에 따라 안내가 다르다 */
function rememberNote(saved: unknown[] | null | undefined): string {
  return saved == null
    ? '다음 계획부터는 고른 대로 미리 채워둘게요.'
    : '지난번에 고른 대로 채워뒀어요. 바꾸면 다음 계획에도 적용돼요.';
}

const HOME = '집 근처';
const CUSTOM = '직접 지정';
export const HERE = '지금 있는 곳';

function usesHome(value: string | undefined): boolean {
  return !value || value === HOME;
}

export default PlanBlocksView;
