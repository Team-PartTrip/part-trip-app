import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../assets/constants/colors';
import { festivalStyles as styles } from './FestivalScreen.styles';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

// 2026년 5월 (1일이 금요일)
const WEEKS: (number | null)[][] = [
  [null, null, null, null, null, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
  [31, null, null, null, null, null, null],
];
const SELECTED_DAY = 8;

const EVENTS = [
  {
    icon: '🎆',
    tag: '라이트쇼',
    tagBg: colors.tint,
    tagColor: colors.primary,
    title: '가든스 바이 더 베이 라이트쇼',
    desc: '환상적인 빛의 음악쇼 향연',
    time: '19:45, 20:45',
    place: '슈퍼트리 그로브',
  },
  {
    icon: '🍴',
    tag: '음식',
    tagBg: colors.tagRedBg,
    tagColor: colors.redAccent,
    title: '싱가포르 푸드 페스티벌',
    desc: '전 세계 미식가들의 축제',
    time: '19:45, 20:45',
    place: '베이프론트 이벤트 스페이스',
  },
];

const FestivalScreen: React.FC = () => {
  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 연도 */}
        <View style={styles.yearRow}>
          <Text style={styles.yearText}>2026년</Text>
          <Text style={styles.yearCaret}>▾</Text>
        </View>

        {/* 달력 */}
        <View style={styles.calCard}>
          <View style={styles.calRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={styles.calWeekday}>{w}</Text>
            ))}
          </View>
          {WEEKS.map((week, wi) => (
            <View key={wi} style={styles.calRow}>
              {week.map((d, di) => (
                <View key={di} style={styles.calCell}>
                  {d !== null && (
                    <View style={d === SELECTED_DAY ? styles.calSelected : undefined}>
                      <Text
                        style={[
                          styles.calDay,
                          d === SELECTED_DAY && styles.calSelectedText,
                        ]}
                      >
                        {d}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 선택 날짜 */}
        <Text style={styles.dateTitle}>2026년 5월 {SELECTED_DAY}일</Text>

        {/* 이벤트 목록 */}
        {EVENTS.map((e) => (
          <TouchableOpacity key={e.title} style={styles.eventCard} activeOpacity={0.85}>
            <View style={styles.eventThumb}>
              <Text style={styles.eventThumbIcon}>{e.icon}</Text>
            </View>
            <View style={styles.eventBody}>
              <View style={[styles.eventTag, { backgroundColor: e.tagBg }]}>
                <Text style={[styles.eventTagText, { color: e.tagColor }]}>{e.tag}</Text>
              </View>
              <Text style={styles.eventTitle}>{e.title}</Text>
              <Text style={styles.eventDesc}>{e.desc}</Text>
              <View style={styles.eventMetaRow}>
                <Text style={styles.eventMeta}>🕐 {e.time}</Text>
                <Text style={styles.eventMeta}>📍 {e.place}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FestivalScreen;
