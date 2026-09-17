import React, { useCallback, useEffect, useRef, useState } from 'react';
import { touch48 } from '../../shared/ui/hitSlop';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import type { ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { placeVoteStyles as s } from './PlaceVoteView.styles';
import colors from '../../shared/tokens/colors';
import {
  getMoreTourPlaces,
  getTourPlaces,
  TourPlace,
} from '../../entities/main/api';
import {
  cancelPlaceVote,
  confirmPlanner,
  getPlanner,
  getVotes,
  voteForPlace,
  VoteSelection,
  VoteStatusInfo,
} from '../../entities/planner/api';
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  PlaceCategory,
  VoteStatus,
} from '../../entities/planner/types';

function statusMeta(status: VoteStatus): { text: string; color: ColorValue } {
  switch (status) {
    case 'OPEN':
      return { text: '진행 중', color: colors.accent };
    case 'CONFIRMED':
      return { text: '확정', color: colors.success };
    default:
      return { text: '마감', color: colors.textTertiary };
  }
}

/**
 * 공동 1위 후보들. 하나뿐이면 동점이 아니다.
 *
 * 서버는 마감할 때 같은 계산을 하고, 동점인데 고른 것이 없으면 확정을
 * 거부한다(PlannerConfirmService). 그래서 보내기 전에 여기서 먼저 묻는다.
 * 아무도 투표하지 않은 카테고리는 후보가 모두 0표라 늘 동점이 된다.
 */
function tiedOptions(vote: VoteStatusInfo) {
  if (vote.options.length === 0) {
    return [];
  }
  const top = vote.options.reduce((max, o) => Math.max(max, o.voteCount), 0);
  const leaders = vote.options.filter(o => o.voteCount === top);
  return leaders.length > 1 ? leaders : [];
}

/** 목록 한 줄. 장소 목록과 투표 현황을 합친 것이다 */
export interface VoteRow {
  key: string;
  tourPlaceId: number | null;
  placeName: string;
  meta: string;
  voteCount: number;
  mine: boolean;
  votable: boolean;
}

/** 평점·주소가 없는 장소가 많아 있는 것만 붙인다 */
function metaOf(rating: number | null, address: string | null): string {
  return (
    [rating != null ? `★ ${rating.toFixed(1)}` : null, address]
      .filter(Boolean)
      .join(' · ') || '정보 없음'
  );
}

export function toVoteRows(
  places: TourPlace[],
  vote: VoteStatusInfo | undefined,
): VoteRow[] {
  const options = vote?.options ?? [];
  const byPlace = new Map(
    options
      .filter(o => o.tourPlaceId != null)
      .map(o => [o.tourPlaceId as number, o] as const),
  );
  const listed = new Set(places.map(p => p.tourPlaceId));

  const rows: VoteRow[] = places.map(place => {
    const option = byPlace.get(place.tourPlaceId);
    return {
      key: `place-${place.tourPlaceId}`,
      tourPlaceId: place.tourPlaceId,
      placeName: place.placeName,
      meta: metaOf(place.rating, place.address),
      voteCount: option?.voteCount ?? 0,
      mine: option?.selectedByMe ?? false,
      votable: true,
    };
  });

  for (const option of options) {
    if (option.tourPlaceId != null && listed.has(option.tourPlaceId)) {
      continue;
    }
    rows.push({
      key: `option-${option.optionId}`,
      tourPlaceId: option.tourPlaceId,
      placeName: option.placeName,
      meta: metaOf(option.rating, option.address),
      voteCount: option.voteCount,
      mine: option.selectedByMe,
      votable: false,
    });
  }
  return rows;
}

export function mergePlaces(prev: TourPlace[], incoming: TourPlace[]): TourPlace[] {
  const seen = new Set(prev.map(p => p.tourPlaceId));
  const fresh = incoming.filter(p => {
    if (seen.has(p.tourPlaceId)) {
      return false;
    }
    seen.add(p.tourPlaceId);
    return true;
  });
  return fresh.length === 0 ? prev : [...prev, ...fresh];
}

interface TripCity {
  countryName: string;
  cityName: string;
}

const cityKey = (city: TripCity) => `${city.countryName}|${city.cityName}`;

