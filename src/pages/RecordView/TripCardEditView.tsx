import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { tripCardEditStyles as s } from './TripCardEditView.styles';
import {
  addTripCardEntry,
  getTripCards,
  PickedPhoto,
  TripCardSummary,
} from '../../entities/record/api';
import { formatDotDate } from '../../entities/record/types';

const MAX_LENGTH = 100;
// 좌우 여백 24 · 칸 간격 12 를 빼고 세 칸으로 나눈 크기
const CELL = (Dimensions.get('window').width - 24 * 2 - 12 * 2) / 3;
// 한 번에 올릴 수 있는 장수. 서버는 한 장씩 받으므로 순서대로 보낸다.
const MAX_PHOTOS = 9;

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onSaved?: () => void;
}

const TripCardEditView: React.FC<Props> = ({ tripCardId, onBack, onSaved }) => {
  const [card, setCard] = useState<TripCardSummary | null>(null);
  const [picked, setPicked] = useState<PickedPhoto[]>([]);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getTripCards()
        .then(cards => {
          if (alive) {
            setCard(cards.find(item => item.cardId === tripCardId) ?? null);
          }
        })
        .catch(() => {});
      return () => {
        alive = false;
      };
    }, [tripCardId]),
  );

  const pickPhotos = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_PHOTOS - picked.length,
    });
    if (result.didCancel || !result.assets?.length) {
      return;
    }
    const added = result.assets
      .filter(asset => asset.uri)
      .map((asset, index) => ({
        uri: asset.uri!,
        fileName: asset.fileName ?? `photo-${Date.now()}-${index}.jpg`,
        mimeType: asset.type ?? 'image/jpeg',
      }));
    // 같은 사진을 두 번 고를 수 있다. uri 를 식별자로 쓰는 곳이
    // 여럿(목록 key · 낱장 제거 · 업로드 후 제거)이라 여기서 한 번에 막는다.
    setPicked(prev => {
      const seen = new Set(prev.map(photo => photo.uri));
      const fresh: PickedPhoto[] = [];
      for (const photo of added) {
        // 한 번에 고른 목록 안에도 같은 사진이 들어올 수 있어 담으면서 센다
        if (!seen.has(photo.uri)) {
          seen.add(photo.uri);
          fresh.push(photo);
        }
      }
      return [...prev, ...fresh].slice(0, MAX_PHOTOS);
    });
  };

  const remove = (uri: string) =>
    setPicked(prev => prev.filter(photo => photo.uri !== uri));

  const save = async () => {
    setSaving(true);
    try {
      // 서버는 한 장씩 받는다. 고른 순서대로 올린다.
      // 중간에 실패하면 올라간 사진은 목록에서 빼야 한다.
      // 안 그러면 다시 누를 때 앞의 사진이 한 번 더 올라간다.
      for (const photo of picked) {
        await addTripCardEntry(tripCardId, photo, comment.trim() || undefined);
        setPicked(prev => prev.filter(item => item.uri !== photo.uri));
      }
      onSaved?.();
    } catch (e: any) {
      Alert.alert('사진 추가 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const title = card ? `${card.countryName} ${card.cityName}` : '여행';

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
            {card && (
              <View style={s.tripBar}>
                <Text style={s.tripBarText}>
                  {title}  ·  {formatDotDate(card.startDate)} 시작
                </Text>
              </View>
            )}
          </SafeAreaView>

          <Text style={s.label}>사진 선택</Text>
          <View style={s.grid}>
            {picked.map(photo => (
              <TouchableOpacity
                key={photo.uri}
                style={[s.cell, { width: CELL, height: CELL }]}
                activeOpacity={0.85}
                onPress={() => remove(photo.uri)}
              >
                <Image source={{ uri: photo.uri }} style={s.thumb} />
                <View style={[s.check, s.checkOn]}>
                  <Text style={s.checkText}>✓</Text>
                </View>
              </TouchableOpacity>
            ))}
            {picked.length < MAX_PHOTOS && (
              <TouchableOpacity
                style={[s.cell, { width: CELL, height: CELL }]}
                activeOpacity={0.85}
                onPress={pickPhotos}
              >
                <Text style={s.addCell}>＋</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={s.hint}>
            {picked.length === 0
              ? '갤러리에서 직접 찍은 사진을 골라주세요'
              : '사진을 누르면 목록에서 빠져요'}
          </Text>

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
            style={[
              s.primaryBtn,
              (picked.length === 0 || saving) && s.primaryBtnOff,
            ]}
            activeOpacity={0.85}
            disabled={picked.length === 0 || saving}
            onPress={save}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.primaryText}>
                여행 카드에 담기{picked.length > 0 ? ` (${picked.length})` : ''}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TripCardEditView;
