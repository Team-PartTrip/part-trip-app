import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planBlocksStyles as s } from './PlanBlocksView.styles';
import WizardHeader from './WizardHeader';
import colors from '../../shared/tokens/colors';
import { touch48 } from '../../shared/ui/hitSlop';
import { getCities } from '../../entities/main/api';
import {
  generatePlanner,
  getBlocks,
  PlannerBlock,
} from '../../entities/planner/api';
import {
  chipOptions,
  FEATURED,
  Picked,
  PLACE_NAME_BLOCKS,
  toggle,
  toPayload,
} from '../../entities/planner/blocks';
import { formatRange, PlanDraft } from '../../entities/planner/types';

// 글자를 칠 때마다 서버를 부르지 않도록 기다리는 시간
const SEARCH_DELAY_MS = 300;
// 서버 CountryCodeMapper 가 아는 이름. 이걸 넘기면 한국 안에서만 찾는다
const KOREA = '한국';
// 9/17 회의 자료 "여행지 (국내)" 의 예시 도시
const SUGGESTED = [
  '서울',
  '부산',
  '제주',
  '경주',
  '전주',
  '강릉',
  '여수',
  '통영',
  '안동',
  '속초',
];

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  /** 플래너와 AI 초안이 만들어졌다 */
  onCreated: (plannerId: number) => void;
}

const PlanBlocksView: React.FC<Props> = ({ draft, onBack, onCreated }) => {
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<string[] | null>(null);
  const [blocks, setBlocks] = useState<PlannerBlock[] | null>(null);
  const [blocksFailed, setBlocksFailed] = useState(false);
  const [picked, setPicked] = useState<Picked>({});
  const [placeNames, setPlaceNames] = useState<Record<string, string>>({});
  const [showAll, setShowAll] = useState(false);
  const [generating, setGenerating] = useState(false);
  // 버튼 disabled 는 렌더 값이라 연타를 다 막지 못한다
  const generatingRef = useRef(false);

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
      getCities(keyword, KOREA)
        .then(list => alive && setFound(list.map(c => c.cityName)))
        .catch(() => alive && setFound([]));
    }, SEARCH_DELAY_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query]);

  const chooseCity = (name: string) => {
    setCity(name);
    setQuery('');
    setFound(null);
  };

  const generate = async () => {
    if (!city || generatingRef.current) {
      return;
    }
    generatingRef.current = true;
    setGenerating(true);
    try {
      const schedule = await generatePlanner({
        title: draft.title,
        memberCount: draft.headcount,
        isSolo: draft.isSolo,
        cityName: city,
        startDate: draft.startDate,
        endDate: draft.endDate,
        blocks: toPayload(picked, placeNames),
      });
      onCreated(schedule.plannerId);
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

  const renderBlock = (block: PlannerBlock) => {
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
          {chipOptions(block).map(option => {
            const on = values.includes(option);
            return (
              <TouchableOpacity
                key={option}
                style={[s.chip, on && s.chipOn]}
                activeOpacity={0.8}
                hitSlop={touch48(44, 'vertical')}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => setPicked(prev => toggle(prev, block, option))}
              >
                <Text style={[s.chipText, on && s.chipTextOn]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const featured = (blocks ?? []).filter(
    b => FEATURED.includes(b.type) || PLACE_NAME_BLOCKS.includes(b.type),
  );
  const rest = (blocks ?? []).filter(
    b => !FEATURED.includes(b.type) && !PLACE_NAME_BLOCKS.includes(b.type),
  );
  const pickedCount = toPayload(picked, placeNames).length;

  return (
    <View style={s.safeArea}>
      <WizardHeader title="여행 지침" step={3} onBack={onBack} />

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
        {city ? (
          <View style={s.cityPicked}>
            <Text style={s.cityPickedText}>📍 {city}</Text>
            <TouchableOpacity
              hitSlop={touch48(24)}
              accessibilityRole="button"
              accessibilityLabel="지역 다시 고르기"
              onPress={() => setCity('')}
            >
              <Text style={s.cityChange}>바꾸기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={s.input}
              placeholder="도시 이름으로 찾기 (예: 강릉)"
              placeholderTextColor={colors.placeholder}
              value={query}
              onChangeText={setQuery}
              accessibilityLabel="여행할 도시 찾기"
            />
            <View style={s.chips}>
              {(found ?? SUGGESTED).map(name => (
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
              지침을 불러오지 못했어요. 다시 불러오기
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
              <Text style={s.moreText}>
                {showAll
                  ? '간단히 보기 ▴'
                  : `더 자세히 정하기 (${rest.length}가지) ▾`}
              </Text>
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
          style={[s.primaryBtn, (!city || generating) && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={!city || generating}
          accessibilityRole="button"
          onPress={generate}
        >
          {generating ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={s.primaryText}>
              {city
                ? `AI로 일정 만들기${
                    pickedCount > 0 ? ` · 지침 ${pickedCount}개` : ''
                  }`
                : '어디로 갈지 먼저 골라주세요'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanBlocksView;