/** 목록 끝에서 한 번에 더 보여주는 개수 */
export const PAGE_SIZE = 10;

export function nextPage(
  shown: number,
  visible: number,
  total: number,
  exhausted: boolean,
): { visible: number; fetch: boolean } {
  // 지난번에 늘린 만큼 아직 못 채웠으면 더 늘리지 않는다. 받는 동안 끝에
  // 여러 번 닿아도 한 번에 10곳씩만 늘어나야 한다.
  if (shown < visible) {
    return { visible, fetch: !exhausted };
  }
  const next = visible + PAGE_SIZE;
  // 쌓아둔 게 다음 번 10곳에 모자라면 미리 받아둔다. 끝에 닿고서 받으면 멈칫한다
  return { visible: next, fetch: !exhausted && total - next < PAGE_SIZE };
}

/**
 * 목록이 비었을 때 구글에서 받아올지.
 *
 * 조건이 틀리면 구글 API 를 끝없이 부른다. 요금이 나가는 자리라 테스트로
 * 고정한다.
 */
export function shouldAutoFetch(state: {
  loading: boolean;
  busy: boolean;
  failed: boolean;
  count: number;
  exhausted: boolean;
  generation: number;
  fetchedGeneration: number;
}): boolean {
  if (
    state.loading ||
    state.busy ||
    state.failed ||
    state.count > 0 ||
    state.exhausted
  ) {
    return false;
  }
  // 카테고리나 도시가 바뀔 때마다 한 번씩만
  return state.fetchedGeneration !== state.generation;
}

interface Props {
  planId: number;
  /** 어느 카테고리로 열지. 없으면 아직 진행 중인 첫 카테고리를 연다 */
  category?: PlaceCategory;
  onBack?: () => void;
  /** 마지막 카테고리까지 넘기면 최종 확인(C8)으로 간다 */
  onDone?: () => void;
}

