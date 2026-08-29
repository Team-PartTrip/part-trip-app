import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { commentEditStyles as s } from './CommentEditView.styles';
import {
  getTripCard,
  TimelineItem,
  updateTripCardEntryComment,
} from '../../entities/record/api';
import { toImageUrl } from '../../shared/api/image';

// 서버가 100자까지 받는다
const MAX_LENGTH = 100;

interface Props {
  tripCardId: number;
  /** 여행카드 타임라인의 사진 식별자(entryId) */
  photoId: number;
  mode: 'create' | 'edit';
  onBack?: () => void;
  onSaved?: () => void;
}

/** 촬영 시각을 "2026.08.23 14:20" 으로. 시각이 없는 사진도 있다 */
function formatTakenAt(takenAt: string | null): string {
  if (!takenAt) {
    return '촬영 시각 정보 없음';
  }
  return `${takenAt.slice(0, 10).replace(/-/g, '.')} ${takenAt.slice(11, 16)}`;
}

const CommentEditView: React.FC<Props> = ({
  tripCardId,
  photoId,
  mode,
  onBack,
  onSaved,
}) => {
  const [photo, setPhoto] = useState<TimelineItem | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const editing = mode === 'edit';

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      getTripCard(tripCardId)
        .then(detail => {
          if (!alive) {
            return;
          }
          const found = (detail.timeline ?? []).find(
            item => item.entryId === photoId,
          );
          setPhoto(found ?? null);
          setText(found?.comment ?? '');
        })
        .catch(() => {
          if (alive) {
            setPhoto(null);
          }
        })
        .finally(() => {
          if (alive) {
            setLoading(false);
          }
        });
      return () => {
        alive = false;
      };
    }, [tripCardId, photoId]),
  );

  // 원래 코멘트가 있었는데 비웠으면 지우는 것이다.
  // 서버는 빈 값을 받으면 코멘트를 null 로 바꾼다.
  const clearing = !text.trim() && !!photo?.comment;

  const send = async () => {
    setSaving(true);
    try {
      await updateTripCardEntryComment(tripCardId, photoId, text.trim());
      onSaved?.();
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    if (clearing) {
      Alert.alert('코멘트 삭제', '이 사진의 코멘트를 지울까요?', [
        { text: '취소', style: 'cancel' },
        { text: '지우기', style: 'destructive', onPress: send },
      ]);
      return;
    }
    if (!text.trim()) {
      Alert.alert('알림', '코멘트를 입력해주세요.');
      return;
    }
    send();
  };

  return (
    <SafeAreaView edges={['top']} style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {editing ? '코멘트 수정' : '코멘트 작성'}
        </Text>
        <TouchableOpacity onPress={save} hitSlop={12} disabled={saving}>
          <Text style={s.headerAction}>{editing ? '완료' : '저장'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={s.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <ActivityIndicator style={s.photo} />
          ) : (
            <View style={s.photo}>
              {photo?.imageUrl ? (
                <Image
                  source={{ uri: toImageUrl(photo.imageUrl) }}
                  style={s.photoImage}
                  resizeMode="contain"
                />
              ) : (
                <Text style={s.photoCaption}>사진</Text>
              )}
            </View>
          )}

          <Text style={s.takenAt}>{formatTakenAt(photo?.takenAt ?? null)}</Text>

          <TextInput
            style={[s.input, editing && s.inputEditing]}
            value={text}
            onChangeText={setText}
            placeholder="이 사진에 대한 메모를 남겨보세요"
            placeholderTextColor="#5d6f83"
            maxLength={MAX_LENGTH}
            multiline
            autoFocus={editing}
            textAlignVertical="top"
          />
          <Text style={s.counter}>
            {text.length} / {MAX_LENGTH}
          </Text>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={s.footer}>
          <TouchableOpacity
            style={[
              s.primaryBtn,
              ((!text.trim() && !clearing) || saving) && s.primaryBtnOff,
            ]}
            activeOpacity={0.85}
            disabled={(!text.trim() && !clearing) || saving}
            onPress={save}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.primaryText}>
                {clearing
                  ? '코멘트 지우기'
                  : editing
                  ? '수정 저장'
                  : '코멘트 저장'}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentEditView;
