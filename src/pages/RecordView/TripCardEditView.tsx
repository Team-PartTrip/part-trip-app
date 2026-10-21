import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput } from '../../shared/ui/Text';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import CameraCapture, { CaptureInfo } from '../../shared/ui/CameraCapture';
import { tripCardEditStyles as s } from './TripCardEditView.styles';
import {
  addTripCardEntry,
  getTripCards,
  isTripEnded,
  normalizePhoto,
  placeOf,
  PickedPhoto,
  updateTripCardEntryMetadata,
  TripCardSummary,
  TRIP_ENDED_NOTICE,
} from '../../entities/record/api';
import { formatDotDate } from '../../entities/record/types';
import {
  CameraIcon,
  ChevronLeftIcon,
  CloseIcon,
  PlusIcon,
} from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';

const MAX_LENGTH = 100;
// 좌우 여백 24 · 칸 간격 12 를 빼고 세 칸으로 나눈 크기
const CELL = (Dimensions.get('window').width - 24 * 2 - 12 * 2) / 3;
// 한 번에 올릴 수 있는 장수. 서버는 한 장씩 받으므로 순서대로 보낸다.
const MAX_PHOTOS = 9;

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onSaved?: (unlocatedEntryId?: number) => void;
}

const TripCardEditView: React.FC<Props> = ({ tripCardId, onBack, onSaved }) => {
  const [card, setCard] = useState<TripCardSummary | null>(null);
  const [picked, setPicked] = useState<PickedPhoto[]>([]);
  const [commentFor, setCommentFor] = useState({ uri: '', text: '' });
  const commentUri = picked.length === 1 ? picked[0].uri : '';
  const comment =
    commentFor.uri === commentUri || (commentFor.uri === '' && !!commentUri)
      ? commentFor.text
      : '';
  const setComment = (text: string) => setCommentFor({ uri: commentUri, text });
  const [saving, setSaving] = useState(false);
  const [uploadingUri, setUploadingUri] = useState<string | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [viewing, setViewing] = useState<string | null>(null);
  const [shooting, setShooting] = useState(false);

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
      assetRepresentationMode: 'compatible',
    });
    if (result.didCancel || !result.assets?.length) {
      return;
    }
    const isHeic = (type?: string, name?: string) =>
      /hei[cf]/i.test(type ?? '') || /\.hei[cf]$/i.test(name ?? '');
    const usable = result.assets.filter(
      asset => asset.uri && !isHeic(asset.type, asset.fileName),
    );
    if (usable.length < result.assets.length) {
      Alert.alert(
        '올릴 수 없는 사진이 있어요',
        'HEIC 형식 사진은 빠졌어요. 다른 사진을 골라 주세요.',
      );
    }
    addPhotos(
      usable.map((asset, index) =>
        normalizePhoto(
          { uri: asset.uri!, fileName: asset.fileName, type: asset.type },
          `photo-${Date.now()}-${index}`,
        ),
      ),
    );
  };

  const addPhotos = (added: PickedPhoto[]) => {
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

  const onShot = (uri: string, shot: CaptureInfo) => {
    setShooting(false);
    if (!uri) {
      Alert.alert('사진을 찍지 못했어요', '잠시 후 다시 시도해주세요.');
      return;
    }
    addPhotos([
      {
        ...normalizePhoto(
          { uri, fileName: `camera-${Date.now()}.jpg`, type: 'image/jpeg' },
          `camera-${Date.now()}`,
        ),
        ...shot,
      },
    ]);
  };

  const remove = (uri: string) =>
    setPicked(prev => prev.filter(photo => photo.uri !== uri));

  const confirmRemove = (uri: string) =>
    Alert.alert('사진 삭제', '이 사진을 목록에서 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => remove(uri) },
    ]);

  const save = async () => {
    setSaving(true);
    setProgress({ done: 0, total: picked.length });
    try {
      // 서버는 한 장씩 받는다. 고른 순서대로 올린다.
      // 중간에 실패하면 올라간 사진은 목록에서 빼야 한다.
      // 안 그러면 다시 누를 때 앞의 사진이 한 번 더 올라간다.
      // 코멘트는 한 장만 고를 때 받는다. 여러 장에 같은 글이 붙지 않게
      const note =
        picked.length === 1 ? comment.trim() || undefined : undefined;
      let unlocated: number | undefined;
      for (const photo of picked) {
        setUploadingUri(photo.uri);
        const entry = await addTripCardEntry(tripCardId, photo, note);
        let located = entry?.latitude != null && entry?.longitude != null;
        if (entry && !located && photo.latitude != null) {
          const place = {
            latitude: photo.latitude,
            longitude: photo.longitude,
            fromCamera: true,
          };
          const takenAt =
            entry.takenAt == null && photo.capturedAt
              ? { takenAt: photo.capturedAt }
              : {};
          try {
            await updateTripCardEntryMetadata(tripCardId, entry.entryId, {
              ...place,
              ...takenAt,
            });
            located = true;
          } catch {
            try {
              await updateTripCardEntryMetadata(
                tripCardId,
                entry.entryId,
                place,
              );
              located = true;
            } catch {}
          }
        } else if (entry && entry.takenAt == null && photo.capturedAt) {
          try {
            await updateTripCardEntryMetadata(tripCardId, entry.entryId, {
              takenAt: photo.capturedAt,
              fromCamera: true,
            });
          } catch {}
        }
        if (unlocated === undefined && entry && !located) {
          unlocated = entry.entryId;
        }
        setPicked(prev => prev.filter(item => item.uri !== photo.uri));
        setProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
      onSaved?.(unlocated);
    } catch (e: any) {
      Alert.alert('사진 추가 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setUploadingUri(null);
      setSaving(false);
    }
  };

  const title = card ? placeOf(card) : '여행';

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']} style={s.topBar}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
        >
          <View style={s.back}>
            <ChevronLeftIcon size={22} color={colors.text} />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
      <KeyboardAvoidingView
        style={s.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.title}>사진 · 코멘트 추가</Text>
          <Text style={s.desc}>
            여행카드는 여행 시작과 함께 자동으로 만들어져요
          </Text>
          {isTripEnded(card) && (
            <Text style={s.endedNote}>{TRIP_ENDED_NOTICE}</Text>
          )}
          {card && (
            <View style={s.tripBar}>
              <Text style={s.tripBarText}>
                {title} · {formatDotDate(card.startDate)} 시작
              </Text>
            </View>
          )}

          <Text style={s.label}>사진 선택</Text>
          <View style={s.grid}>
            {picked.map(photo => (
              <View
                key={photo.uri}
                style={[s.cell, { width: CELL, height: CELL }]}
              >
                <TouchableOpacity
                  style={s.thumb}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="사진 크게 보기"
                  onPress={() => setViewing(photo.uri)}
                >
                  <Image source={{ uri: photo.uri }} style={s.thumb} />
                </TouchableOpacity>
                {saving && (
                  <View style={s.uploadMask} pointerEvents="none">
                    {photo.uri === uploadingUri ? (
                      <>
                        <ActivityIndicator color={colors.textOnPrimary} />
                        <Text style={s.uploadText}>업로드 중</Text>
                      </>
                    ) : (
                      <Text style={s.uploadText}>대기 중</Text>
                    )}
                  </View>
                )}
                {!saving && (
                  <TouchableOpacity
                    style={[s.check, s.checkOn]}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="사진 빼기"
                    onPress={() => confirmRemove(photo.uri)}
                  >
                    <CloseIcon size={13} color={colors.textOnPrimary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {picked.length < MAX_PHOTOS && !saving && (
              <>
                <TouchableOpacity
                  style={[s.cell, { width: CELL, height: CELL }]}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="앨범에서 고르기"
                  onPress={pickPhotos}
                >
                  <View style={s.addCell}>
                    <PlusIcon size={28} color={colors.textMuted} />
                    <Text style={s.addLabel}>앨범</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.cell, { width: CELL, height: CELL }]}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="사진 찍기"
                  onPress={() => setShooting(true)}
                >
                  <View style={s.addCell}>
                    <CameraIcon size={28} color={colors.textMuted} />
                    <Text style={s.addLabel}>촬영</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={s.hint}>
            {picked.length === 0
              ? '앨범에서 직접 찍은 사진을 고르거나 바로 찍어주세요'
              : '사진을 누르면 크게 보고, X 를 누르면 목록에서 삭제돼요'}
          </Text>

          <Text style={s.label}>코멘트</Text>
          {picked.length > 1 ? (
            <Text style={s.commentNote}>
              여러 장을 고르면 코멘트는 사진마다 따로 남겨요. 담은 뒤 사진을
              눌러 적어주세요.
            </Text>
          ) : (
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
          )}
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={s.footer}>
          <TouchableOpacity
            style={[
              s.primaryBtn,
              (picked.length === 0 || saving || isTripEnded(card)) &&
                s.primaryBtnOff,
            ]}
            activeOpacity={0.85}
            disabled={picked.length === 0 || saving || isTripEnded(card)}
            onPress={save}
          >
            {saving ? (
              <View style={s.savingRow}>
                <ActivityIndicator color="#fff" />
                <Text style={s.primaryText}>
                  업로드 중 ({Math.min(progress.done + 1, progress.total)}/
                  {progress.total})
                </Text>
              </View>
            ) : (
              <Text style={s.primaryText}>
                여행카드에 담기{picked.length > 0 ? ` (${picked.length})` : ''}
              </Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal
        visible={shooting}
        animationType="slide"
        onRequestClose={() => setShooting(false)}
      >
        <SafeAreaProvider>
          <CameraCapture
            title="사진 찍기"
            onClose={() => setShooting(false)}
            onCapture={onShot}
          />
        </SafeAreaProvider>
      </Modal>

      <Modal
        visible={viewing !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewing(null)}
      >
        <View style={s.viewer}>
          {viewing && (
            <Image
              source={{ uri: viewing }}
              style={s.viewerImage}
              resizeMode="contain"
            />
          )}
          <TouchableOpacity
            style={s.viewerClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="닫기"
            onPress={() => setViewing(null)}
          >
            <CloseIcon size={22} color={colors.textOnPrimary} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default TripCardEditView;
