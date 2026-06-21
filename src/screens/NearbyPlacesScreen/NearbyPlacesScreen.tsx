import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/constants/colors';
import { nearbyStyles as styles } from './NearbyPlacesScreen.styles';

const PLACES = [
  { name: 'cowLikeSome', rating: 4.8, category: '한식 · 소고기구이', hours: '12:00 ~ 23:00', distance: '250m', icon: '🥩' },
  { name: 'Goodi', rating: 4.2, category: '중식 · 짜장면/짬뽕', hours: '12:00 ~ 23:00', distance: '600m', icon: '🍜' },
  { name: '유가매운탕', rating: 4.5, category: '탕/찌개 · 매운탕', hours: '12:00 ~ 23:00', distance: '1.2km', icon: '🍲' },
  { name: '전비빔', rating: 4.5, category: '비빔밥 · 야채', hours: '12:00 ~ 23:00', distance: '1.2km', icon: '🍚' },
];

const NearbyPlacesScreen: React.FC = () => {
  const [query, setQuery] = useState('');

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
          <Text style={styles.sectionCount}>{PLACES.length}곳</Text>
        </View>

        {PLACES.map((p) => (
          <View key={p.name} style={styles.placeCard}>
            <View style={styles.placeThumb}>
              <Text style={styles.placeThumbIcon}>{p.icon}</Text>
            </View>
            <View style={styles.placeBody}>
              <View style={styles.placeNameRow}>
                <Text style={styles.placeName}>{p.name}</Text>
                <Text style={styles.placeRating}>★ {p.rating}</Text>
              </View>
              <Text style={styles.placeCategory}>{p.category}</Text>
              <Text style={styles.placeHours}>{p.hours}</Text>
              <View style={styles.placeBottomRow}>
                <Text style={styles.placeDistance}>📍 {p.distance}</Text>
                <TouchableOpacity style={styles.directionsBtn} activeOpacity={0.8}>
                  <Text style={styles.directionsBtnText}>길찾기</Text>
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
