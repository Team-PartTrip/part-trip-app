import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import colors from '../../assets/constants/colors';
import { festivalStyles as styles } from './FestivalScreen.styles';
import { getDday, getFestivals, Festival } from '../../api/main';
import { toImageUrl } from '../../api/image';

const FestivalScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState<string | null>(null);
  const [festivals, setFestivals] = useState<Festival[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await getDday();
        setCountryName(d.countryName);
        const list = await getFestivals(d.countryName).catch(() => []);
        setFestivals(list);
      } catch {
        setCountryName(null);
        setFestivals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.yearRow}>
          <Text style={styles.yearText}>
            {countryName ? `${countryName} 축제/이벤트` : '축제/이벤트'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : !countryName ? (
          <Text style={{ color: colors.textSub }}>
            등록된 여행 일정이 없어 축제 정보를 불러올 수 없습니다.
          </Text>
        ) : festivals.length === 0 ? (
          <Text style={{ color: colors.textSub }}>
            아직 등록된 축제/이벤트 정보가 없습니다.
          </Text>
        ) : (
          festivals.map(e => (
            <TouchableOpacity
              key={e.title}
              style={styles.eventCard}
              activeOpacity={0.85}
            >
              <View style={styles.eventThumb}>
                {e.imageUrl ? (
                  <Image
                    source={{ uri: toImageUrl(e.imageUrl) }}
                    style={{ width: '100%', height: '100%', borderRadius: 12 }}
                  />
                ) : (
                  <Text style={styles.eventThumbIcon}>🎆</Text>
                )}
              </View>
              <View style={styles.eventBody}>
                <View
                  style={[
                    styles.eventTag,
                    { backgroundColor: colors.tagRedBg },
                  ]}
                >
                  <Text
                    style={[styles.eventTagText, { color: colors.redAccent }]}
                  >
                    {e.category}
                  </Text>
                </View>
                <Text style={styles.eventTitle}>{e.title}</Text>
                <Text style={styles.eventDesc}>{e.description}</Text>
                <View style={styles.eventMetaRow}>
                  <Text style={styles.eventMeta}>
                    🕐 {e.startDate} {e.startTime}
                  </Text>
                  <Text style={styles.eventMeta}>📍 {e.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FestivalScreen;
