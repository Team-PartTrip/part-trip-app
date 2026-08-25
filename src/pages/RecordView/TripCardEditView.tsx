import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tripCardEditStyles as s } from './TripCardEditView.styles';
import { sampleTripCardOf } from '../../entities/record/sampleData';
import { formatDotDate } from '../../entities/record/types';

const MAX_LENGTH = 100;
// 좌우 여백 24 · 칸 간격 12 를 빼고 세 칸으로 나눈 크기
const CELL = (Dimensions.get('window').width - 24 * 2 - 12 * 2) / 3;
// 갤러리 연동 전이라 고를 수 있는 자리만 만들어 둔다
const GALLERY_SLOTS = [0, 1, 2, 3, 4, 5];

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onSaved?: () => void;
}

const TripCardEditView: React.FC<Props> = ({
  tripCardId,
  onBack,
  onSaved,
}) => {
  const card = sampleTripCardOf(tripCardId);
  const [picked, setPicked] = useState<number[]>([]);
  const [comment, setComment] = useState('');

  const toggle = (slot: number) =>
    setPicked(prev =>
      prev.includes(slot)
        ? prev.filter(item => item !== slot)
        : [...prev, slot],
    );

  return (
    <View style={s.safeArea}>
      <KeyboardAvoidingView
        style={s.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView edges={['top']}>
            <TouchableOpacity onPress={onBack} hitSlop={12}>
              <Text style={s.back}>‹</Text>
            </TouchableOpacity>
            <Text style={s.title}>사진 · 코멘트 추가</Text>
            <Text style={s.desc}>
              여행 카드는 여행 시작과 함께 자동으로 만들어져요
            </Text>
            <View style={s.tripBar}>
              <Text style={s.tripBarText}>
                {card.title}  ·  {formatDotDate(card.startDate)} 시작
              </Text>
            </View>
          </SafeAreaView>

          <Text style={s.label}>사진 선택</Text>
          <View style={s.grid}>
            {GALLERY_SLOTS.map(slot => {
              const on = picked.includes(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[s.cell, { width: CELL, height: CELL }]}
                  activeOpacity={0.85}
                  onPress={() => toggle(slot)}
                >
                  <View style={[s.check, on ? s.checkOn : s.checkOff]}>
                    {on && <Text style={s.checkText}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={s.label}>코멘트</Text>
          <View style={s.commentBox}>
            <TextInput
              style={s.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="이 사진에 대해 짧게 남겨보세요"
              placeholderTextColor="#9aa7b4"
              maxLength={MAX_LENGTH}
              multiline
              textAlignVertical="top"
            />
            <Text style={s.counter}>
              {comment.length} / {MAX_LENGTH}
            </Text>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={s.footer}>
          <TouchableOpacity
            style={[s.primaryBtn, picked.length === 0 && s.primaryBtnOff]}
            activeOpacity={0.85}
            disabled={picked.length === 0}
            onPress={onSaved}
          >
            <Text style={s.primaryText}>여행 카드에 담기</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TripCardEditView;
