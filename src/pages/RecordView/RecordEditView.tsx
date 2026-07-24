import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { recordEditStyles as s } from './RecordEditView.styles';

interface Props {
  onBack?: () => void;
  onDone?: () => void;
}

const RecordEditView: React.FC<Props> = ({ onBack, onDone }) => {
  const [title, setTitle] = useState('싱가포르의 라이트쇼');
  const [body, setBody] = useState(
    '싱가포르에 왔으면 슈퍼트리는 필수라길래, 저녁 먹고 바로 가든스 바이 더 베이로 향했다.\n\n낮에 봐도 압도적이더라니, 역시 진짜는 밤이었다. 7시 45분, 음악이 깔리고 시작하면서 슈퍼트리 전체에 빛이 쏟아졌다.',
  );
  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="기록 수정" onBack={onBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.imageWrap}>
            <View style={s.image} />
            <TouchableOpacity style={s.addPhoto} activeOpacity={0.85}>
              <Text style={s.addPhotoIcon}>＋</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.meta}>오후 19:40 · 2024.05.12</Text>
          <TextInput
            style={s.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="제목"
            placeholderTextColor="#aab4be"
          />
          <TextInput
            style={s.bodyInput}
            value={body}
            onChangeText={setBody}
            placeholder="여행 기록을 남겨보세요."
            placeholderTextColor="#aab4be"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.fBtn, s.primary]}
          activeOpacity={0.85}
          onPress={onDone}
        >
          <Text style={s.primaryText}>완료</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.fBtn, s.ghost]}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Text style={s.ghostText}>취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RecordEditView;
