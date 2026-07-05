import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../component/ScreenHeader';
import { postCreateStyles as s } from './PostCreateView.styles';
import { createReview, shareTrip, createBoard } from '../../api/community';
import { createTrip, TripPlacePayload } from '../../api/trip';
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

interface Props {
  initialTab?: Cat;
  destination?: SelectedDestination;
  onBack?: () => void;
  onPickDestination?: () => void;
  onSubmit?: () => void;
}

const PostCreateView: React.FC<Props> = ({
  initialTab = 'free',
  destination,
  onBack,
  onPickDestination,
  onSubmit,
}) => {
  const [cat, setCat] = useState<Cat>(initialTab);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState<number[]>([]);
  const [rating, setRating] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<
    SelectedDestination | undefined
  >(destination);
  const [days, setDays] = useState<DayPlan[]>([{ day: 1, items: [] }]);
  const [activeDay, setActiveDay] = useState(1);
  const [itemText, setItemText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (destination) setSelectedDestination(destination);
  }, [destination]);

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

  const handleSubmit = async () => {
    if (cat === 'free') {
      if (!title.trim() || !body.trim()) {
        Alert.alert('알림', '제목과 내용을 입력해주세요.');
        return;
      }
      try {
        setSubmitting(true);
        await createBoard({ title: title.trim(), content: body.trim() });
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
        await createReview({
          countryInfoId: selectedDestination.countryInfoId,
          title: title.trim(),
          rating,
          content: body.trim(),
        });
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
        const trip = await createTrip({
          title: title.trim(),
          countryInfoId: selectedDestination.countryInfoId,
          content: body.trim() || undefined,
          places,
        });
        await shareTrip(trip.tripId);
        onSubmit?.();
      } catch (e: any) {
        Alert.alert('등록 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
      } finally {
        setSubmitting(false);
      }
      return;
    }
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScreenHeader title="게시글 작성" onBack={onBack} />
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
            onPress={() => setPhotos(p => [...p, Date.now()])}
            activeOpacity={0.85}
          >
            <Text style={s.addPhotoIcon}>📷</Text>
            <Text style={s.addPhotoText}>사진 추가</Text>
          </TouchableOpacity>
          {photos.map(id => (
            <View key={id} style={s.thumbWrap}>
              <View style={s.thumb} />
              <TouchableOpacity
                style={s.thumbX}
                onPress={() => setPhotos(p => p.filter(x => x !== id))}
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
