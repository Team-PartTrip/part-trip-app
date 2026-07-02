import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { mainStyles as s } from './MainView.styles';

const TRIP = {
  name: '싱가포르',
  image: require('../../assets/images/Singapore.png'),
  dDay: 4,
  weather: '29°C',
  weatherSub: '체감 온도 32°C',
  exchange: '1 SGD = 1200 KRW',
  greeting: { day: 1, hello: 'Hello', local: '안녕하세요' },
};

const POPULATION = [
  { flag: '🇨🇳', label: '중국계', pct: 75, color: '#1a7fd4' },
  { flag: '🇲🇾', label: '말레이계', pct: 14, color: '#f06b6b' },
  { flag: '🇮🇳', label: '인도계', pct: 9, color: '#1bb89a' },
];
const POPULATION_NOTE =
  '중국계가 75%, 말레이계 14%, 인도계는 9%로 중국계가 주로 구성되어 있으며 여러 문화가 공존하는 다문화 국가입니다.';

const PLACES = [
  {
    id: 'p1',
    name: '멀라이언 사자 동상',
    loc: '멀라이언 파크',
    time: '19:45, 20:45',
  },
  {
    id: 'p2',
    name: '싱가포르 플라이어',
    loc: '마리나 베이',
    time: '19:45, 20:45',
  },
];
const FOODS = [
  {
    id: 'f1',
    name: '칠리크랩',
    desc: '매콤달콤한 소스가 일품인 시그니처 요리',
  },
  { id: 'f2', name: '로컬 푸드', desc: '치킨라이스, 락사 등 호커 센터의 별미' },
];
const ETIQUETTE = [
  { text: '높은 수준의 치안 및 수돗물 음용 가능', ok: true },
  { text: '껌 반입 및 무단 투기 벌금 주의', ok: false },
  { text: '지정 구역 외 흡연 금지', ok: false },
];

const INFO_TABS = [
  '인구 구성',
  '관광 장소',
  '대표 음식',
  '현지 에티켓',
] as const;
type InfoTab = (typeof INFO_TABS)[number];

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
type Cell = { d: number; muted?: boolean; red?: boolean; selected?: boolean };
const WEEKS: Cell[][] = [
  [
    { d: 28, muted: true },
    { d: 29, muted: true },
    { d: 30, muted: true },
    { d: 1 },
    { d: 2 },
    { d: 3 },
    { d: 4 },
  ],
  [
    { d: 5, red: true },
    { d: 6 },
    { d: 7 },
    { d: 8, selected: true },
    { d: 9 },
    { d: 10 },
    { d: 11 },
  ],
];

