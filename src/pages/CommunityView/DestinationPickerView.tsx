import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { destinationPickerStyles as s } from './DestinationPickerView.styles';
import { CountryInfo } from '../../entities/main/api';
import { toImageUrl } from '../../shared/api/image';
import { useCountrySearch } from '../../shared/hooks/useCountrySearch';

export interface SelectedDestination {
  countryInfoId: number;
  name: string;
}

interface Props {
  onBack?: () => void;
  onSelect?: (destination: SelectedDestination) => void;
}

const DestinationPickerView: React.FC<Props> = ({ onBack, onSelect }) => {
  const { query, setQuery, loading, filtered } = useCountrySearch();
  const [recent, setRecent] = useState<CountryInfo[]>([]);

  const pick = (country: CountryInfo) => {
    setRecent(prev =>
      [
        country,
        ...prev.filter(r => r.countryInfoId !== country.countryInfoId),
      ].slice(0, 6),
    );
    onSelect?.({
      countryInfoId: country.countryInfoId,
      name: country.cityName,
    });
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="여행지 선택" onBack={onBack} />
      <View style={s.searchWrap}>
        <View style={s.search}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="어디로 여행을 떠나시나요?"
            placeholderTextColor="#aab4be"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        {recent.length > 0 && (
          <>
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>최근 검색</Text>
              <TouchableOpacity onPress={() => setRecent([])}>
                <Text style={s.clearAll}>모두 지우기</Text>
              </TouchableOpacity>
            </View>
            <View style={s.recentRow}>
              {recent.map(r => (
                <View key={r.countryInfoId} style={s.chip}>
                  <TouchableOpacity onPress={() => pick(r)}>
                    <Text style={s.chipText}>{r.cityName}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setRecent(prev =>
                        prev.filter(x => x.countryInfoId !== r.countryInfoId),
                      )
                    }
                  >
                    <Text style={s.chipX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={s.sectionTitle}>여행지 목록</Text>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ color: '#8a93a3', marginBottom: 20 }}>
            등록된 여행지가 없습니다.
          </Text>
        ) : (
          <View style={s.grid}>
            {filtered.map(c => (
              <TouchableOpacity
                key={c.countryInfoId}
                style={s.card}
                activeOpacity={0.85}
                onPress={() => pick(c)}
              >
                <View style={s.cardImg}>
                  {c.imageUrl ? (
                    <Image
                      source={{ uri: toImageUrl(c.imageUrl) }}
                      style={s.cardImgPhoto}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={s.cardFlag}>📍</Text>
                  )}
                </View>
                <Text style={s.cardName}>{c.cityName}</Text>
                <Text style={s.cardCountry}>{c.countryName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DestinationPickerView;
