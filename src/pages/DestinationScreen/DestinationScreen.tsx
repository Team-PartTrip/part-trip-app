import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { destinationStyles as s } from './DestinationScreen.styles';
import { saveTravelPlan } from '../../entities/main/api';
import { setDestinationCallback } from './destinationSelectBridge';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 피그마 B2 의 여행 스타일 칩. 서버에 저장할 곳이 아직 없어서 화면 상태로만 둔다.
const STYLES = ['휴양', '맛집', '액티비티', '문화'];

/** 2026, 7(=8월), 23 → "2026-08-23" */
function toIso(year: number, monthIndex: number, day: number): string {
  const month = `${monthIndex + 1}`.padStart(2, '0');
  return `${year}-${month}-${`${day}`.padStart(2, '0')}`;
}

/** "2026-08-23" → "08.23" (피그마 표기) */
function toDotLabel(date: string): string {
  const [, month, day] = date.split('-');
  return `${month}.${day}`;
}

/** "4박 5일" */
function formatNights(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms)) {
    return '';
  }
  const nights = Math.max(0, Math.round(ms / 86_400_000));
  return `${nights}박 ${nights + 1}일`;
}

interface Destination {
  countryName: string;
  cityName: string;
}

interface DestinationScreenProps {
  onBack?: () => void;
  /** 여행지 칸을 누르면 여행지 선택 화면으로 보낸다 */
  onPickDestination?: () => void;
  onSaved?: () => void;
}