const PlaceVoteView: React.FC<Props> = ({
  planId,
  category,
  onBack,
  onDone,
}) => {
  const [votes, setVotes] = useState<VoteStatusInfo[]>([]);
  const [current, setCurrent] = useState<PlaceCategory | null>(
    category ?? null,
  );
  const [loading, setLoading] = useState(true);
  // 이 여행이 도는 도시들. 플래너를 받아와야 안다. null 이면 아직 모른다
  const [cities, setCities] = useState<TripCity[] | null>(null);
  // 아무도 투표하지 않은 카테고리는 투표가 없어 인원도 안 온다. 그때 쓴다
  const [members, setMembers] = useState(0);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesFailed, setPlacesFailed] = useState(false);
  const [cursors, setCursors] = useState<Record<string, string | null>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreFailed, setMoreFailed] = useState(false);
  // 화면에 보여줄 개수. 쌓아둔 장소가 더 많아도 이만큼만 그린다
  const [visible, setVisible] = useState(PAGE_SIZE);
  const moreRef = useRef(false);
  const generationRef = useRef(0);
  const [sending, setSending] = useState(false);
  const [confirming, setConfirming] = useState(false);
  // 동점이라 그룹장이 골라줘야 하는 투표들. 앞에서부터 하나씩 묻는다
  const [tieQueue, setTieQueue] = useState<VoteStatusInfo[]>([]);
  /**
   * 남은 동점과 지금까지 고른 것은 ref 가 정본이다.
   *
   * state 만 쓰면 화면이 다시 그려지기 전까지 두 번째 터치도 첫 번째와
   * 같은 값을 본다. 마지막 동점에서 빠르게 두 번 누르면 확정 요청이
   * 두 번 나가고, 두 번째는 이미 확정된 플래너를 건드린다.
   */
  const tieQueueRef = useRef<VoteStatusInfo[]>([]);
  const pickedRef = useRef<VoteSelection[]>([]);
  const busyRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const [list, planner] = await Promise.all([
            getVotes(planId),
            getPlanner(planId),
          ]);
          if (!alive) {
            return;
          }
          setVotes(list);
          setMembers(planner.joinedMemberCount);
          setCities(
            planner.cities && planner.cities.length > 0
              ? planner.cities
              : planner.countryName && planner.cityName
              ? [
                  {
                    countryName: planner.countryName,
                    cityName: planner.cityName,
                  },
                ]
              : [],
          );
          // 마감이 지난 투표는 status 가 아직 OPEN 이어도 열지 않는다.
          // 열어봐야 버튼이 전부 막혀 있어 사용자가 직접 옮겨야 한다.
          setCurrent(
            prev =>
              prev ??
              list.find(v => v.status === 'OPEN' && !v.deadlinePassed)
                ?.category ??
              CATEGORIES[0],
          );
        } catch {
          if (alive) {
            setVotes([]);
            setCities(prev => prev ?? []);
            setCurrent(prev => prev ?? CATEGORIES[0]);
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
    }, [planId]),
  );

  const active = current ?? CATEGORIES[0];

  // 카테고리를 바꿀 때마다 그 카테고리의 장소를 도시마다 받아 합친다
  useEffect(() => {
    if (cities === null) {
      return;
    }
    let alive = true;
    generationRef.current += 1;
    setCursors({});
    setMoreFailed(false);
    setVisible(PAGE_SIZE);
    setPlacesLoading(true);
    setPlacesFailed(false);
    Promise.all(
      cities.map(city =>
        getTourPlaces(city.countryName, {
          cityName: city.cityName,
          // 서버는 카테고리를 한글로 받는다 (TourPlaceService 참고)
          category: CATEGORY_LABEL[active] as any,
        }),
      ),
    )
      .then(lists => {
        if (alive) {
          setPlaces(lists.flat());
        }
      })
      .catch(() => {
        if (alive) {
          setPlaces([]);
          setPlacesFailed(true);
        }
      })
      .then(() => {
        if (alive) {
          setPlacesLoading(false);
        }
      });
    return () => {
      alive = false;
    };
  }, [cities, active]);

  const loadMore = async (): Promise<'skipped' | 'failed' | 'done'> => {
    if (moreRef.current || placesLoading || !cities || cities.length === 0) {
      return 'skipped';
    }
    const targets = cities.filter(city => cursors[cityKey(city)] !== null);
    if (targets.length === 0) {
      return 'skipped';
    }
    moreRef.current = true;
    setLoadingMore(true);
    setMoreFailed(false);
    const generation = generationRef.current;
    try {
      const results = await Promise.all(
        targets.map(city =>
          getMoreTourPlaces(
            city.countryName,
            city.cityName,
            // 서버는 카테고리를 한글로 받는다 (TourPlaceService 참고)
            CATEGORY_LABEL[active] as any,
            cursors[cityKey(city)] ?? null,
          )
            .then(result => ({ key: cityKey(city), result }))
            .catch(() => ({ key: cityKey(city), result: null })),
        ),
      );
      if (generation !== generationRef.current) {
        return 'skipped';
      }
      if (results.every(({ result }) => result === null)) {
        setMoreFailed(true);
        return 'failed';
      }
      setPlaces(prev =>
        results.reduce(
          (acc, { result }) => (result ? mergePlaces(acc, result.places) : acc),
          prev,
        ),
      );
      setCursors(prev => {
        const next = { ...prev };
        results.forEach(({ key, result }) => {
          if (result) {
            next[key] = result.cursor;
          }
        });
        return next;
      });
      return 'done';
    } finally {
      moreRef.current = false;
      setLoadingMore(false);
    }
  };

  // 모든 도시에서 구글이 더 줄 게 없다고 했을 때만 끝이다
  const exhausted =
    !!cities &&
    cities.length > 0 &&
    cities.every(city => cursors[cityKey(city)] === null);

  /**
   * 처음 받은 목록이 비었으면 구글에서 한 번 받아온다.
   *
   * DB 에 아직 장소가 없는 도시(파리 · 로마 …)를 고르면 목록이 0곳이다.
   * 그러면 FlatList 에 스크롤할 것이 없어 onEndReached 가 걸리지 않고,
   * 구글에서 더 받아오는 경로를 아무도 부르지 않는다. 서버는 줄 수 있는데
   * 사용자는 "장소가 없어요" 에서 멈춘다.
   *
   * 카테고리나 도시가 바뀔 때마다 한 번씩만 시도한다. 구글도 줄 게 없으면
   * 커서가 null 이 되어 exhausted 가 막는다.
   */
  const autoFetchedRef = useRef(0);
  useEffect(() => {
    const go = shouldAutoFetch({
      loading: placesLoading,
      busy: loadingMore,
      failed: placesFailed || moreFailed,
      count: places.length,
      exhausted,
      generation: generationRef.current,
      fetchedGeneration: autoFetchedRef.current,
    });
    if (!go) {
      return;
    }
    const generation = generationRef.current;
    autoFetchedRef.current = generation;
    loadMore().then(outcome => {
      if (outcome === 'skipped' && autoFetchedRef.current === generation) {
        autoFetchedRef.current = 0;
      }
    });
    // loadMore 는 매 렌더 새로 만들어진다. 넣으면 매번 다시 돈다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLoading, placesFailed, places.length, exhausted, loadingMore, moreFailed]);

  const vote = votes.find(item => item.category === active);
  const status = vote?.status ?? 'OPEN';
  // 마감 시각이 지나도 status 는 한동안 OPEN 으로 남는다. 그 사이에 누르면
  // 서버가 거부해서 실패 Alert 만 보게 되므로 여기서 먼저 막는다.
  const closed = status !== 'OPEN' || !!vote?.deadlinePassed;
  // 버튼을 막았으면 배지도 '마감' 이어야 한다. '진행 중' 인데 못 누르면
  // 사용자는 고장으로 읽는다.
  const meta = statusMeta(closed && status === 'OPEN' ? 'CLOSED' : status);
  const eligible = vote?.eligibleMemberCount ?? members;
  const rows = toVoteRows(places, vote);
  const topCount = rows.reduce((max, row) => Math.max(max, row.voteCount), 0);
  const shown = Math.min(visible, rows.length);

  /** 목록 끝에서 10곳씩 더 꺼낸다. 쌓아둔 게 모자라면 서버에서 더 받는다 */
  const showMore = () => {
    const step = nextPage(shown, visible, rows.length, exhausted);
    if (step.visible !== visible) {
      setVisible(step.visible);
    }
    if (step.fetch) {
      loadMore();
    }
  };

  /**
   * 누르면 투표, 다시 누르면 취소. 한 카테고리에서 여러 곳에 투표할 수 있다.
   * 서버가 갱신된 현황을 따로 주지 않아서, 성공하면 목록을 다시 받는다.
   */
  const toggle = async (row: VoteRow) => {
    if (!row.votable || row.tourPlaceId == null || busyRef.current) {
      return;
    }
    busyRef.current = true;
    setSending(true);
    try {
      if (row.mine) {
        await cancelPlaceVote(planId, row.tourPlaceId);
      } else {
        await voteForPlace(planId, row.tourPlaceId);
      }
      setVotes(await getVotes(planId));
    } catch (e: any) {
      Alert.alert('투표 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setSending(false);
    }
  };

  // 마지막 카테고리의 "투표 마치기" 가 일정 확정이다.
  // 확정을 해야 투표가 마감되고 여행 카드가 만들어진다.
  const sendConfirm = async (selections: VoteSelection[]) => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setConfirming(true);
    try {
      await confirmPlanner(planId, selections);
      onDone?.();
    } catch (e: any) {
      // 방장이 아니거나 표가 없으면 서버가 거부한다.
      // 그때 다음 화면으로 넘기면 빈 화면만 보게 되므로 여기 남는다.
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      busyRef.current = false;
      setConfirming(false);
    }
  };

  const goNext = async () => {
    const index = CATEGORIES.indexOf(active);
    if (index < CATEGORIES.length - 1) {
      setCurrent(CATEGORIES[index + 1]);
      return;
    }
    if (busyRef.current) {
      return;
    }
    // 첫 await 앞에서 잠근다. 검사만 해두면 리렌더 전에 들어온 두 번째
    // 터치도 같은 값을 보고 통과한다.
    busyRef.current = true;

    // 확정은 그룹장만 된다. 동점을 먼저 물으면, 멤버는 다 골라놓고 나서야
    // "그룹장이 아닙니다" 를 보게 된다. 그래서 묻기 전에 먼저 확인한다.
    setConfirming(true);
    let isOwner: boolean;
    try {
      isOwner = (await getPlanner(planId)).role === 'OWNER';
    } catch (e: any) {
      Alert.alert('확정 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      busyRef.current = false;
      setConfirming(false);
      return;
    }
    // sendConfirm 이 스스로 다시 잠그므로 여기서는 놓아준다
    busyRef.current = false;
    setConfirming(false);

    if (!isOwner) {
      Alert.alert(
        '확정할 수 없어요',
        '일정 확정은 그룹장만 할 수 있어요. 그룹장에게 요청해주세요.',
      );
      return;
    }

    // 동점인 채로 보내면 서버가 거부한다. 그룹장에게 물어본다.
    const ties = votes.filter(
      v => v.status !== 'CONFIRMED' && tiedOptions(v).length > 0,
    );
    if (ties.length > 0) {
      pickedRef.current = [];
      tieQueueRef.current = ties;
      setTieQueue(ties);
      return;
    }
    await sendConfirm([]);
  };

  /**
   * 동점 고르기를 접는다. 정본인 ref 도 같이 비워야 다시 열었을 때
   * 앞의 선택이 섞이지 않는다. 취소 버튼과 안드로이드 뒤로가기가
   * 같은 자리를 지나게 한다.
   */
  const closeTie = () => {
    tieQueueRef.current = [];
    pickedRef.current = [];
    setTieQueue([]);
  };

  /** 동점 하나를 정하고 다음 동점으로 넘어간다. 다 정하면 확정을 보낸다 */
  const pickTie = async (voteId: number, optionId: number) => {
    if (busyRef.current) {
      return;
    }
    const queue = tieQueueRef.current;
    // 이미 지나간 동점의 버튼이면 무시한다 (연타로 들어온 두 번째 터치)
    if (queue[0]?.voteId !== voteId) {
      return;
    }
    const next = [...pickedRef.current, { voteId, optionId }];
    const rest = queue.slice(1);
    pickedRef.current = next;
    tieQueueRef.current = rest;
    setTieQueue(rest);
    if (rest.length === 0) {
      await sendConfirm(next);
    }
  };

  const renderRow = ({ item: row }: { item: VoteRow }) => {
    const count = row.voteCount;
    const leading = count > 0 && count === topCount;
    const off = closed || sending || !row.votable;
    return (
      <View key={row.key} style={[s.card, row.mine && s.cardOn]}>
        <View style={s.cardTop}>
          <View style={s.thumb}>
            <Text style={s.thumbEmoji}>{CATEGORY_EMOJI[active]}</Text>
          </View>
          <View style={s.body}>
            <Text style={s.name} numberOfLines={1}>
              {row.placeName}
            </Text>
            <Text style={s.meta} numberOfLines={1}>
              {row.meta}
            </Text>
            {/* 누가 찍었는지는 서버가 내려주지 않아 표 수만 보여준다 */}
            <View style={s.countRow}>
              <Text style={s.count}>{count}표</Text>
            </View>
          </View>
          {row.votable && (
            <TouchableOpacity
              hitSlop={touch48(30)}
              style={[
                s.voteBtn,
                row.mine && s.voteBtnOn,
                off && s.voteBtnOff,
              ]}
              activeOpacity={0.85}
              disabled={off}
              onPress={() => toggle(row)}
            >
              <Text style={[s.voteText, row.mine && s.voteTextOn]}>
                {row.mine ? '투표함' : '투표'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={s.track}>
          <View
            style={[
              s.fill,
              {
                width: `${
                  eligible > 0 ? Math.min(count / eligible, 1) * 100 : 0
                }%`,
                backgroundColor: leading
                  ? colors.primary
                  : colors.textTertiary,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <View style={s.titleRow}>
          <Text style={s.title}>{CATEGORY_LABEL[active]} 투표</Text>
          <View style={[s.statusPill, { backgroundColor: meta.color }]}>
            <Text style={s.statusText}>{meta.text}</Text>
          </View>
        </View>
        <Text style={s.subtitle}>
          {vote?.votedMemberCount ?? 0} / {eligible}명 참여 · 전체{' '}
          {rows.length}곳 · 여러 곳에 투표할 수 있어요
        </Text>
      </SafeAreaView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chipRow}
        style={s.chipScroll}
      >
        {CATEGORIES.map(key => {
          const on = key === active;
          return (
            <TouchableOpacity
              key={key}
              hitSlop={touch48(32, 'vertical')}
              style={[s.chip, on && s.chipOn]}
              activeOpacity={0.85}
              onPress={() => setCurrent(key)}
            >
              <Text style={[s.chipText, on && s.chipTextOn]}>
                {CATEGORY_LABEL[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
        data={loading || placesLoading ? [] : rows.slice(0, visible)}
        keyExtractor={row => row.key}
        renderItem={renderRow}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        // 끝에서 한 화면 반쯤 남았을 때 미리 받는다. 끝에 닿고서 받으면 멈칫한다
        onEndReached={showMore}
        onEndReachedThreshold={0.6}
        ListEmptyComponent={
          loading ||
          placesLoading ||
          loadingMore ||
          // 빈 목록을 받고 자동 조회가 시작되기 직전의 한 순간. 여기서 "없어요"
          // 를 그리면 곧 목록이 채워지는데도 깜빡인다
          (!placesFailed &&
            !moreFailed &&
            !exhausted &&
            autoFetchedRef.current !== generationRef.current) ? (
            <ActivityIndicator style={s.loading} />
          ) : (
            <View style={s.empty}>
              <Text style={s.emptyText}>
                {placesFailed || moreFailed || cities?.length === 0
                  ? '장소를 불러오지 못했어요'
                  : '이 카테고리에는 아직 장소가 없어요'}
              </Text>
              {!placesFailed && !exhausted && (cities?.length ?? 0) > 0 ? (
                <TouchableOpacity
                  style={s.retryBtn}
                  activeOpacity={0.85}
                  onPress={() => loadMore()}
                >
                  <Text style={s.retryText}>다시 불러오기</Text>
                </TouchableOpacity>
              ) : (
                <Text style={s.emptyDesc}>다른 카테고리를 골라보세요.</Text>
              )}
            </View>
          )
        }
        ListFooterComponent={
          // 미리 받아두는 중에는 돌리지 않는다. 보여줄 게 모자라 기다릴 때만 돌린다
          rows.length === 0 ? null : loadingMore && shown < visible ? (
            <ActivityIndicator style={s.more} />
          ) : exhausted && shown >= rows.length ? (
            <Text style={s.moreEnd}>더 불러올 장소가 없어요</Text>
          ) : null
        }
      />

      {/* 동점이라 그룹장이 골라야 하는 투표. 큐 앞에서부터 하나씩 묻는다 */}
      <Modal
        visible={tieQueue.length > 0}
        transparent
        animationType="fade"
        onRequestClose={closeTie}
      >
        <View style={s.tieBack}>
          <View style={s.tieCard}>
            <Text style={s.tieTitle}>
              {tieQueue[0]?.categoryLabel} 투표가 동점이에요
            </Text>
            <Text style={s.tieDesc}>
              {tieQueue.length > 1
                ? `어디로 할지 골라주세요. 남은 동점 ${tieQueue.length}개`
                : '어디로 할지 골라주세요.'}
            </Text>

            <ScrollView style={s.tieList}>
              {(tieQueue[0] ? tiedOptions(tieQueue[0]) : []).map(option => (
                <TouchableOpacity
                  key={option.optionId}
                  style={s.tieOption}
                  activeOpacity={0.85}
                  disabled={confirming}
                  onPress={() => pickTie(tieQueue[0].voteId, option.optionId)}
                >
                  <Text style={s.tieOptionName} numberOfLines={1}>
                    {option.placeName}
                  </Text>
                  <Text style={s.tieOptionCount}>{option.voteCount}표</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={s.tieCancel}
              activeOpacity={0.85}
              disabled={confirming}
              onPress={closeTie}
            >
              <Text style={s.tieCancelText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={s.primaryBtn}
          activeOpacity={0.85}
          disabled={confirming}
          onPress={goNext}
        >
          {confirming ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryText}>
              {active === CATEGORIES[CATEGORIES.length - 1]
                ? '투표 마치고 일정 확정'
                : '다음 카테고리'}
            </Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlaceVoteView;
