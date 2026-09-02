import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planDestinationStyles as s } from './PlanDestinationView.styles';
import WizardHeader from './WizardHeader';
import { getPopularCities } from '../../entities/planner/api';
import { getCountries } from '../../entities/main/api';
import { emojiOf, FALLBACK_CITIES } from '../../entities/planner/sampleData';
import {
  formatNights,
  PlanDraft,
  PopularCity,
} from '../../entities/planner/types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 글자를 칠 때마다 서버를 부르지 않도록 기다리는 시간
const SEARCH_DELAY_MS = 300;

/** 2026, 7(=8월) → "2026-08-23" */
function toIso(year: number, monthIndex: number, day: number): string {
  const month = `${monthIndex + 1}`.padStart(2, '0');
  return `${year}-${month}-${`${day}`.padStart(2, '0')}`;
}

/** "2026-08-23" → "8월 23일", 같은 달의 끝 날짜는 "27일" 로 짧게 */
function labelOf(date: string, omitMonth: boolean): string {
  const [, month, day] = date.split('-').map(Number);
  return omitMonth ? `${day}일` : `${month}월 ${day}일`;
}

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanDestinationView: React.FC<Props> = ({ draft, onBack, onNext }) => {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState<PopularCity | null>(null);
  // 서버가 계획 수로 뽑아준 인기 여행지. 조회 전·실패 시에는 기본 목록을 쓴다.
  const [popular, setPopular] = useState<PopularCity[]>(FALLBACK_CITIES);
  // 검색 결과. null 이면 아직 안 찾아본 것이다
  const [found, setFound] = useState<PopularCity[] | null>(null);
  const [searching, setSearching] = useState(false);
  // 피그마에는 달 이동 화살표가 없지만, 한 달에 갇히면 기간을 못 고른다
  const [cursor, setCursor] = useState(() => new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  useEffect(() => {
    let alive = true;
    getPopularCities()
      .then(list => {
        // 계획이 아직 하나도 없으면 서버가 빈 목록을 준다.
        // 그때 빈 화면을 보여주지 않으려고 기본 목록을 그대로 둔다.
        if (alive && list.length > 0) {
          setPopular(
            list.map(item => ({
              cityName: item.cityName,
              countryName: item.countryName,
              emoji: emojiOf(item.cityName),
            })),
          );
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  /**
   * 검색은 서버에 묻는다.
   *
   * 인기 여행지는 관광지 데이터가 있는 도시만이라 지금 다섯 곳뿐이다.
   * 그 안에서 거르면 "파리" 를 쳐도 아무것도 안 나왔다.
   * 글자를 칠 때마다 부르지 않도록 잠깐 기다렸다 보낸다.
   */
  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      setFound(null);
      return;
    }
    let alive = true;
    setSearching(true);
    const timer = setTimeout(() => {
      getCountries(keyword)
        .then(list => {
          if (!alive) {
            return;
          }
          setFound(
            list.map(item => ({
              // 나라만 있고 도시가 없으면 나라 이름을 도시 자리에 쓴다
              cityName: item.cityName ?? item.countryName,
              countryName: item.countryName,
              emoji: emojiOf(item.cityName ?? item.countryName),
            })),
          );
        })
        .catch(() => {
          if (alive) {
            setFound([]);
          }
        })
        .then(() => {
          if (alive) {
            setSearching(false);
          }
        });
    }, SEARCH_DELAY_MS);
    return () => {
      alive = false;
      clearTimeout(timer);
      setSearching(false);
    };
  }, [query]);

  const cities = useMemo(() => {
    const keyword = query.trim();
    // 검색 전에는 피그마처럼 인기 여행지 네 곳만 보여준다
    if (!keyword) {
      return popular.slice(0, 4);
    }
    // 관광지가 있는 도시(오사카 등)를 위로 올린다. 거기는 담을 장소가 있다
    const hits = popular.filter(
      item =>
        item.cityName.includes(keyword) || item.countryName.includes(keyword),
    );
    const names = new Set(hits.map(h => h.cityName));
    return [...hits, ...(found ?? []).filter(f => !names.has(f.cityName))];
  }, [query, popular, found]);

  // 1일이 무슨 요일인지에 맞춰 앞을 빈 칸으로 채운 뒤 주 단위로 자른다
  const weeks = useMemo(() => {
    const leading = new Date(year, monthIndex, 1).getDay();
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array<null>(leading).fill(null),
      ...Array.from({ length: lastDay }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return Array.from({ length: cells.length / 7 }, (_, i) =>
      cells.slice(i * 7, i * 7 + 7),
    );
  }, [year, monthIndex]);

  const pickDay = (day: number) => {
    const date = toIso(year, monthIndex, day);
    // 시작만 정해진 상태에서 뒷날짜를 누르면 기간이 되고, 그 밖에는 새로 시작한다
    if (startDate && !endDate && date > startDate) {
      setEndDate(date);
      return;
    }
    setStartDate(date);
    setEndDate('');
  };

  const moveMonth = (step: number) =>
    setCursor(new Date(year, monthIndex + step, 1));

  const ready = !!city && !!startDate && !!endDate;


  // 여기서 서버에 저장하지 않는다. 아직 플래너가 없을 수도 있고,
  // 저장해두면 장소를 안 담고 나갔을 때 빈 플래너가 목록에 남는다.
  // 여행지·기간은 장소를 담을 때(PlacePickerView) 함께 저장한다.
  const next = () => {
    if (!ready || !city) {
      return;
    }
    onNext?.({
      ...draft,
      countryName: city.countryName,
      cityName: city.cityName,
      startDate,
      endDate,
    });
  };

  return (
    <View style={s.safeArea}>
      <WizardHeader title="여행지 & 기간" step={2} onBack={onBack} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.search}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="나라 이름으로 검색 (예: 프랑스)"
            placeholderTextColor="#5d6f83"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        <Text style={s.label}>인기 여행지</Text>
        {cities.length === 0 ? (
          <Text style={s.cityEmpty}>
            {searching
              ? '찾는 중…'
              : '검색 결과가 없어요. 나라 이름으로 찾아보세요.'}
          </Text>
        ) : (
          <View style={s.cityGrid}>
            {cities.map(item => {
              const on = city?.cityName === item.cityName;
              return (
                <TouchableOpacity
                  key={`${item.countryName}-${item.cityName}`}
                  style={[s.cityCard, on && s.cityCardOn]}
                  activeOpacity={0.85}
                  onPress={() => setCity(item)}
                >
                  <View style={s.cityThumb}>
                    <Text style={s.cityEmoji}>{item.emoji}</Text>
                  </View>
                  <View>
                    <Text style={[s.cityName, on && s.cityNameOn]}>
                      {item.cityName}
                    </Text>
                    <Text style={s.cityCountry}>{item.countryName}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Text style={s.label}>여행 기간</Text>
        <View style={s.calCard}>
          <View style={s.calHead}>
            <Text style={s.calMonth}>
              {year}년 {monthIndex + 1}월
            </Text>
            <TouchableOpacity hitSlop={10} onPress={() => moveMonth(-1)}>
              <Text style={s.calArrow}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={10} onPress={() => moveMonth(1)}>
              <Text style={s.calArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={s.calRow}>
            {WEEKDAYS.map((weekday, i) => (
              <Text
                key={weekday}
                style={[s.calWeekday, i === 0 && s.calWeekend]}
              >
                {weekday}
              </Text>
            ))}
          </View>

          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={s.calWeek}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <View key={dayIndex} style={s.calCell} />;
                }
                const date = toIso(year, monthIndex, day);
                const isEdge = date === startDate || date === endDate;
                const isMid =
                  !!endDate && date > startDate && date < endDate;
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={s.calCell}
                    activeOpacity={0.7}
                    onPress={() => pickDay(day)}
                  >
                    <View
                      style={[
                        s.dayPill,
                        isMid && s.dayPillMid,
                        isEdge && s.dayPillEdge,
                      ]}
                    >
                      <Text style={[s.dayText, isEdge && s.dayTextEdge]}>
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {!!startDate && !!endDate && (
          <Text style={s.summary}>
            {labelOf(startDate, false)} –{' '}
            {labelOf(endDate, startDate.slice(0, 7) === endDate.slice(0, 7))} ·{' '}
            {formatNights(startDate, endDate)}
          </Text>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, !ready && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={!ready}
          onPress={next}
        >
          <Text style={s.primaryText}>다음</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default PlanDestinationView;
