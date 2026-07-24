import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { mainStyles as s } from './MainView.styles';
import {
  getDday,
  getCountryInfo,
  getPopulationInfo,
  getTourPlaces,
  getFoodInfo,
  getFestivals,
  getExchangeRate,
  getWeather,
  DdayInfo,
  CountryInfo,
  PopulationInfo,
  TourPlace,
  FoodInfo,
  Festival,
  ExchangeRate,
  Weather,
} from '../../entities/main/api';
import { toImageUrl } from '../../shared/api/image';

const POP_COLORS = ['#1a7fd4', '#f06b6b', '#1bb89a', '#f0a93b', '#8a6bd8'];

const INFO_TABS = [
  '인구 구성',
  '관광 장소',
  '대표 음식',
  '현지 에티켓',
] as const;
type InfoTab = (typeof INFO_TABS)[number];

interface MainViewProps {
  onOpenFestival?: () => void;
  onOpenDestination?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenFestival,
  onOpenDestination,
}) => {
  const [tab, setTab] = useState<InfoTab>('인구 구성');
  const [loading, setLoading] = useState(true);
  const [dday, setDday] = useState<DdayInfo | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [population, setPopulation] = useState<PopulationInfo[]>([]);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [foods, setFoods] = useState<FoodInfo[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const d = await getDday();
          if (!alive) return;
          setDday(d);

          const [info, pop, tour, food, fest, rate, currentWeather] =
            await Promise.all([
              getCountryInfo(d.countryName).catch(() => null),
              getPopulationInfo(d.countryName).catch(() => []),
              getTourPlaces(d.countryName).catch(() => []),
              getFoodInfo(d.countryName).catch(() => []),
              getFestivals(d.countryName).catch(() => []),
              getExchangeRate(d.countryName).catch(() => null),
              getWeather(d.countryName).catch(() => null),
            ]);
          if (!alive) return;
          setCountryInfo(info);
          setPopulation(pop);
          setPlaces(tour);
          setFoods(food);
          setFestivals(fest);
          setExchangeRate(rate);
          setWeather(currentWeather);
        } catch {
          if (!alive) return;
          setDday(null);
        } finally {
          if (alive) setLoading(false);
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={{ marginTop: 60 }} />
      </View>
    );
  }

  if (!dday) {
    return (
      <View style={s.safeArea}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#333',
              marginBottom: 16,
              textAlign: 'center',
            }}
          >
            아직 등록된 여행 일정이 없어요{'\n'}여행지를 선택해보세요
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#1a7fd4',
              borderRadius: 14,
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
            activeOpacity={0.85}
            onPress={onOpenDestination}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
              여행지 선택하러 가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
            source={
              countryInfo?.imageUrl
                ? { uri: toImageUrl(countryInfo.imageUrl) }
                : undefined
            }
            style={s.bannerBg}
            resizeMode="cover"
          >
            <View style={s.bannerOverlay} />
            <View style={s.bannerDDayBadge}>
              <Text style={s.bannerDDayText}>{dday.dday}</Text>
            </View>
            <View style={s.bannerBottomRow}>
              <Text style={s.bannerCountry}>{dday.cityName}</Text>
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

        {/* 날씨 / 환율 */}
        <View style={s.statRow}>
          <View style={s.statCard}>
            <Text style={s.statLabel}>현지 날씨</Text>
            {weather ? (
              <>
                <Text style={s.statValue}>
                  {Math.round(weather.temperature)}°C
                </Text>
                <Text style={s.statSub}>
                  {weather.description} · 체감 {Math.round(weather.feelsLike)}
                  °C
                </Text>
              </>
            ) : (
              <Text style={s.statSub}>날씨 정보가 없습니다.</Text>
            )}
          </View>
          <View style={s.statCardWide}>
            <Text style={s.statLabel}>오늘의 환율</Text>
            {exchangeRate ? (
              <>
                <Text style={s.statValue}>
                  1 {exchangeRate.currencyCode} ={' '}
                  {exchangeRate.krwRate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  원
                </Text>
                {exchangeRate.date && (
                  <Text style={s.statSub}>{exchangeRate.date} 기준</Text>
                )}
              </>
            ) : (
              <Text style={s.statSub}>환율 정보가 없습니다.</Text>
            )}
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
            {tab === '인구 구성' &&
              (population.length === 0 ? (
                <Text style={s.noteText}>
                  아직 등록된 인구 구성 정보가 없습니다.
                </Text>
              ) : (
                population.map((p, i) => (
                  <View key={`${p.nationCode}-${i}`} style={s.popItem}>
                    <View style={s.popLabelRow}>
                      <Text style={s.popLabel}>{p.nationName}</Text>
                      <Text style={s.popPct}>{p.percent}%</Text>
                    </View>
                    <View style={s.popTrack}>
                      <View
                        style={[
                          s.popFill,
                          {
                            width: `${p.percent}%`,
                            backgroundColor: POP_COLORS[i % POP_COLORS.length],
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))
              ))}

            {tab === '관광 장소' &&
              (places.length === 0 ? (
                <Text style={s.noteText}>
                  아직 등록된 관광 장소 정보가 없습니다.
                </Text>
              ) : (
                places.map((p, i) => (
                  <View key={`${p.placeName}-${i}`} style={s.placeRow}>
                    {p.imageUrl ? (
                      <Image
                        source={{ uri: toImageUrl(p.imageUrl) }}
                        style={s.placeThumb}
                      />
                    ) : (
                      <View style={s.placeThumb} />
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={s.placeName}>{p.placeName}</Text>
                      <Text style={s.placeMeta}>{p.description}</Text>
                    </View>
                  </View>
                ))
              ))}

            {tab === '대표 음식' &&
              (foods.length === 0 ? (
                <Text style={s.noteText}>
                  아직 등록된 대표 음식 정보가 없습니다.
                </Text>
              ) : (
                <View style={s.foodRow}>
                  {foods.map((f, i) => (
                    <View key={`${f.foodName}-${i}`} style={s.foodItem}>
                      {f.imageUrl ? (
                        <Image
                          source={{ uri: toImageUrl(f.imageUrl) }}
                          style={s.foodThumb}
                        />
                      ) : (
                        <View style={s.foodThumb} />
                      )}
                      <Text style={s.foodName}>{f.foodName}</Text>
                      <Text style={s.foodDesc}>{f.description}</Text>
                    </View>
                  ))}
                </View>
              ))}

            {tab === '현지 에티켓' && (
              <Text style={s.noteText}>준비 중인 정보입니다.</Text>
            )}
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

          {festivals.length === 0 ? (
            <View style={s.card}>
              <Text style={s.noteText}>
                아직 등록된 축제/이벤트 정보가 없습니다.
              </Text>
            </View>
          ) : (
            festivals.slice(0, 3).map((f, i) => (
              <TouchableOpacity
                key={`${f.title}-${i}`}
                style={s.eventCard}
                activeOpacity={0.85}
                onPress={onOpenFestival}
              >
                <View style={s.eventThumb}>
                  {f.imageUrl ? (
                    <Image
                      source={{ uri: toImageUrl(f.imageUrl) }}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 12,
                      }}
                    />
                  ) : (
                    <Text style={s.eventThumbIcon}>🎆</Text>
                  )}
                </View>
                <View style={s.eventBody}>
                  <View style={s.eventTag}>
                    <Text style={s.eventTagText}>{f.category}</Text>
                  </View>
                  <Text style={s.eventTitle}>{f.title}</Text>
                  <Text style={s.eventDesc}>{f.description}</Text>
                  <Text style={s.eventMeta}>
                    🕐 {f.startDate} {f.startTime} 📍 {f.location}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default MainView;
