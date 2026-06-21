import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import colors from '../../assets/constants/colors';
import { mainStyles as styles } from './MainView.styles';

// 여행지 정보 카드 한 장의 너비 (화면 너비 - 좌우 패딩 16*2)
const CARD_W = Dimensions.get('window').width - 32;
const INFO_CARD_COUNT = 4;

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

const WEATHER = [
  { icon: '🌡', label: '평균 기온', desc: '연중 24~32°C의 열대 기후' },
  { icon: '💧', label: '기상 특징', desc: '고온 다습하며 갑작스러운 스콜이 잦음' },
  { icon: '🌂', label: '추천 복장', desc: '통기성 좋은 여름옷과 휴대용 우산' },
];

const FOODS = [
  { icon: '🦀', name: '칠리크랩', desc: '매콤달콤한 소스가 입맛 당기는 요리' },
  { icon: '🍜', name: '로컬 푸드', desc: '치킨라이스, 락사 등 토착 별미' },
];

const ETIQUETTE = [
  { ok: true, text: '높은 수준의 치안 및 수돗물 음용 가능', icon: '✅' },
  { ok: false, text: '껌 반입 및 무단 투기 벌금 주의', icon: '❌' },
  { ok: false, text: '지정 구역 외 흡연 금지', icon: '🚭' },
];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface CalCell {
  d: number;
  muted?: boolean;
  red?: boolean;
  selected?: boolean;
}

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

/** 여행지 배너 */
const TripBanner: React.FC<{ onChange?: () => void }> = ({ onChange }) => (
  <View style={styles.bannerCard}>
    <View style={styles.bannerBg}>
      <View style={styles.bannerOverlay} />
      <View style={styles.bannerDDayBadge}>
        <Text style={styles.bannerDDayText}>D - {TRIP.dDay}</Text>
      </View>
      <View style={styles.bannerBottomRow}>
        <Text style={styles.bannerCountry}>{TRIP.name}</Text>
        <TouchableOpacity style={styles.changeBtn} activeOpacity={0.85} onPress={onChange}>
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

/** 캐러셀 카드 1 — 인구 구성 */
const PopulationCard: React.FC = () => (
  <View style={{ width: CARD_W }}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>인구 구성</Text>
      {POPULATION.map((p) => (
        <View key={p.label} style={styles.popItem}>
          <View style={styles.popLabelRow}>
            <Text style={styles.popLabel}>{p.flag}  {p.label}</Text>
            <Text style={styles.popPct}>{p.pct}%</Text>
          </View>
          <View style={styles.popTrack}>
            <View style={[styles.popFill, { width: `${p.pct}%`, backgroundColor: p.color }]} />
          </View>
        </View>
      ))}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{POPULATION_NOTE}</Text>
      </View>
    </View>
  </View>
);

/** 캐러셀 카드 2 — 현지 날씨 */
const WeatherCard: React.FC = () => (
  <View style={{ width: CARD_W }}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>☀️ 현지 날씨</Text>
      {WEATHER.map((w) => (
        <View key={w.label} style={styles.infoRow}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>{w.icon}</Text>
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoLabel}>{w.label}</Text>
            <Text style={styles.infoDesc}>{w.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

/** 캐러셀 카드 3 — 대표 음식 */
const FoodCard: React.FC = () => (
  <View style={{ width: CARD_W }}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🍴 대표 음식</Text>
      <View style={styles.foodRow}>
        {FOODS.map((f) => (
          <View key={f.name} style={styles.foodItem}>
            <View style={styles.foodThumb}>
              <Text style={styles.foodThumbIcon}>{f.icon}</Text>
            </View>
            <Text style={styles.foodName}>{f.name}</Text>
            <Text style={styles.foodDesc}>{f.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

/** 캐러셀 카드 4 — 현지 에티켓 */
const EtiquetteCard: React.FC = () => (
  <View style={{ width: CARD_W }}>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🤝 현지 에티켓</Text>
      {ETIQUETTE.map((e) => (
        <View key={e.text} style={styles.etiquetteItem}>
          <Text style={styles.etiquetteText}>{e.text}</Text>
          <Text style={styles.etiquetteIcon}>{e.icon}</Text>
        </View>
      ))}
    </View>
  </View>
);

/** 여행지 정보 — 좌우 스와이프 캐러셀 */
const TripInfoCarousel: React.FC = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setIndex(i);
  };

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(INFO_CARD_COUNT - 1, i));
    scrollRef.current?.scrollTo({ x: next * CARD_W, animated: true });
    setIndex(next);
  };

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>👥</Text>
        <Text style={styles.sectionTitle}>여행지 정보</Text>
      </View>

      <View style={styles.carouselWrap}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <PopulationCard />
          <WeatherCard />
          <FoodCard />
          <EtiquetteCard />
        </ScrollView>

        {index > 0 && (
          <TouchableOpacity
            style={[styles.chevBtn, styles.chevLeft]}
            onPress={() => goTo(index - 1)}
          >
            <Text style={styles.chevron}>‹</Text>
          </TouchableOpacity>
        )}
        {index < INFO_CARD_COUNT - 1 && (
          <TouchableOpacity
            style={[styles.chevBtn, styles.chevRight]}
            onPress={() => goTo(index + 1)}
          >
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 페이지 인디케이터 */}
      <View style={styles.dotsRow}>
        {Array.from({ length: INFO_CARD_COUNT }).map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

/** 이달의 축제 & 이벤트 */
const FestivalSection: React.FC<{ onSeeAll?: () => void }> = ({ onSeeAll }) => (
  <View>
    <View style={styles.sectionHeaderBetween}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📅</Text>
        <Text style={styles.sectionTitle}>이달의 축제 & 이벤트</Text>
      </View>
      <TouchableOpacity onPress={onSeeAll}>
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
interface MainViewProps {
  onOpenFestival?: () => void;
  onOpenDestination?: () => void;
}

const MainView: React.FC<MainViewProps> = ({ onOpenFestival, onOpenDestination }) => {

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TripBanner onChange={onOpenDestination} />
        <GreetingCard />
        <StatCards />
        <TripInfoCarousel />
        <FestivalSection onSeeAll={onOpenFestival} />
      </ScrollView>

    </View>
  );
};

export default MainView;
