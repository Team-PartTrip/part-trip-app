import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import colors from '../../shared/tokens/colors';
import { nearbyStyles as styles } from './NearbyPlacesScreen.styles';
import {
  getNearbyRecommendations,
  createGuideCameraMission,
  NearbyPlaceRecommendation,
} from '../../entities/guide-camera/api';
import { getCurrentLocation } from '../../shared/lib/getCurrentLocation';

const NearbyPlacesScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<NearbyPlaceRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingMission, setAddingMission] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        const list = await getNearbyRecommendations(latitude, longitude);
        setPlaces(list);
      } catch (e: any) {
        setError(e?.message ?? '주변 명소를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = places.filter(
    p => !query.trim() || p.name.includes(query),
  );

  const handleAddMission = async (place: NearbyPlaceRecommendation) => {
    try {
      setAddingMission(place.name);
      await createGuideCameraMission({
        targetPlaceName: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
      });
      Alert.alert('완료', '미션이 추가되었습니다.');
    } catch (e: any) {
      Alert.alert('추가 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setAddingMission(null);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 검색 */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="장소, 명소 검색..."
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* 가까운 장소 */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>가까운 장소</Text>
          <Text style={styles.sectionCount}>{filtered.length}곳</Text>
        </View>

        {loading && <ActivityIndicator style={{ marginTop: 24 }} />}

        {!loading && error && (
          <Text
            style={{ color: colors.textSub, textAlign: 'center', marginTop: 12 }}
          >
            {error}
          </Text>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Text
            style={{ color: colors.textSub, textAlign: 'center', marginTop: 12 }}
          >
            추천할 만한 주변 명소가 없습니다.
          </Text>
        )}

        {filtered.map((p, i) => (
          <View key={`${p.name}-${i}`} style={styles.placeCard}>
            <View style={styles.placeThumb}>
              <Text style={styles.placeThumbIcon}>📍</Text>
            </View>
            <View style={styles.placeBody}>
              <View style={styles.placeNameRow}>
                <Text style={styles.placeName}>{p.name}</Text>
              </View>
              <Text style={styles.placeCategory} numberOfLines={2}>
                {p.description}
              </Text>
              <View style={styles.placeBottomRow}>
                <Text style={styles.placeDistance}>
                  📍 {p.distanceMeters}m
                </Text>
                <TouchableOpacity
                  style={styles.directionsBtn}
                  activeOpacity={0.8}
                  onPress={() => handleAddMission(p)}
                  disabled={addingMission === p.name}
                >
                  {addingMission === p.name ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={styles.directionsBtnText}>미션 추가</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default NearbyPlacesScreen;
