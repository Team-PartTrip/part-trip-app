import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { postCreateStyles as s } from './PostCreateView.styles';
import {
  createReview,
  updateReview,
  shareTrip,
  createBoard,
  updateBoard,
  getBoard,
  getReview,
} from '../../api/community';
import {
  createTrip,
  updateTrip,
  getTrip,
  TripPlacePayload,
} from '../../api/trip';
import { uploadImage, toImageUrl } from '../../api/image';
import type { SelectedDestination } from './DestinationPickerView';
import { setDestinationCallback } from './destinationSelectBridge';

type Cat = 'free' | 'review' | 'route';
const CATS: { key: Cat; label: string }[] = [
  { key: 'free', label: '자유게시판' },
  { key: 'review', label: '여행 후기' },
  { key: 'route', label: '경로/일정 공유' },
];
interface RouteItem {
  id: string;
  name: string;
  sub: string;
}
interface DayPlan {
  day: number;
  items: RouteItem[];
}
interface PhotoItem {
  id: string;
  uri: string;
  url?: string;
  uploading: boolean;
}

interface Props {
  initialTab?: Cat;
  destination?: SelectedDestination;
  editType?: Cat;
  editId?: string;
  onBack?: () => void;
  onPickDestination?: () => void;
  onSubmit?: () => void;
}

