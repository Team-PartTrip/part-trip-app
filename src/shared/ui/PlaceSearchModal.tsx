import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlaceResult, searchPlaces } from '../../entities/main/api';
import colors from '../tokens/colors';
import { ChevronLeftIcon, PinIcon } from './icons';
import VoiceButton, { voiceStyles } from './VoiceButton';

interface Props {
  visible: boolean;
  title: string;
  placeholder?: string;
  onSelect: (place: PlaceResult) => void;
  onClose: () => void;
}

const PlaceSearchModal: React.FC<Props> = ({
  visible,
  title,
  placeholder = '예) 동대구역, ○○아파트',
  onSelect,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visible) {
      setQuery('');
      setResults(null);
    }
  }, [visible]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      return;
    }
    let alive = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setFailed(false);
      searchPlaces(q)
        .then(found => alive && setResults(found))
        .catch(() => {
          if (alive) {
            setResults(null);
            setFailed(true);
          }
        })
        .finally(() => alive && setLoading(false));
    }, 400);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={st.safe} edges={['top', 'bottom']}>
        <View style={st.header}>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="닫기"
          >
            <ChevronLeftIcon size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={st.title}>{title}</Text>
        </View>
        <View style={[voiceStyles.row, st.inputRow]}>
          <TextInput
            style={[st.input, voiceStyles.input]}
            value={query}
            onChangeText={setQuery}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            autoFocus
            returnKeyType="search"
            maxLength={50}
          />
          <VoiceButton onText={setQuery} />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          {loading && <ActivityIndicator style={st.loading} />}
          {!loading && failed && (
            <Text style={st.empty}>
              검색이 잠시 안 돼요. 조금 뒤에 다시 찾아보세요.
            </Text>
          )}
          {!loading && results?.length === 0 && (
            <Text style={st.empty}>
              찾는 곳이 없어요. 다른 이름으로 찾아보세요.
            </Text>
          )}
          {results?.map((place, i) => (
            <TouchableOpacity
              key={`${place.name}-${i}`}
              style={st.row}
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={() => onSelect(place)}
            >
              <PinIcon size={20} color={colors.primary} />
              <View style={st.rowBody}>
                <Text style={st.name}>{place.name}</Text>
                {!!place.address && (
                  <Text style={st.address}>{place.address}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  inputRow: { marginHorizontal: 24, marginBottom: 8 },
  input: {
    minHeight: 52,
    paddingHorizontal: 16,
    fontSize: 17,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    color: colors.text,
  },
  loading: { marginTop: 24 },
  empty: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 15,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowBody: { flex: 1 },
  name: { fontSize: 17, fontWeight: '600', color: colors.text },
  address: { marginTop: 2, fontSize: 14, color: colors.textSecondary },
});

export default PlaceSearchModal;
