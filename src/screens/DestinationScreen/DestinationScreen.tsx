import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/constants/colors';
import { destinationStyles as styles } from './DestinationScreen.styles';

const POPULAR = [
  { name: '도쿄', country: '일본', icon: '🗼', bg: '#3a4a66' },
  { name: '방콕', country: '태국', icon: '🛕', bg: '#8a5a3c' },
  { name: '파리', country: '프랑스', icon: '🗼', bg: '#5a6b8c' },
  { name: '다낭', country: '베트남', icon: '🏖', bg: '#3c7a6b' },
];

const DestinationScreen: React.FC = () => {
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
            placeholder="어디로 여행을 떠나시나요?"
            placeholderTextColor={colors.placeholder}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* 최근 검색 */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>최근 검색</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>모두 지우기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipFlag}>🇸🇬</Text>
            <Text style={styles.chipText}>싱가포르</Text>
            <Text style={styles.chipSub}>SGD</Text>
            <Text style={styles.chipClose}>✕</Text>
          </View>
        </View>

        {/* 인기 여행지 */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>인기 여행지</Text>
          </View>
          <View style={styles.grid}>
            {POPULAR.map((d) => (
              <TouchableOpacity
                key={d.name}
                style={[styles.destCard, { backgroundColor: d.bg }]}
                activeOpacity={0.85}
              >
                <View style={styles.destOverlay} />
                <Text style={styles.destIcon}>{d.icon}</Text>
                <View style={styles.destTextWrap}>
                  <Text style={styles.destName}>{d.name}</Text>
                  <Text style={styles.destCountry}>{d.country}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DestinationScreen;