const DestinationScreen: React.FC<DestinationScreenProps> = ({
  onBack,
  onPickDestination,
  onSaved,
}) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [people, setPeople] = useState(4);
  const [styleTags, setStyleTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // 달력 시트
  const [sheetOpen, setSheetOpen] = useState(false);
  const [cursor, setCursor] = useState(() => new Date());
  const [draftStart, setDraftStart] = useState('');
  const [draftEnd, setDraftEnd] = useState('');

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();

  // 여행지 선택 화면은 콜백 하나만 물고 돌아오므로 화면이 살아있는 동안 등록해둔다
  useEffect(() => {
    setDestinationCallback(picked => {
      setDestination({
        countryName: picked.countryName,
        cityName: picked.name,
      });
    });
  }, []);

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

  const openSheet = () => {
    setDraftStart(startDate);
    setDraftEnd(endDate);
    if (startDate) {
      const [y, m] = startDate.split('-').map(Number);
      setCursor(new Date(y, m - 1, 1));
    }
    setSheetOpen(true);
  };

  const pickDay = (day: number) => {
    const date = toIso(year, monthIndex, day);
    // 시작만 정해진 상태에서 뒷날짜를 누르면 기간이 되고, 그 밖에는 새로 시작한다
    if (draftStart && !draftEnd && date > draftStart) {
      setDraftEnd(date);
      return;
    }
    setDraftStart(date);
    setDraftEnd('');
  };

  const confirmDates = () => {
    if (!draftStart || !draftEnd) {
      return;
    }
    setStartDate(draftStart);
    setEndDate(draftEnd);
    setSheetOpen(false);
  };

  const toggleStyle = (tag: string) =>
    setStyleTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );

  const ready = !!destination && !!startDate && !!endDate;

  const handleSave = async () => {
    if (!ready || !destination) {
      return;
    }
    try {
      setSaving(true);
      // 인원·여행 스타일은 아직 받는 필드가 없어서 보내지 않는다
      await saveTravelPlan({
        countryName: destination.countryName,
        cityName: destination.cityName,
        startDate,
        endDate,
      });
      onSaved?.();
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.title}>여행 정보 설정</Text>
        <Text style={s.subtitle}>여행지와 기간, 인원을 알려주세요</Text>
      </SafeAreaView>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.label}>여행지</Text>
        <TouchableOpacity
          style={[s.field, !!destination && s.fieldFilled]}
          activeOpacity={0.85}
          onPress={onPickDestination}
        >
          <Text style={destination ? s.fieldText : s.fieldPlaceholder}>
            {destination
              ? `${destination.cityName}, ${destination.countryName}`
              : '여행지를 선택해주세요'}
          </Text>
        </TouchableOpacity>

        <Text style={[s.label, s.labelSpaced]}>여행 기간</Text>
        <View style={s.dateRow}>
          <TouchableOpacity
            style={[s.field, s.dateBox, !!startDate && s.fieldFilled]}
            activeOpacity={0.85}
            onPress={openSheet}
          >
            <Text style={startDate ? s.fieldText : s.fieldPlaceholder}>
              {startDate ? toDotLabel(startDate) : '시작일'}
            </Text>
          </TouchableOpacity>
          <Text style={s.dash}>–</Text>
          <TouchableOpacity
            style={[s.field, s.dateBox, !!endDate && s.fieldFilled]}
            activeOpacity={0.85}
            onPress={openSheet}
          >
            <Text style={endDate ? s.fieldText : s.fieldPlaceholder}>
              {endDate ? toDotLabel(endDate) : '종료일'}
            </Text>
          </TouchableOpacity>
        </View>
        {!!startDate && !!endDate && (
          <Text style={s.nights}>{formatNights(startDate, endDate)}</Text>
        )}

        <Text style={[s.label, s.labelSpaced]}>인원</Text>
        <View style={s.field}>
          <Text style={s.peopleLabel}>함께 가는 인원</Text>
          <TouchableOpacity
            style={[s.stepBtn, people <= 1 && s.stepBtnOff]}
            activeOpacity={0.7}
            disabled={people <= 1}
            onPress={() => setPeople(n => Math.max(1, n - 1))}
          >
            <Text style={s.stepText}>−</Text>
          </TouchableOpacity>
          <Text style={s.stepValue}>{people}</Text>
          <TouchableOpacity
            style={[s.stepBtn, people >= 20 && s.stepBtnOff]}
            activeOpacity={0.7}
            disabled={people >= 20}
            onPress={() => setPeople(n => Math.min(20, n + 1))}
          >
            <Text style={s.stepText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.label, s.labelSpaced]}>여행 스타일</Text>
        <View style={s.chipRow}>
          {STYLES.map(tag => {
            const on = styleTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[s.chip, on && s.chipOn]}
                activeOpacity={0.85}
                onPress={() => toggleStyle(tag)}
              >
                <Text style={[s.chipText, on && s.chipTextOn]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.saveBtn, (!ready || saving) && s.saveBtnOff]}
          activeOpacity={0.85}
          disabled={!ready || saving}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.saveText}>저장하고 플래너로</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>

      {/* 날짜 선택 — 외부 달력 라이브러리 없이 C3 와 같은 방식으로 그린다 */}
      <Modal
        transparent
        animationType="slide"
        visible={sheetOpen}
        onRequestClose={() => setSheetOpen(false)}
      >
        <TouchableOpacity
          style={s.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setSheetOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} style={s.sheet}>
            <View style={s.sheetHead}>
              <Text style={s.sheetMonth}>
                {year}년 {monthIndex + 1}월
              </Text>
              <TouchableOpacity
                hitSlop={10}
                onPress={() => setCursor(new Date(year, monthIndex - 1, 1))}
              >
                <Text style={s.sheetArrow}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={10}
                onPress={() => setCursor(new Date(year, monthIndex + 1, 1))}
              >
                <Text style={s.sheetArrow}>›</Text>
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
                  const isEdge = date === draftStart || date === draftEnd;
                  const isMid =
                    !!draftEnd && date > draftStart && date < draftEnd;
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

            <Text style={s.sheetHint}>
              {draftStart && draftEnd
                ? `${toDotLabel(draftStart)} – ${toDotLabel(
                    draftEnd,
                  )} · ${formatNights(draftStart, draftEnd)}`
                : '시작일과 종료일을 차례로 눌러주세요'}
            </Text>

            <TouchableOpacity
              style={[s.sheetDone, !(draftStart && draftEnd) && s.sheetDoneOff]}
              activeOpacity={0.85}
              disabled={!(draftStart && draftEnd)}
              onPress={confirmDates}
            >
              <Text style={s.sheetDoneText}>선택 완료</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DestinationScreen;
