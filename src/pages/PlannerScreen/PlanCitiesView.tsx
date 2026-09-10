import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planCitiesStyles as s } from './PlanCitiesView.styles';
import WizardHeader from './WizardHeader';
import { getCities, City } from '../../entities/main/api';
import {
  formatRange,
  formatShortDate,
  PlanCity,
  PlanDraft,
} from '../../entities/planner/types';

// 글자를 칠 때마다 서버를 부르지 않도록 기다리는 시간
const SEARCH_DELAY_MS = 300;

/** 화면에서 다루는 값. 날짜는 순서와 일수에서 만들어진다 */
interface Row {
  countryName: string;
  cityName: string;
  days: number;
}

/** "2026-08-23" 을 days 만큼 옮긴다 */
function shift(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const moved = new Date(year, month - 1, day + days);
  return `${moved.getFullYear()}-${`${moved.getMonth() + 1}`.padStart(2, '0')}-${`${moved.getDate()}`.padStart(2, '0')}`;
}

function diffDays(startDate: string, endDate: string): number {
  const start = Date.parse(`${startDate}T00:00:00Z`);
  const end = Date.parse(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000);
}

/**
 * 일수를 날짜로 편다.
 *
 * 서버는 도시별 기간이 여행 기간을 빈틈 없이 이어 덮는지 본다. 일수로만
 * 다루면 빈틈이 생길 수가 없어서, 사용자가 400 을 볼 일이 없다.
 */
