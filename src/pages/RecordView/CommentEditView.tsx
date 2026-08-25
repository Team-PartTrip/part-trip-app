import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commentEditStyles as s } from './CommentEditView.styles';
import {
  samplePhotoOf,
  sampleRevisionsOf,
} from '../../entities/record/sampleData';
import {
  formatDateTime,
  formatShortDate,
} from '../../entities/record/types';

const MAX_LENGTH = 500;

interface Props {
  photoId: number;
  mode: 'create' | 'edit';
  onBack?: () => void;
  onSaved?: () => void;
}

const CommentEditView: React.FC<Props> = ({
  photoId,
  mode,
  onBack,
  onSaved,
}) => {
  const photo = samplePhotoOf(photoId);
  const editing = mode === 'edit';
  const [text, setText] = useState(editing ? photo.commContent : '');

  const revisions = sampleRevisionsOf(photo);

  const save = () => {
    if (!text.trim()) {
      Alert.alert('알림', '코멘트를 입력해주세요.');
      return;
    }
    // 코멘트 저장 API(/api/records/{id}/comments)가 붙으면 여기서 호출한다
    onSaved?.();
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
        <TouchableOpacity onPress={save} hitSlop={12}>
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
          <View style={s.photo}>
            <Text style={s.photoCaption}>{photo.commTitle}</Text>
          </View>

          <View style={s.titleRow}>
            <Text style={s.title}>{photo.commTitle}</Text>
            {editing && !!photo.commentUpdatedAt && (
              <View style={s.editedPill}>
                <Text style={s.editedPillText}>
                  {formatShortDate(photo.commentUpdatedAt.slice(0, 10))} 수정됨
                </Text>
              </View>
            )}
          </View>
          {!editing && (
            <Text style={s.takenAt}>{formatDateTime(photo.takenAt)}</Text>
          )}

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

          {editing ? (
            <>
              <Text style={s.label}>수정 이력</Text>
              {revisions.map((item, i) => (
                <View key={item.photoCommentHistoryId} style={s.revision}>
                  <View
                    style={[
                      s.revisionDot,
                      i === revisions.length - 1
                        ? s.revisionDotLatest
                        : s.revisionDotFirst,
                    ]}
                  />
                  <Text style={s.revisionLabel}>
                    {item.revision === 0 ? '최초 작성' : `${item.revision}차 수정`}
                  </Text>
                  <Text style={s.revisionAt}>
                    {formatDateTime(item.createdAt)}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={s.label}>태그</Text>
              <View style={s.tagRow}>
                {photo.tags.map(tag => (
                  <View key={tag} style={s.tag}>
                    <Text style={s.tagText}>#{tag}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={s.tagAdd}
                  activeOpacity={0.85}
                  onPress={() =>
                    // 태그 목록 API 가 없어서 아직 고를 수 있는 후보가 없다
                    Alert.alert(
                      '태그 추가',
                      '태그 API가 연결되면 직접 고를 수 있어요.',
                    )
                  }
                >
                  <Text style={s.tagAddText}>+</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={s.footer}>
          <TouchableOpacity
            style={[s.primaryBtn, !text.trim() && s.primaryBtnOff]}
            activeOpacity={0.85}
            disabled={!text.trim()}
            onPress={save}
          >
            <Text style={s.primaryText}>
              {editing ? '수정 저장' : '코멘트 저장'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CommentEditView;
