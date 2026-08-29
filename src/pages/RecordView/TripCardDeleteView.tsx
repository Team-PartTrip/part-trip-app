import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { tripCardDeleteStyles as s } from './TripCardDeleteView.styles';
import {
  deleteTripCards,
  getTripCards,
  TripCardSummary,
} from '../../entities/record/api';
import { formatTripRange } from '../../entities/record/types';

interface Props {
  onBack?: () => void;
  onDeleted?: () => void;
}

const TripCardDeleteView: React.FC<Props> = ({ onBack, onDeleted }) => {
  const [cards, setCards] = useState<TripCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [sending, setSending] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getTripCards()
        .then(list => alive && setCards(list))
        .catch(() => alive && setCards([]))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, []),
  );

  const allSelected = cards.length > 0 && selected.length === cards.length;

  const toggle = (cardId: number) =>
    setSelected(prev =>
      prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId],
    );

  const remove = async () => {
    try {
      setSending(true);
      await deleteTripCards(selected);
      onDeleted?.();
    } catch (e: any) {
      Alert.alert('삭제 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  const confirm = () =>
    Alert.alert(
      '여행 카드 삭제',
      `${selected.length}개를 삭제할까요? 담긴 사진과 코멘트도 함께 지워져요.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: remove,
        },
      ],
    );

  return (
    <SafeAreaView edges={['top']} style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.headerSide}>취소</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{selected.length}개 선택됨</Text>
        <TouchableOpacity
          hitSlop={12}
          onPress={() =>
            setSelected(allSelected ? [] : cards.map(card => card.cardId))
          }
        >
          <Text style={[s.headerSide, s.headerSideOn]}>
            {allSelected ? '해제' : '전체'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : cards.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>지울 여행 카드가 없어요.</Text>
          </View>
        ) : (
          cards.map(card => {
            const on = selected.includes(card.cardId);
            return (
              <TouchableOpacity
                key={card.cardId}
                style={[s.row, on && s.rowOn]}
                activeOpacity={0.85}
                onPress={() => toggle(card.cardId)}
              >
                <View style={s.thumb}>
                  <Text style={s.thumbText}>IMG</Text>
                </View>
                <View style={s.body}>
                  <Text style={s.title}>
                    {card.countryName} {card.cityName}
                  </Text>
                  <Text style={s.meta}>
                    {formatTripRange(card.startDate, card.endDate)}  ·  사진{' '}
                    {card.photoCount ?? 0}장
                  </Text>
                </View>
                <View style={[s.check, on ? s.checkOn : s.checkOff]}>
                  {on && <Text style={s.checkText}>✓</Text>}
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={s.warning}>
          <Text style={s.warningTitle}>삭제하면 되돌릴 수 없어요</Text>
          <Text style={s.warningDesc}>
            카드에 담긴 사진과 코멘트가 함께 삭제됩니다
          </Text>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.dangerBtn, selected.length === 0 && s.dangerBtnOff]}
          activeOpacity={0.85}
          disabled={selected.length === 0 || sending}
          onPress={confirm}
        >
          <Text style={s.dangerText}>{selected.length}개 삭제하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.cancelBtn}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Text style={s.cancelText}>취소</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default TripCardDeleteView;
