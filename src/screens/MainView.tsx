import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── 색상 상수 ───────────────────────────────────────
const BLUE      = '#1a7fd4';
const BLUE_DARK = '#155fa0';
const BG        = '#f4f7fb';
const CARD_BG   = '#ffffff';
// ────────────────────────────────────────────────────

// ── 더미 데이터 ──────────────────────────────────────
const COUNTRY = {
  name: '대한민국',
  dDay: 1488,
  userName: '안녕하세요구르트',
  info: [
    {
      title: '1. 지리',
      lines: [
        '위치: 동아시아, 한반도 남부',
        '면적: 약 100,210 km²',
        '수도: 서울',
        '주요 도시: 부산, 인천, 대구, 대전, 광주, 수원',
      ],
    },
    {
      title: '2. 인구 & 사회',
      lines: [
        '인구: 약 5,170만 명',
        '공용어: 한국어',
        '종교: 개신교, 불교, 가톨릭 등 (무종교 인구도 다수)',
        '민족: 한민족 (단일 민족 국가)',
      ],
    },
    {
      title: '3. 경제',
      lines: [
        'GDP: 세계 약 13~14위 (약 1조 7천억 달러)',
        '주요 산업: 반도체, 자동차, 조선, 철강, IT, K-콘텐츠',
        '주요 기업: 삼성, 현대, LG, SK, 카카오, 네이버',
      ],
    },
    {
      title: '4. 문화',
      lines: [
        '한류(K-Wave): K-pop, K-드라마, 영화(오징어 게임, 기생충 등)로 세계적 영향력',
        '음식: 김치, 비빔밥, 불고기, 삼겹살 등',
        '전통 명절: 설날, 추석',
      ],
    },
    {
      title: '5. 기타',
      lines: [
        '화폐: 대한민국 원 (KRW, ₩)',
        '국가 코드: KR / +82 (전화)',
        '시간대: UTC+9 (한국 표준시)',
        '인터넷 속도: 세계 최고 수준',
      ],
    },
  ],
};

const TOOLS = [
  { icon: '$',  label: '환율 계산기' },
  { icon: '✓=', label: '여행 체크 리스트' },
  { icon: '🏙', label: '캐릭터 랭킹' },
  { icon: '🤝', label: '에티켓' },
  { icon: '✱',  label: '의료 긴급 카드' },
  { icon: '📞', label: '국가 긴급 번호' },
];
// ────────────────────────────────────────────────────

/** 상단 여행 배너 카드 */
const TripBanner: React.FC = () => (
  <View style={styles.bannerCard}>
    {/* 배경 — 실제로는 ImageBackground에 source={{ uri: '...' }} 사용 */}
    <View style={styles.bannerBg}>
      {/* 그라데이션 오버레이 */}
      <View style={styles.bannerOverlay} />

      <View style={styles.bannerTopRow}>
        <Text style={styles.bannerDDay}>D - {COUNTRY.dDay}</Text>
        <Text style={styles.bannerCountry}>{COUNTRY.name}</Text>
      </View>

      <Text style={styles.bannerUser}>{COUNTRY.userName}</Text>
    </View>
  </View>
);

/** 국가 정보 카드 */
const CountryInfoCard: React.FC = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{COUNTRY.name}?</Text>
    {COUNTRY.info.map((section) => (
      <View key={section.title} style={styles.infoSection}>
        <Text style={styles.infoSectionTitle}>{section.title}</Text>
        {section.lines.map((line) => (
          <Text key={line} style={styles.infoLine}>{line}</Text>
        ))}
      </View>
    ))}
  </View>
);

/** 메뉴판 번역 버튼 */
const MenuTranslateButton: React.FC = () => (
  <TouchableOpacity style={styles.translateBtn} activeOpacity={0.8}>
    <Text style={styles.translateIcon}>🍽</Text>
    <Text style={styles.translateText}>메뉴판 번역</Text>
  </TouchableOpacity>
);

/** 툴 그리드 */
const ToolGrid: React.FC = () => (
  <View style={styles.toolGrid}>
    {TOOLS.map((tool) => (
      <TouchableOpacity key={tool.label} style={styles.toolItem} activeOpacity={0.75}>
        <View style={styles.toolCircle}>
          <Text style={styles.toolIcon}>{tool.icon}</Text>
        </View>
        <Text style={styles.toolLabel}>{tool.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

/** 메인 뷰 */
const MainView: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>
          <Text style={styles.headerLogoPart}>Part</Text>
          <Text style={styles.headerLogoTrip}>Trip</Text>
        </Text>
        <TouchableOpacity style={styles.headerProfile}>
          <Text style={styles.headerProfileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* 스크롤 콘텐츠 */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TripBanner />
        <CountryInfoCard />
        <MenuTranslateButton />
        <ToolGrid />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── 스타일 ───────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eef5',
  },
  headerLogo: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  headerLogoPart: {
    color: BLUE,
  },
  headerLogoTrip: {
    color: BLUE_DARK,
  },
  headerProfile: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8eef5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfileIcon: {
    fontSize: 18,
  },

  // 스크롤
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },

  // 배너 카드
  bannerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  bannerBg: {
    flex: 1,
    backgroundColor: '#5b9fd6', // 실제 이미지 없을 때 폴백 색상
    padding: 18,
    justifyContent: 'space-between',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,40,90,0.35)',
  },
  bannerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bannerDDay: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bannerCountry: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  bannerUser: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    fontWeight: '700',
  },

  // 국가 정보 카드
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a2a3a',
    marginBottom: 14,
  },
  infoSection: {
    marginBottom: 14,
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BLUE_DARK,
    marginBottom: 4,
  },
  infoLine: {
    fontSize: 13,
    color: '#3a4a5a',
    lineHeight: 20,
  },

  // 메뉴판 번역 버튼
  translateBtn: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#dce6f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  translateIcon: {
    fontSize: 20,
  },
  translateText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a2a3a',
    letterSpacing: 0.3,
  },

  // 툴 그리드
  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  toolItem: {
    width: (width - 32 - 32) / 3,
    alignItems: 'center',
    gap: 8,
  },
  toolCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  toolIcon: {
    fontSize: 22,
    color: '#ffffff',
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2a3a4a',
    textAlign: 'center',
  },
});

export default MainView;