const PostCreateView: React.FC<Props> = ({
  initialTab = 'free',
  destination,
  editType,
  editId,
  onBack,
  onPickDestination,
  onSubmit,
}) => {
  const isEditing = !!editType && !!editId;
  const [cat, setCat] = useState<Cat>(editType ?? initialTab);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [rating, setRating] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<
    SelectedDestination | undefined
  >(destination);
  const [days, setDays] = useState<DayPlan[]>([{ day: 1, items: [] }]);
  const [activeDay, setActiveDay] = useState(1);
  const [itemText, setItemText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditing);

  useEffect(() => {
    if (destination) setSelectedDestination(destination);
  }, [destination]);

  useEffect(() => {
    if (!isEditing || !editId || !editType) return;

    (async () => {
      try {
        if (editType === 'free') {
          const b = await getBoard(Number(editId));
          setTitle(b.title);
          setBody(b.content);
          setPhotos(
            b.images.map((url, i) => ({
              id: `existing-${i}`,
              uri: toImageUrl(url),
              url,
              uploading: false,
            })),
          );
        } else if (editType === 'review') {
          const r = await getReview(Number(editId));
          setTitle(r.title);
          setBody(r.content);
          setRating(r.rating);
          setSelectedDestination({
            countryInfoId: r.countryInfoId,
            name: r.cityName || r.countryName || '',
          });
          setPhotos(
            r.images.map((url, i) => ({
              id: `existing-${i}`,
              uri: toImageUrl(url),
              url,
              uploading: false,
            })),
          );
        } else if (editType === 'route') {
          const t = await getTrip(Number(editId));
          setTitle(t.title);
          setBody(t.content ?? '');
          setSelectedDestination({
            countryInfoId: t.countryInfoId,
            name: t.cityName || t.countryName || '',
          });
          setPhotos(
            t.images.map((url, i) => ({
              id: `existing-${i}`,
              uri: toImageUrl(url),
              url,
              uploading: false,
            })),
          );
          const dayNumbers = Array.from(
            new Set(t.places.map(p => p.dayNumber)),
          ).sort((a, b) => a - b);
          setDays(
            dayNumbers.length > 0
              ? dayNumbers.map(day => ({
                  day,
                  items: t.places
                    .filter(p => p.dayNumber === day)
                    .map(p => ({
                      id: `${p.tripPlaceId}`,
                      name: p.placeName,
                      sub: p.placeSub ?? '',
                    })),
                }))
              : [{ day: 1, items: [] }],
          );
          setActiveDay(dayNumbers[0] ?? 1);
        }
      } catch (e: any) {
        Alert.alert(
          '불러오기 실패',
          e?.message ?? '잠시 후 다시 시도해주세요.',
        );
      } finally {
        setLoadingExisting(false);
      }
    })();
  }, [isEditing, editId, editType]);

  const addItem = () => {
    if (!itemText.trim()) return;
    setDays(prev =>
      prev.map(d =>
        d.day === activeDay
          ? {
              ...d,
              items: [
                ...d.items,
                {
                  id: `${Date.now()}`,
                  name: itemText.trim(),
                  sub: selectedDestination?.name || '장소',
                },
              ],
            }
          : d,
      ),
    );
    setItemText('');
  };
  const addDay = () => {
    const n = days.length + 1;
    setDays(p => [...p, { day: n, items: [] }]);
    setActiveDay(n);
  };
  const current = days.find(d => d.day === activeDay)!;

  const pickPhotos = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 5,
    });
    if (result.didCancel || !result.assets) return;

    for (const asset of result.assets) {
      if (!asset.uri) continue;
      const id = `${Date.now()}-${Math.random()}`;
      const localUri = asset.uri;
      setPhotos(prev => [...prev, { id, uri: localUri, uploading: true }]);
      try {
        const url = await uploadImage(
          localUri,
          asset.fileName ?? `${id}.jpg`,
          asset.type ?? 'image/jpeg',
        );
        setPhotos(prev =>
          prev.map(p => (p.id === id ? { ...p, url, uploading: false } : p)),
        );
      } catch (e: any) {
        Alert.alert('업로드 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
    }
  };
  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async () => {
    if (photos.some(p => p.uploading)) {
      Alert.alert('알림', '사진 업로드가 끝날 때까지 잠시만 기다려주세요.');
      return;
    }
    const images = photos.map(p => p.url).filter((u): u is string => !!u);

    if (cat === 'free') {
      if (!title.trim() || !body.trim()) {
        Alert.alert('알림', '제목과 내용을 입력해주세요.');
        return;
      }
      try {
        setSubmitting(true);
        if (isEditing && editId) {
          await updateBoard(Number(editId), {
            title: title.trim(),
            content: body.trim(),
            images,
          });
        } else {
          await createBoard({
            title: title.trim(),
            content: body.trim(),
            images,
          });
        }
        onSubmit?.();
      } catch (e: any) {
        Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (cat === 'review') {
      if (!selectedDestination) {
        Alert.alert('알림', '여행지를 선택해주세요.');
        return;
      }
      if (rating === 0) {
        Alert.alert('알림', '별점을 선택해주세요.');
        return;
      }
      if (!title.trim() || !body.trim()) {
        Alert.alert('알림', '제목과 내용을 입력해주세요.');
        return;
      }
      try {
        setSubmitting(true);
        const payload = {
          countryInfoId: selectedDestination.countryInfoId,
          title: title.trim(),
          rating,
          content: body.trim(),
          images,
        };
        if (isEditing && editId) {
          await updateReview(Number(editId), payload);
        } else {
          await createReview(payload);
        }
        onSubmit?.();
      } catch (e: any) {
        Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (cat === 'route') {
      if (!selectedDestination) {
        Alert.alert('알림', '여행지를 선택해주세요.');
        return;
      }
      if (!title.trim()) {
        Alert.alert('알림', '제목을 입력해주세요.');
        return;
      }
      const places: TripPlacePayload[] = days.flatMap(d =>
        d.items.map(it => ({
          dayNumber: d.day,
          placeName: it.name,
          placeSub: it.sub,
        })),
      );
      if (places.length === 0) {
        Alert.alert('알림', '여행 경로를 최소 1개 이상 추가해주세요.');
        return;
      }
      try {
        setSubmitting(true);
        const payload = {
          title: title.trim(),
          countryInfoId: selectedDestination.countryInfoId,
          content: body.trim() || undefined,
          images,
          places,
        };
        if (isEditing && editId) {
          await updateTrip(Number(editId), payload);
        } else {
          const trip = await createTrip(payload);
          await shareTrip(trip.tripId);
        }
        onSubmit?.();
      } catch (e: any) {
        Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
      return;
    }
  };

  if (loadingExisting) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <ScreenHeader title="게시글 수정" onBack={onBack} />
        <ActivityIndicator style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader
        title={isEditing ? '게시글 수정' : '게시글 작성'}
        onBack={onBack}
      />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isEditing && (
          <>
            <Text style={s.label}>카테고리 선택</Text>
            <View style={s.catRow}>
              {CATS.map(c => {
                const active = cat === c.key;
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={[s.cat, active && s.catActive]}
                    onPress={() => setCat(c.key)}
                    activeOpacity={0.85}
                  >
                    <Text style={[s.catText, active && s.catTextActive]}>
                      {c.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <TextInput
          style={s.titleInput}
          placeholder="제목을 입력해주세요"
          placeholderTextColor="#aab4be"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={s.bodyInput}
          placeholder="여행 이야기를 들려주세요..."
          placeholderTextColor="#aab4be"
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
        />

        {(cat === 'review' || cat === 'route') && (
          <View style={s.locRow}>
            <Text style={s.locText}>
              📍 {selectedDestination?.name || '여행지를 선택하세요'}
            </Text>
            <TouchableOpacity
              style={s.changeBtn}
              onPress={() => {
                setDestinationCallback(setSelectedDestination);
                onPickDestination?.();
              }}
              activeOpacity={0.85}
            >
              <Text style={s.changeText}>변경</Text>
            </TouchableOpacity>
          </View>
        )}

        {cat === 'review' && (
          <>
            <Text style={s.label}>여행지 별점</Text>
            <View style={s.starRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                  <Text style={s.star}>{n <= rating ? '★' : '☆'}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {cat === 'route' && (
          <>
            <View style={s.dayTabsRow}>
              <Text style={s.label}>여행 경로 추가</Text>
              <TouchableOpacity onPress={addDay}>
                <Text style={s.addDay}>+ 일차 추가</Text>
              </TouchableOpacity>
            </View>
            <View style={s.dayTabs}>
              {days.map(d => {
                const active = d.day === activeDay;
                return (
                  <TouchableOpacity
                    key={d.day}
                    style={[s.dayTab, active && s.dayTabActive]}
                    onPress={() => setActiveDay(d.day)}
                  >
                    <Text style={[s.dayTabText, active && s.dayTabTextActive]}>
                      Day {d.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {current.items.map((it, i) => (
              <View key={it.id} style={s.routeItem}>
                <View style={s.routeNum}>
                  <Text style={s.routeNumText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.routeName}>{it.name}</Text>
                  <Text style={s.routeSub}>{it.sub}</Text>
                </View>
              </View>
            ))}
            <View style={s.addItemRow}>
              <TextInput
                style={s.addItemInput}
                placeholder="장소 검색하여 추가하기"
                placeholderTextColor="#aab4be"
                value={itemText}
                onChangeText={setItemText}
              />
              <TouchableOpacity style={s.addItemBtn} onPress={addItem}>
                <Text style={s.addItemBtnText}>추가</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={s.label}>사진 추가</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={s.addPhoto}
            onPress={pickPhotos}
            activeOpacity={0.85}
          >
            <Text style={s.addPhotoIcon}>📷</Text>
            <Text style={s.addPhotoText}>사진 추가</Text>
          </TouchableOpacity>
          {photos.map(p => (
            <View key={p.id} style={s.thumbWrap}>
              <Image source={{ uri: p.uri }} style={s.thumb} />
              {p.uploading && (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  }}
                />
              )}
              <TouchableOpacity
                style={s.thumbX}
                onPress={() => removePhoto(p.id)}
              >
                <Text style={s.thumbXText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <View style={s.footer}>
        <TouchableOpacity
          style={[s.fBtn, s.primary]}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryText}>완료</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.fBtn, s.ghost]}
          activeOpacity={0.85}
          onPress={onBack}
          disabled={submitting}
        >
          <Text style={s.ghostText}>취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostCreateView;
