import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../shared/ui/ScreenHeader';
import { guideResultStyles as s } from './GuideResultView.styles';
import {
  getAnalysisResult,
  saveGuideCameraRecord,
  PhotoAnalysis,
} from '../../entities/guide-camera/api';

interface Props {
  imageId: number;
  photoUri?: string;
  onBack?: () => void;
  /** 기록 저장 완료 확인(Alert) 닫은 후 호출 */
  onSaved?: () => void;
}

const GuideResultView: React.FC<Props> = ({
  imageId,
  photoUri,
  onBack,
  onSaved,
}) => {
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commTitle, setCommTitle] = useState('');
  const [commContent, setCommContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAnalysisResult(imageId)
      .then(setAnalysis)
      .catch((e: any) =>
        setError(e?.message ?? '분석 결과를 불러오지 못했습니다.'),
      )
      .finally(() => setLoading(false));
  }, [imageId]);

  const handleSave = async () => {
    if (!analysis) return;
    try {
      setSaving(true);
      await saveGuideCameraRecord({
        photoId: analysis.photoId,
        commTitle: commTitle.trim() || undefined,
        commContent: commContent.trim() || undefined,
        photoDate: new Date().toISOString().slice(0, 10),
      });
      setSaved(true);
      Alert.alert('완료', '기록이 저장되었습니다.', [
        { text: '확인', onPress: onSaved },
      ]);
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="해설 카메라 결과" onBack={onBack} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={s.photo} resizeMode="cover" />
        ) : null}

        {loading && <ActivityIndicator style={{ marginTop: 24 }} />}

        {!loading && error && <Text style={s.errorText}>{error}</Text>}

        {!loading && analysis && (
          <>
            <View style={s.badgeRow}>
              {analysis.era && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{analysis.era}</Text>
                </View>
              )}
              {analysis.designation && (
                <View style={s.badge}>
                  <Text style={s.badgeText}>{analysis.designation}</Text>
                </View>
              )}
            </View>

            <Text style={s.title}>{analysis.title}</Text>
            <Text style={s.overview}>{analysis.overview}</Text>

            {analysis.background && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>배경</Text>
                <Text style={s.sectionBody}>{analysis.background}</Text>
              </View>
            )}

            {analysis.features && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>특징</Text>
                <Text style={s.sectionBody}>{analysis.features}</Text>
              </View>
            )}

            {analysis.current_status && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>현재 상태</Text>
                <Text style={s.sectionBody}>{analysis.current_status}</Text>
              </View>
            )}

            {analysis.sourceName && (
              <Text style={s.source}>출처: {analysis.sourceName}</Text>
            )}

            <View style={s.recordForm}>
              <Text style={s.label}>기록 제목</Text>
              <TextInput
                style={s.input}
                value={commTitle}
                onChangeText={setCommTitle}
                placeholder="이 순간을 기록해보세요"
                placeholderTextColor="#aab4be"
              />
              <Text style={s.label}>메모</Text>
              <TextInput
                style={[s.input, s.textarea]}
                value={commContent}
                onChangeText={setCommContent}
                placeholder="느낀 점을 자유롭게 남겨보세요"
                placeholderTextColor="#aab4be"
                multiline
              />
              <TouchableOpacity
                style={s.saveBtn}
                activeOpacity={0.85}
                onPress={handleSave}
                disabled={saving || saved}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.saveBtnText}>
                    {saved ? '저장됨' : '기록 저장하기'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GuideResultView;
