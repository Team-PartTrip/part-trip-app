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
  getTourPlaces,
  getFestivals,
  DdayInfo,
  CountryInfo,
  TourPlace,
  Festival,
} from '../../entities/main/api';
import { toImageUrl } from '../../shared/api/image';


const INFO_TABS = ['관광 장소'] as const;
type InfoTab = (typeof INFO_TABS)[number];

interface MainViewProps {
  onOpenFestival?: () => void;
  onOpenDestination?: () => void;
}

const MainView: React.FC<MainViewProps> = ({
  onOpenFestival,
  onOpenDestination,
}) => {
  const [tab, setTab] = useState<InfoTab>('관광 장소');
  const [loading, setLoading] = useState(true);
  const [dday, setDday] = useState<DdayInfo | null>(null);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [places, setPlaces] = useState<TourPlace[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setLoading(true);
        try {
          const d = await getDday();
          if (!alive) return;
          setDday(d);

          const [info, tour, fest] =
            await Promise.all([
              getCountryInfo(d.countryName).catch(() => null),
              getTourPlaces(d.countryName).catch(() => []),
              getFestivals(d.countryName).catch(() => []),
            ]);
          if (!alive) return;
          setCountryInfo(info);
          setPlaces(tour);
          setFestivals(fest);
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
            {places.length === 0 ? (
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