interface MainViewProps {
  onOpenFestival?: () => void;
  onOpenDestination?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenFestival,
  onOpenDestination,
}) => {
  const [tab, setTab] = useState<InfoTab>('인구 구성');

  return (
    <View style={s.safeArea}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 여행지 배너 */}
        <View style={s.bannerCard}>
          <ImageBackground
            source={TRIP.image}
            style={s.bannerBg}
            resizeMode="cover"
          >
            <View style={s.bannerOverlay} />
            <View style={s.bannerDDayBadge}>
              <Text style={s.bannerDDayText}>D - {TRIP.dDay}</Text>
            </View>
            <View style={s.bannerBottomRow}>
              <Text style={s.bannerCountry}>{TRIP.name}</Text>
              <TouchableOpacity
                style={s.changeBtn}
                activeOpacity={0.85}
                onPress={onOpenDestination}
              >
                <Text style={s.changeBtnText}>여행지 변경 ›</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* 인사말 */}
        <View style={s.greetingCard}>
          <View style={s.speakerCircle}>
            <Text style={s.speakerIcon}>🔊</Text>
          </View>
          <View style={s.greetingTextArea}>
            <View style={s.dayBadge}>
              <Text style={s.dayBadgeText}>Day {TRIP.greeting.day}</Text>
            </View>
            <Text style={s.greetingHello}>{TRIP.greeting.hello}</Text>
            <Text style={s.greetingLocal}>{TRIP.greeting.local}</Text>
          </View>
          <Text style={s.translateIcon}>文ᴬ</Text>
        </View>

        {/* 날씨 / 환율 */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>현지 날씨</Text>
            <Text style={s.statValue}>{TRIP.weather}</Text>
            <Text style={s.statSub}>{TRIP.weatherSub}</Text>
          </View>
          <View style={s.statCard}>
            <Text style={s.statLabel}>오늘의 환율</Text>
            <Text style={s.statValue}>{TRIP.exchange}</Text>
          </View>
        </View>

        {/* 여행지 정보 (탭) */}
        <View>
          <View style={s.sectionHeader}>
            <Text style={s.sectionIcon}>👥</Text>
            <Text style={s.sectionTitle}>여행지 정보</Text>
          </View>
          <View style={s.tabRow}>
            {INFO_TABS.map(t => {
              const active = tab === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[s.tab, active && s.tabActive]}
                  activeOpacity={0.85}
                  onPress={() => setTab(t)}
                >
                  <Text style={[s.tabText, active && s.tabTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={s.card}>
            {tab === '인구 구성' && (
              <>
                {POPULATION.map(p => (
                  <View key={p.label} style={s.popItem}>
                    <View style={s.popLabelRow}>
                      <Text style={s.popLabel}>
                        {p.flag} {p.label}
                      </Text>
                      <Text style={s.popPct}>{p.pct}%</Text>
                    </View>
                    <View style={s.popTrack}>
                      <View
                        style={[
                          s.popFill,
                          { width: `${p.pct}%`, backgroundColor: p.color },
                        ]}
                      />
                    </View>
                  </View>
                ))}
                <View style={s.noteBox}>
                  <Text style={s.noteText}>{POPULATION_NOTE}</Text>
                </View>
              </>
            )}

            {tab === '관광 장소' &&
              PLACES.map(p => (
                <View key={p.id} style={s.placeRow}>
                  <View style={s.placeThumb} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.placeName}>{p.name}</Text>
                    <Text style={s.placeMeta}>📍 {p.loc}</Text>
                    <Text style={s.placeMeta}>🕐 {p.time}</Text>
                  </View>
                </View>
              ))}

            {tab === '대표 음식' && (
              <View style={s.foodRow}>
                {FOODS.map(f => (
                  <View key={f.id} style={s.foodItem}>
                    <View style={s.foodThumb} />
                    <Text style={s.foodName}>{f.name}</Text>
                    <Text style={s.foodDesc}>{f.desc}</Text>
                  </View>
                ))}
              </View>
            )}

            {tab === '현지 에티켓' &&
              ETIQUETTE.map((e, i) => (
                <View
                  key={i}
                  style={[
                    s.etiquetteItem,
                    i === ETIQUETTE.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <Text style={s.etiquetteText}>{e.text}</Text>
                  <Text style={s.etiquetteIcon}>{e.ok ? '✅' : '❌'}</Text>
                </View>
              ))}
          </View>
        </View>

        {/* 이달의 축제 & 이벤트 */}
        <View>
          <View style={s.sectionHeaderBetween}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionIcon}>📅</Text>
              <Text style={s.sectionTitle}>이달의 축제 & 이벤트</Text>
            </View>
            <TouchableOpacity onPress={onOpenFestival}>
              <Text style={s.seeAll}>전체보기 →</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            <View style={s.calHeader}>
              <Text style={s.calMonth}>2024년 5월</Text>
              <Text style={s.calNav}>‹ ›</Text>
            </View>
            <View style={s.calRow}>
              {WEEKDAYS.map(w => (
                <Text key={w} style={s.calWeekday}>
                  {w}
                </Text>
              ))}
            </View>
            {WEEKS.map((week, wi) => (
              <View key={wi} style={s.calRow}>
                {week.map((c, ci) => (
                  <View key={ci} style={s.calCell}>
                    <View style={c.selected ? s.calSelected : undefined}>
                      <Text
                        style={[
                          s.calDay,
                          c.muted && s.calMuted,
                          c.red && s.calRed,
                          c.selected && s.calSelectedText,
                        ]}
                      >
                        {c.d}
                      </Text>
                    </View>
                    {c.selected && <View style={s.calDot} />}
                  </View>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={s.eventCard}
            activeOpacity={0.85}
            onPress={onOpenFestival}
          >
            <View style={s.eventThumb}>
              <Text style={s.eventThumbIcon}>🎆</Text>
            </View>
            <View style={s.eventBody}>
              <View style={s.eventTag}>
                <Text style={s.eventTagText}>음식</Text>
              </View>
              <Text style={s.eventTitle}>싱가포르 푸드 페스티벌</Text>
              <Text style={s.eventDesc}>전 세계 미식가들의 축제</Text>
              <Text style={s.eventMeta}>
                🕐 19:45, 20:45 📍 베이프론트 이벤트 스페이스
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainView;
