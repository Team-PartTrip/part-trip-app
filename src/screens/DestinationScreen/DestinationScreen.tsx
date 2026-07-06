import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import colors from '../../assets/constants/colors';
import { destinationStyles as styles } from './DestinationScreen.styles';
import { saveTravelPlan, CountryInfo } from '../../api/main';
import { toImageUrl } from '../../api/image';
import { useCountrySearch } from '../../hooks/useCountrySearch';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

interface DestinationScreenProps {
  onSaved?: () => void;
}

const DestinationScreen: React.FC<DestinationScreenProps> = ({ onSaved }) => {
  const { query, setQuery, loading, filtered } = useCountrySearch();
  const [selected, setSelected] = useState<CountryInfo | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  const closeForm = () => {
    setSelected(null);
    setStartDate('');
    setEndDate('');
  };

  const handleSave = async () => {
    if (!selected) return;
    if (!DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
      Alert.alert('알림', '날짜를 YYYY-MM-DD 형식으로 입력해주세요.');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('알림', '종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }
    try {
      setSaving(true);
      await saveTravelPlan({
        countryName: selected.countryName,
        cityName: selected.cityName,
        startDate,
        endDate,
      });
      closeForm();
      onSaved?.();
    } catch (e: any) {
      Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* 검색 - 스크롤해도 상단에 고정 */}
      <View style={styles.searchBarWrap}>
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
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 여행지 목록 */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionLabel}>여행지 목록</Text>
          </View>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : filtered.length === 0 ? (
            <Text style={{ color: colors.textSub, marginBottom: 20 }}>
              등록된 여행지가 없습니다.
            </Text>
          ) : (
            <View style={styles.grid}>
              {filtered.map(c => (
                <TouchableOpacity
                  key={c.countryInfoId}
                  style={styles.destCard}
                  activeOpacity={0.85}
                  onPress={() => setSelected(c)}
                >
                  <ImageBackground
                    source={{ uri: toImageUrl(c.imageUrl) }}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                    resizeMode="cover"
                  >
                    <View style={styles.destOverlay} />
                    <View style={styles.destTextWrap}>
                      <Text style={styles.destName}>{c.cityName}</Text>
                      <Text style={styles.destCountry}>{c.countryName}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 날짜 입력 모달 */}
      <Modal
        transparent
        animationType="fade"
        visible={!!selected}
        onRequestClose={closeForm}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: 16,
              padding: 20,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '800',
                color: colors.textPrimary,
              }}
            >
              {selected?.cityName} 여행 일정 등록
            </Text>
            <TextInput
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                height: 46,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="시작일 (예: 2026-07-10)"
              placeholderTextColor={colors.placeholder}
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={{
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 12,
                paddingHorizontal: 14,
                height: 46,
                fontSize: 15,
                color: colors.textPrimary,
              }}
              placeholder="종료일 (예: 2026-07-15)"
              placeholderTextColor={colors.placeholder}
              value={endDate}
              onChangeText={setEndDate}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={closeForm}
                disabled={saving}
              >
                <Text style={{ color: colors.textSub, fontWeight: '700' }}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700' }}>
                    등록하기
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DestinationScreen;
