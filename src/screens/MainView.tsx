import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabBar, { TabKey } from '../component/TabBar';
import colors from '../assets/constants/colors';
import { mainStyles as styles } from './MainView.styles';

// ── 더미 데이터 ──────────────────────────────────────
const TRIP = {
  name: '싱가포르',
  dDay: 1488,
  localTime: 'PM 10:24',
  exchange: '1 SGD = 1200 KRW',
  greeting: { day: 1, hello: 'Hello', local: '안녕하세요' },
};

const POPULATION = [
  { flag: '🇨🇳', label: '중국계', pct: 75, color: colors.primary },
  { flag: '🇲🇾', label: '말레이계', pct: 14, color: colors.red },
  { flag: '🇮🇳', label: '인도계', pct: 9, color: colors.teal },
];

const POPULATION_NOTE =
  '중국계가 75%, 말레이계 14%, 인도계는 9%로\n중국계가 주로 구성되어 있으며\n여러 문화가 공존하는 다문화 국가입니다.';

interface CalCell {
  d: number;
  muted?: boolean;
  red?: boolean;
  selected?: boolean;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const WEEK1: CalCell[] = [
  { d: 28, muted: true }, { d: 29, muted: true }, { d: 30, muted: true },
  { d: 30, muted: true }, { d: 30, muted: true }, { d: 1 }, { d: 2 },
];
const WEEK2: CalCell[] = [
  { d: 3 }, { d: 4 }, { d: 5, red: true }, { d: 6 }, { d: 7 },
  { d: 8, selected: true }, { d: 9 },
];

const EVENT = {
  tag: '음식',
  title: '싱가포르 푸드 페스티벌',
  desc: '전 세계 미식가들의 축제',
  time: '19:45, 20:45',
  place: '베이프론트 이벤트 스페이스',
};
// ────────────────────────────────────────────────────

/** 상단 헤더 */
const Header: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.headerLogo}>
      <Text style={styles.headerLogoPart}>Part</Text>
      <Text style={styles.headerLogoTrip}>Trip</Text>
    </Text>
    <TouchableOpacity style={styles.headerProfile}>
      <Text style={styles.headerProfileIcon}>👤</Text>
    </TouchableOpacity>
  </View>
);

/** 여행지 배너 */
const TripBanner: React.FC = () => (
  <View style={styles.bannerCard}>
    <View style={styles.bannerBg}>
      <View style={styles.bannerOverlay} />
      <View style={styles.bannerDDayBadge}>
        <Text style={styles.bannerDDayText}>D - {TRIP.dDay}</Text>
      </View>
      <View style={styles.bannerBottomRow}>
        <Text style={styles.bannerCountry}>{TRIP.name}</Text>
        <TouchableOpacity style={styles.changeBtn} activeOpacity={0.85}>
          <Text style={styles.changeBtnText}>여행지 변경 ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/** 인사말(번역) 카드 */
const GreetingCard: React.FC = () => (
  <View style={styles.greetingCard}>
    <View style={styles.speakerCircle}>
      <Text style={styles.speakerIcon}>🔊</Text>
    </View>
    <View style={styles.greetingTextArea}>
      <View style={styles.dayBadge}>
        <Text style={styles.dayBadgeText}>Day {TRIP.greeting.day}</Text>
      </View>
      <Text style={styles.greetingHello}>{TRIP.greeting.hello}</Text>
      <Text style={styles.greetingLocal}>{TRIP.greeting.local}</Text>
    </View>
    <Text style={styles.translateIcon}>文ᴬ</Text>
  </View>
);

/** 현지 시각 / 환율 카드 */
const StatCards: React.FC = () => (
  <View style={styles.statRow}>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>현지 시각</Text>
      <Text style={styles.statValue}>{TRIP.localTime}</Text>
    </View>
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>오늘의 환율</Text>
      <Text style={styles.statValue}>{TRIP.exchange}</Text>
    </View>
  </View>
);

/** 여행지 정보 (인구 구성) */
const TripInfoSection: React.FC = () => (
  <View>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>👥</Text>
      <Text style={styles.sectionTitle}>여행지 정보</Text>
    </View>

    <View style={styles.carouselRow}>
      <Text style={styles.chevron}>‹</Text>

      <View style={[styles.card, styles.infoCard]}>
        <Text style={styles.cardTitle}>인구 구성</Text>

        {POPULATION.map((p) => (
          <View key={p.label} style={styles.popItem}>
            <View style={styles.popLabelRow}>
              <Text style={styles.popLabel}>
                {p.flag}  {p.label}
              </Text>
              <Text style={styles.popPct}>{p.pct}%</Text>
            </View>
            <View style={styles.popTrack}>
              <View
                style={[
                  styles.popFill,
                  { width: `${p.pct}%`, backgroundColor: p.color },
                ]}
              />
            </View>
          </View>
        ))}

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{POPULATION_NOTE}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </View>
  </View>
);

/** 이달의 축제 & 이벤트 */
const FestivalSection: React.FC = () => (
  <View>
    <View style={styles.sectionHeaderBetween}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📅</Text>
        <Text style={styles.sectionTitle}>이달의 축제 & 이벤트</Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.seeAll}>전체보기 →</Text>
      </TouchableOpacity>
    </View>

    {/* 달력 */}
    <View style={styles.card}>
      <View style={styles.calHeader}>
        <Text style={styles.calMonth}>2024년 5월</Text>
        <Text style={styles.calNav}>‹  ›</Text>
      </View>

      <View style={styles.calRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.calWeekday}>{w}</Text>
        ))}
      </View>

      {[WEEK1, WEEK2].map((week, wi) => (
        <View key={wi} style={styles.calRow}>
          {week.map((cell, ci) => (
            <View key={ci} style={styles.calCell}>
              <View style={cell.selected ? styles.calSelected : undefined}>
                <Text
                  style={[
                    styles.calDay,
                    cell.muted && styles.calMuted,
                    cell.red && styles.calRed,
                    cell.selected && styles.calSelectedText,
                  ]}
                >
                  {cell.d}
                </Text>
              </View>
              {cell.selected && <View style={styles.calDot} />}
            </View>
          ))}
        </View>
      ))}
    </View>

    {/* 이벤트 카드 */}
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.85}>
      <View style={styles.eventThumb}>
        <Text style={styles.eventThumbIcon}>🎆</Text>
      </View>
      <View style={styles.eventBody}>
        <View style={styles.eventTag}>
          <Text style={styles.eventTagText}>{EVENT.tag}</Text>
        </View>
        <Text style={styles.eventTitle}>{EVENT.title}</Text>
        <Text style={styles.eventDesc}>{EVENT.desc}</Text>
        <View style={styles.eventMetaRow}>
          <Text style={styles.eventMeta}>🕐 {EVENT.time}</Text>
          <Text style={styles.eventMeta}>📍 {EVENT.place}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

/** 메인 뷰 */
const MainView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TripBanner />
        <GreetingCard />
        <StatCards />
        <TripInfoSection />
        <FestivalSection />
      </ScrollView>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
};

export default MainView;
