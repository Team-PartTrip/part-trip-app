import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { destinationPickerStyles as s } from './DestinationPickerView.styles';

const POPULAR = [
  { name: '도쿄', country: '일본', flag: '🇯🇵' },
  { name: '방콕', country: '태국', flag: '🇹🇭' },
  { name: '파리', country: '프랑스', flag: '🇫🇷' },
  { name: '다낭', country: '베트남', flag: '🇻🇳' },
];

interface Props {
  onBack?: () => void;
  onSelect?: (name: string) => void;
}

const DestinationPickerView: React.FC<Props> = ({ onBack, onSelect }) => {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>(['싱가포르']);
  const filtered = POPULAR.filter(
    p => !query.trim() || p.name.includes(query) || p.country.includes(query),
  );
  const pick = (name: string) => {
    setRecent(prev => [name, ...prev.filter(r => r !== name)].slice(0, 6));
    onSelect?.(name);
  };
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="여행지 선택" onBack={onBack} />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.search}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="어디로 여행을 떠나시나요?"
            placeholderTextColor="#aab4be"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => query.trim() && pick(query.trim())}
          />
        </View>
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
                <View key={r} style={s.chip}>
                  <TouchableOpacity onPress={() => pick(r)}>
                    <Text style={s.chipText}>{r}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setRecent(prev => prev.filter(x => x !== r))}
                  >
                    <Text style={s.chipX}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
        <Text style={s.sectionTitle}>인기 여행지</Text>
        <View style={s.grid}>
          {filtered.map(p => (
            <TouchableOpacity
              key={p.name}
              style={s.card}
              activeOpacity={0.85}
              onPress={() => pick(p.name)}
            >
              <View style={s.cardImg}>
                <Text style={s.cardFlag}>{p.flag}</Text>
              </View>
              <Text style={s.cardName}>{p.name}</Text>
              <Text style={s.cardCountry}>{p.country}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DestinationPickerView;