export function toCities(rows: Row[], startDate: string): PlanCity[] {
  let cursor = startDate;
  return rows.map(row => {
    const from = cursor;
    const to = shift(from, row.days - 1);
    cursor = shift(to, 1);
    return {
      countryName: row.countryName,
      cityName: row.cityName,
      startDate: from,
      endDate: to,
    };
  });
}

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanCitiesView: React.FC<Props> = ({ draft, onBack, onNext }) => {
  // 여행 전체 일수. 4박 5일이면 5다
  const totalDays = useMemo(
    () => diffDays(draft.startDate, draft.endDate) + 1,
    [draft.startDate, draft.endDate],
  );

  const [rows, setRows] = useState<Row[]>(() =>
    draft.cities.length > 0
      ? draft.cities.map(city => ({
          countryName: city.countryName,
          cityName: city.cityName,
          days: diffDays(city.startDate, city.endDate) + 1,
        }))
      : [
          {
            countryName: draft.countryName,
            cityName: draft.cityName,
            days: totalDays,
          },
        ],
  );

  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<City[] | null>(null);
  const [searching, setSearching] = useState(false);

  const used = rows.reduce((sum, row) => sum + row.days, 0);
  const left = totalDays - used;
  const cities = useMemo(
    () => toCities(rows, draft.startDate),
    [rows, draft.startDate],
  );

  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      setFound(null);
      return;
    }
    let alive = true;
    setSearching(true);
    setFound(null);
    const timer = setTimeout(() => {
      getCities(keyword)
        .then(list => {
          if (alive) {
            setFound(list);
          }
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

  // 새 도시는 남은 날을 다 가져간다. 남은 날이 없으면 1을 앞 도시에서 뗀다
  const addCity = (city: City) => {
    setRows(current => {
      const remaining = totalDays - current.reduce((sum, r) => sum + r.days, 0);
      if (remaining > 0) {
        return [...current, { ...city, days: remaining }];
      }
      const donor = current.findIndex(r => r.days > 1);
      if (donor < 0) {
        return current;
      }
      const next = current.map((r, i) =>
        i === donor ? { ...r, days: r.days - 1 } : r,
      );
      return [...next, { ...city, days: 1 }];
    });
    setAdding(false);
    setQuery('');
  };

  const step = (index: number, by: number) =>
    setRows(current =>
      current.map((row, i) => {
        if (i !== index) {
          return row;
        }
        const days = row.days + by;
        // 하루 미만으로는 못 줄이고, 남은 날보다 많이는 못 늘린다
        if (days < 1 || by > totalDays - used) {
          return row;
        }
        return { ...row, days };
      }),
    );

  const removeCity = (index: number) =>
    setRows(current =>
      current.length === 1 ? current : current.filter((_, i) => i !== index),
    );

  const ready = left === 0 && rows.length > 0;

  const next = () => {
    if (!ready) {
      return;
    }
    onNext?.({
      ...draft,
      // 첫 도시가 대표다. 도시 하나만 보던 화면이 이걸 읽는다
      countryName: cities[0].countryName,
      cityName: cities[0].cityName,
      cities,
    });
  };

  return (
    <View style={s.safeArea}>
      <WizardHeader title="어디를 도나요?" step={3} onBack={onBack} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.trip}>
          <Text style={s.tripText}>
            {formatRange(draft.startDate, draft.endDate)} · {totalDays}일 ·{' '}
            {draft.headcount}명
          </Text>
        </View>

        <Text style={s.label}>방문 도시</Text>

        {rows.map((row, index) => (
          <View key={`${row.countryName}-${row.cityName}-${index}`} style={s.card}>
            <View style={s.seq}>
              <Text style={s.seqText}>{index + 1}</Text>
            </View>
            <View style={s.cardBody}>
              <Text style={s.cityName}>{row.cityName}</Text>
              <Text style={s.cityRange}>
                {formatShortDate(cities[index].startDate)} –{' '}
                {formatShortDate(cities[index].endDate)} · {row.countryName}
              </Text>
            </View>
            <View style={s.stepper}>
              <TouchableOpacity
                style={[s.stepBtn, row.days <= 1 && s.stepBtnOff]}
                hitSlop={6}
                disabled={row.days <= 1}
                onPress={() => step(index, -1)}
              >
                <Text style={[s.stepText, row.days <= 1 && s.stepTextOff]}>
                  −
                </Text>
              </TouchableOpacity>
              <Text style={s.days}>{row.days}일</Text>
              <TouchableOpacity
                style={[s.stepBtn, left <= 0 && s.stepBtnOff]}
                hitSlop={6}
                disabled={left <= 0}
                onPress={() => step(index, 1)}
              >
                <Text style={[s.stepText, left <= 0 && s.stepTextOff]}>＋</Text>
              </TouchableOpacity>
            </View>
            {rows.length > 1 && (
              <TouchableOpacity hitSlop={8} onPress={() => removeCity(index)}>
                <Text style={s.remove}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={s.addBtn}
          activeOpacity={0.85}
          onPress={() => setAdding(true)}
        >
          <Text style={s.addText}>＋ 도시 추가</Text>
        </TouchableOpacity>

        <View style={s.note}>
          <Text style={[s.noteTitle, left !== 0 && s.noteTitleWarn]}>
            {left === 0
              ? `남은 날 없음 · ${totalDays}일을 다 채웠어요`
              : `${left}일이 남았어요`}
          </Text>
          <Text style={s.noteDesc}>
            빈 날이 있으면 AI가 그날 일정을 못 짜요
          </Text>
        </View>
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

      <Modal
        visible={adding}
        transparent
        animationType="slide"
        onRequestClose={() => setAdding(false)}
      >
        <Pressable style={s.dim} onPress={() => setAdding(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>도시 추가</Text>
            <View style={s.search}>
              <Text>🔍</Text>
              <TextInput
                style={s.searchInput}
                placeholder="도시 검색"
                placeholderTextColor="#5d6f83"
                value={query}
                onChangeText={setQuery}
                autoFocus
                returnKeyType="search"
              />
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {searching ? (
                <ActivityIndicator style={s.hitEmpty} />
              ) : found === null ? (
                <Text style={s.hitEmpty}>
                  도시 이름을 두 글자 이상 입력해주세요.
                </Text>
              ) : found.length === 0 ? (
                <Text style={s.hitEmpty}>검색 결과가 없어요.</Text>
              ) : (
                found.map(city => (
                  <TouchableOpacity
                    key={`${city.countryName}-${city.cityName}`}
                    style={s.hit}
                    activeOpacity={0.7}
                    onPress={() => addCity(city)}
                  >
                    <Text style={s.hitCity}>{city.cityName}</Text>
                    <Text style={s.hitCountry}>{city.countryName}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default PlanCitiesView;
