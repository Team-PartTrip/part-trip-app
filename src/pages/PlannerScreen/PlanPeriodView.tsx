import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { planPeriodStyles as s } from './PlanPeriodView.styles';
import WizardHeader from './WizardHeader';
import { getPlanners } from '../../entities/planner/api';
import { formatNights, PlanDraft } from '../../entities/planner/types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function toIso(year: number, monthIndex: number, day: number): string {
  const month = `${monthIndex + 1}`.padStart(2, '0');
  return `${year}-${month}-${`${day}`.padStart(2, '0')}`;
}

function labelOf(date: string, omitMonth: boolean): string {
  const [, month, day] = date.split('-').map(Number);
  return omitMonth ? `${day}일` : `${month}월 ${day}일`;
}

/** 이미 다른 여행이 잡힌 기간 */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** 이미 다른 여행이 있는 날인지. 서버처럼 양끝 날을 포함한다 */
export function isBlockedDay(date: string, ranges: DateRange[]): boolean {
  return ranges.some(r => r.startDate <= date && date <= r.endDate);
}

export function crossesBlocked(
  start: string,
  end: string,
  ranges: DateRange[],
): boolean {
  return ranges.some(r => r.startDate <= end && r.endDate >= start);
}

function todayIso(): string {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

interface Props {
  draft: PlanDraft;
  onBack?: () => void;
  onNext?: (draft: PlanDraft) => void;
}

const PlanPeriodView: React.FC<Props> = ({ draft, onBack, onNext }) => {
  const [cursor, setCursor] = useState(() => new Date());
  const [startDate, setStartDate] = useState(draft.startDate);
  const [endDate, setEndDate] = useState(draft.endDate);
  const [today, setToday] = useState(todayIso);
  const [taken, setTaken] = useState<DateRange[]>([]);
  const [takenState, setTakenState] = useState<'loading' | 'ok' | 'failed'>(
    'loading',
  );

  useEffect(() => {
    let alive = true;
    setTakenState('loading');
    getPlanners()
      .then(list => {
        if (!alive) {
          return;
        }
        setTakenState('ok');
        setTaken(
          list
            .filter(p => p.plannerId !== draft.plannerId)
            .filter(p => !!p.startDate && !!p.endDate)
            .map(p => ({
              startDate: p.startDate as string,
              endDate: p.endDate as string,
            })),
        );
      })
      .catch(() => {
        if (alive) {
          setTakenState('failed');
        }
      });
    return () => {
      alive = false;
    };
  }, [draft.plannerId]);

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );
    const timer = setTimeout(
      () => setToday(todayIso()),
      nextMidnight.getTime() - now.getTime(),
    );
    return () => clearTimeout(timer);
  }, [today]);

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
    const currentToday = todayIso();
    if (currentToday !== today) {
      setToday(currentToday);
    }
    if (date < currentToday || isBlockedDay(date, taken)) {
      return;
    }
    if (
      startDate &&
      !endDate &&
      date >= startDate &&
      !crossesBlocked(startDate, date, taken)
    ) {
      setEndDate(date);
      return;
    }
    setStartDate(date);
    setEndDate('');
  };

  const moveMonth = (step: number) =>
    setCursor(new Date(year, monthIndex + step, 1));

  const ready = !!startDate && !!endDate && takenState !== 'loading';

  const next = () => {
    if (!ready) {
      return;
    }
    const currentToday = todayIso();
    if (startDate < currentToday) {
      setToday(currentToday);
      setStartDate('');
      setEndDate('');
      Alert.alert('알림', '날짜가 바뀌었어요. 기간을 다시 골라주세요.');
      return;
    }
    // 목록을 받기 전에 골라둔 기간이면 여기서야 겹치는 걸 안다
    if (crossesBlocked(startDate, endDate, taken)) {
      setStartDate('');
      setEndDate('');
      Alert.alert('알림', '그 기간에 이미 다른 여행이 있어요. 기간을 다시 골라주세요.');
      return;
    }
    onNext?.({
      ...draft,
      startDate,
      endDate,
      cities: [],
    });
  };

  return (
    <View style={s.safeArea}>
      <WizardHeader title="여행 기간" step={2} onBack={onBack} />

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.label}>언제 떠나나요?</Text>

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
                const isMid = !!endDate && date > startDate && date < endDate;
                const isPast = date < today;
                const isTaken = isBlockedDay(date, taken);
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    style={s.calCell}
                    activeOpacity={0.7}
                    disabled={isPast || isTaken}
                    onPress={() => pickDay(day)}
                  >
                    <View
                      style={[
                        s.dayPill,
                        isMid && s.dayPillMid,
                        isEdge && s.dayPillEdge,
                        isTaken && s.dayPillTaken,
                      ]}
                    >
                      <Text
                        style={[
                          s.dayText,
                          isPast && s.dayTextPast,
                          isTaken && s.dayTextTaken,
                          isEdge && s.dayTextEdge,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        {takenState === 'failed' && (
          <Text style={s.takenNote}>
            다른 여행 기간을 불러오지 못했어요. 겹치면 다음 단계에서 알려드려요
          </Text>
        )}

        {taken.length > 0 && (
          <Text style={s.takenNote}>
            줄 그어진 날은 이미 다른 여행이 있어 고를 수 없어요
          </Text>
        )}

        {ready && (
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

export default PlanPeriodView;
