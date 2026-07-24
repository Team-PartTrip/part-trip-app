import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../shared/tokens/colors';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { attendanceStyles as s } from './AttendanceView.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const FIRST_WEEKDAY = 5; // 2026-05-01 = 금요일
const DAYS = 31;
const ATTENDED = [8, 9, 10, 11];
const TODAY = 12;

function buildWeeks(): (number | null)[][] {
  const cells: (number | null)[] = [];
  for (let i = 0; i < FIRST_WEEKDAY; i++) cells.push(null);
  for (let d = 1; d <= DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const AttendanceView: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const weeks = buildWeeks();
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="출석체크" onBack={onBack} />
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.month}>2026년 5월 ▾</Text>
        <View style={s.legendRow}>
          <Text style={s.streak}>연속출석 4일째</Text>
          <View style={s.legend}>
            <View style={[s.dot, { backgroundColor: colors.tintStrong }]} />
            <Text style={s.legendText}>오늘</Text>
            <View style={[s.dot, { backgroundColor: colors.primary }]} />
            <Text style={s.legendText}>출석</Text>
          </View>
        </View>
        <View style={s.calCard}>
          <View style={s.weekRow}>
            {WEEKDAYS.map((w, i) => (
              <Text key={w} style={[s.weekday, i === 0 && s.sun]}>
                {w}
              </Text>
            ))}
          </View>
          {weeks.map((week, wi) => (
            <View key={wi} style={s.weekRow}>
              {week.map((d, di) => {
                const on =
                  d != null &&
                  (ATTENDED.includes(d) || (checkedIn && d === TODAY));
                const today = d === TODAY;
                return (
                  <View key={di} style={s.cell}>
                    {d != null && (
                      <View
                        style={[s.inner, on && s.on, today && !on && s.today]}
                      >
                        <Text style={[s.day, di === 0 && s.sun, on && s.dayOn]}>
                          {d}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.btn, checkedIn && s.btnDone]}
          activeOpacity={0.85}
          disabled={checkedIn}
          onPress={() => setCheckedIn(true)}
        >
          <Text style={s.btnText}>
            {checkedIn ? '오늘 출석 완료 🎉' : '출석 체크하고 포인트받기'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AttendanceView;
