import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { festivalStyles as s } from './FestivalScreen.styles';
import { getDday, getFestivals, DdayInfo, Festival } from '../../entities/main/api';
import {
  formatShortDate,
  formatTripRange,
} from '../../entities/record/types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 날짜와 나라가 모두 있는 여행 일정 ("쉬는 중" 응답을 걸러낸 뒤의 모습) */
type TripDday = DdayInfo & {
  countryName: string;
  startDate: string;
  endDate: string;
};

function toIso(year: number, monthIndex: number, day: number): string {
  const month = `${monthIndex + 1}`.padStart(2, '0');
  return `${year}-${month}-${`${day}`.padStart(2, '0')}`;
}

/** 여행 기간 앞뒤로 함께 보여줄 날수 */
const WINDOW_DAYS = 7;

/** YYYY-MM-DD 를 days 만큼 옮긴다. Date 가 달·해 넘김을 알아서 처리한다 */
export function shiftIso(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number);
  const moved = new Date(year, month - 1, day + days);
  return toIso(moved.getFullYear(), moved.getMonth(), moved.getDate());
}

/** from~to 가 걸치는 달을 모두 센다. 서버가 달 단위로만 주기 때문이다 */
export function monthsBetween(
  from: string,
  to: string,
): { year: number; month: number }[] {
  const [fromYear, fromMonth] = from.split('-').map(Number);
  const [toYear, toMonth] = to.split('-').map(Number);
  const months: { year: number; month: number }[] = [];
  let year = fromYear;
  let month = fromMonth;
  while (year < toYear || (year === toYear && month <= toMonth)) {
    months.push({ year, month });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

interface Props {
  onBack?: () => void;
}

const FestivalScreen: React.FC<Props> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  // 날짜와 나라가 확정된 일정만 담는다. 그래야 아래에서 매번 null 검사를 안 한다.
  const [dday, setDday] = useState<TripDday | null>(null);
  const [events, setEvents] = useState<Festival[]>([]);
  const [cursor, setCursor] = useState(() => new Date());
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // 조회 실패와 일정 없음은 다르다. 같은 문구를 쓰면 서버가 죽어도
  // 그 달에 축제가 없는 것처럼 보인다.
  const [failed, setFailed] = useState(false);
  // getDday 실패는 getFestivals 와 다른 요청이다. dday 만 null 로
  // 남기면 "일정 없음" 으로 보인다.
  const [ddayFailed, setDdayFailed] = useState(false);

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  // 여행 일정을 먼저 읽어 그 달로 달력을 맞춰 놓는다
  useEffect(() => {
    (async () => {
      try {
        const info = await getDday();
        // 일정이 없으면 서버가 200 으로 "쉬는 중"(전 필드 null)을 준다.
        // 맞출 달도 물어볼 나라도 없으니 일정 없음으로 둔다.
        if (!info.startDate || !info.endDate || !info.countryName) {
          setDday(null);
          return;
        }
        setDday(info as TripDday);
        const [y, m] = info.startDate.split('-').map(Number);
        setCursor(new Date(y, m - 1, 1));
      } catch {
        setDday(null);
        setDdayFailed(true);
      }
    })();
  }, []);

  // 보여줄 범위: 여행 기간 앞뒤 1주
  const range = useMemo(() => {
    if (!dday) {
      return null;
    }
    return {
      from: shiftIso(dday.startDate, -WINDOW_DAYS),
      to: shiftIso(dday.endDate, WINDOW_DAYS),
    };
  }, [dday]);

  useEffect(() => {
    if (!dday || !range) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFailed(false);
    // 화면을 떠난 요청의 결과는 버린다.
    let alive = true;
    // 범위가 달을 걸치면 서버를 여러 번 부른다. 달 단위 조회만 있어서다.
    // 보통 1~2번이다.
    Promise.all(
      monthsBetween(range.from, range.to).map(month =>
        getFestivals(dday.countryName, month),
      ),
    )
      .then(lists => {
        if (!alive) {
          return;
        }
        // 달 전체가 오므로 범위 밖은 여기서 버린다
        setEvents(
          lists
            .flat()
            .filter(
              event =>
                event.startDate >= range.from && event.startDate <= range.to,
            ),
        );
      })
      .catch(() => alive && (setEvents([]), setFailed(true)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [dday, range]);

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

  const eventDates = useMemo(
    () => new Set(events.map(event => event.startDate)),
    [events],
  );

  const chips = useMemo(
    () => Array.from(new Set(events.map(event => event.category))),
    [events],
  );

  // 이 달의 일정을 모두 보여주고, 날짜를 고르면 그 하루로 좁힌다.
  // 여행 기간은 달력에 옅은 파랑으로만 표시한다.
  const visible = useMemo(() => {
    let list = events;
    if (selectedDate) {
      list = list.filter(event => event.startDate === selectedDate);
    }
    if (categories.length > 0) {
      list = list.filter(event => categories.includes(event.category));
    }
    return list;
  }, [events, selectedDate, categories]);

  // 달력은 범위가 걸친 달 안에서만 움직인다. 범위 밖으로 넘어가면
  // 축제가 하나도 없는 빈 달이 나와 고장난 것처럼 보인다.
  // 카테고리 칩은 범위 전체에서 뽑으므로 달을 옮겨도 그대로 둔다.
  const monthSpan = useMemo(
    () => (range ? monthsBetween(range.from, range.to) : []),
    [range],
  );
  const monthKey = year * 12 + monthIndex;
  const keyOf = (m: { year: number; month: number }) =>
    m.year * 12 + (m.month - 1);
  const canPrev = monthSpan.length > 0 && monthKey > keyOf(monthSpan[0]);
  const canNext =
    monthSpan.length > 0 && monthKey < keyOf(monthSpan[monthSpan.length - 1]);

  const changeMonth = (offset: number) => {
    // 고른 날짜는 이 달에만 있는 값이라 옮길 때 푼다
    setSelectedDate(null);
    setCursor(new Date(year, monthIndex + offset, 1));
  };

  const toggleCategory = (category: string) =>
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category],
    );

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
          <Text style={s.title}>축제 & 이벤트</Text>
          <Text style={s.subtitle}>
            {dday
              ? `${dday.countryName} · 여행 기간 앞뒤 1주`
              : ddayFailed
              ? '여행 일정을 불러오지 못했어요'
              : '등록된 여행 일정이 없어요'}
          </Text>
        </SafeAreaView>

        <View style={s.calCard}>
          <View style={s.calHead}>
            <Text style={s.calMonth}>
              {year}년 {monthIndex + 1}월
            </Text>
            <TouchableOpacity
              hitSlop={10}
              disabled={!canPrev}
              onPress={() => changeMonth(-1)}
            >
              <Text style={[s.calArrow, !canPrev && s.calArrowOff]}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={10}
              disabled={!canNext}
              onPress={() => changeMonth(1)}
            >
              <Text style={[s.calArrow, !canNext && s.calArrowOff]}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={s.calWeekRow}>
            {WEEKDAYS.map((weekday, i) => (
              <Text
                key={weekday}
                style={[s.calWeekday, i === 0 && s.calSunday]}
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
                const inTrip =
                  !!dday &&
                  date >= dday.startDate &&
                  date <= dday.endDate;
                const on = date === selectedDate;
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={s.calCell}
                    activeOpacity={0.7}
                    onPress={() => setSelectedDate(on ? null : date)}
                  >
                    <View
                      style={[
                        s.dayPill,
                        inTrip && s.dayInTrip,
                        on && s.daySelected,
                      ]}
                    >
                      <Text style={[s.dayText, on && s.dayTextSelected]}>
                        {day}
                      </Text>
                    </View>
                    {eventDates.has(date) && (
                      <View style={[s.dot, on && s.dotOnSelected]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {!!dday && (
          <Text style={s.tripRange}>
            여행 기간 {formatTripRange(dday.startDate, dday.endDate)}
          </Text>
        )}

        {chips.length > 0 && (
          <View style={s.chipRow}>
            {chips.map(category => {
              const on = categories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  style={[s.chip, on && s.chipOn]}
                  activeOpacity={0.85}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[s.chipText, on && s.chipTextOn]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {loading ? (
          <ActivityIndicator style={s.loader} />
        ) : visible.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>
              {failed || ddayFailed
                ? '정보를 불러오지 못했어요'
                : '보여줄 일정이 없어요'}
            </Text>
            <Text style={s.emptyDesc}>
              {failed || ddayFailed
                ? '잠시 후 다시 시도해주세요.'
                : dday
                ? '다른 날짜나 카테고리를 골라보세요.'
                : '여행 일정을 등록하면 축제·이벤트를 알려드려요.'}
            </Text>
          </View>
        ) : (
          <View style={s.list}>
            {visible.map(event => (
              <View key={`${event.title}-${event.startDate}`} style={s.card}>
                <View style={s.cardStripe} />
                <View style={s.cardBody}>
                  <Text style={s.cardTitle}>{event.title}</Text>
                  <Text style={s.cardMeta}>
                    {/* 시작 시각이 없는 축제는 날짜만 보여준다 */}
                    {formatShortDate(event.startDate)}
                    {event.startTime ? ` · ${event.startTime}` : ''}
                  </Text>
                  <Text style={s.cardPlace}>{event.location}</Text>
                </View>
                <View style={s.cardPill}>
                  <Text style={s.cardPillText}>{event.category}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FestivalScreen;
