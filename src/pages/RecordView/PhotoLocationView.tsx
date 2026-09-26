import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { photoLocationStyles as s } from './PhotoLocationView.styles';
import {
  EntryMetadata,
  getTripCard,
  TimelineItem,
  updateTripCardEntryMetadata,
} from '../../entities/record/api';
import { toImageUrl } from '../../shared/api/image';
import { ChevronLeftIcon, PinIcon } from '../../shared/ui/icons';
import colors from '../../shared/tokens/colors';

interface Props {
  tripCardId: number;
  photoId: number;
  onBack?: () => void;
  onSaved?: () => void;
}

interface Pick {
  latitude: number;
  longitude: number;
  placeName: string | null;
}

const KOREA_REGION = {
  latitude: 36.3,
  longitude: 127.8,
  latitudeDelta: 6.5,
  longitudeDelta: 5,
};
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

function tripDays(start: string, end: string): string[] {
  const days: string[] = [];
  const d = new Date(`${start}T00:00:00Z`);
  const last = new Date(`${end}T00:00:00Z`);
  while (d <= last && days.length < 60) {
    days.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return days;
}

function dayLabel(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return `${d.getUTCMonth() + 1}.${d.getUTCDate()} (${
    WEEKDAYS[d.getUTCDay()]
  })`;
}

function initialRegion(photo: TimelineItem | null, places: TimelineItem[]) {
  if (photo?.latitude != null && photo.longitude != null) {
    return {
      latitude: photo.latitude,
      longitude: photo.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }
  if (places.length === 0) {
    return KOREA_REGION;
  }
  const lats = places.map(p => p.latitude as number);
  const lngs = places.map(p => p.longitude as number);
  const [minLat, maxLat] = [Math.min(...lats), Math.max(...lats)];
  const [minLng, maxLng] = [Math.min(...lngs), Math.max(...lngs)];
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(0.03, (maxLat - minLat) * 1.6),
    longitudeDelta: Math.max(0.03, (maxLng - minLng) * 1.6),
  };
}

const PhotoLocationView: React.FC<Props> = ({
  tripCardId,
  photoId,
  onBack,
  onSaved,
}) => {
  const [photo, setPhoto] = useState<TimelineItem | null>(null);
  const [places, setPlaces] = useState<TimelineItem[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [pick, setPick] = useState<Pick | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      getTripCard(tripCardId)
        .then(detail => {
          if (!alive) {
            return;
          }
          const timeline = detail.timeline ?? [];
          setPhoto(timeline.find(item => item.entryId === photoId) ?? null);
          setPlaces(
            timeline.filter(
              item =>
                item.type === 'PLACE' &&
                item.latitude != null &&
                item.longitude != null,
            ),
          );
          setDays(tripDays(detail.startDate, detail.endDate));
        })
        .catch(() => alive && setPhoto(null))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, [tripCardId, photoId]),
  );

  const region = useMemo(() => initialRegion(photo, places), [photo, places]);

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }

  // 사진에 원래 기록된 값(EXIF)은 고칠 수 없다
  const canLocate = photo?.locationSource !== 'EXIF';
  const canDate = photo?.takenAtSource !== 'EXIF';
  const photoDay = photo?.takenAt?.slice(0, 10) ?? null;
  const chosenDay = day ?? photoDay;

  const body: EntryMetadata = {};
  if (canLocate && pick) {
    body.latitude = pick.latitude;
    body.longitude = pick.longitude;
    if (pick.placeName) {
      body.placeName = pick.placeName;
    }
  }
  if (canDate && day && day !== photoDay) {
    // 시각을 모르면 그날 정오로 둔다. 직접 넣었던 시각이 있으면 그대로 쓴다
    body.takenAt = `${day}T${photo?.takenAt?.slice(11, 19) ?? '12:00:00'}`;
  }
  const ready = Object.keys(body).length > 0 && !saving;

  const save = async () => {
    setSaving(true);
    try {
      await updateTripCardEntryMetadata(tripCardId, photoId, body);
      onSaved?.();
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const marker =
    pick ??
    (photo?.latitude != null && photo.longitude != null
      ? {
          latitude: photo.latitude,
          longitude: photo.longitude,
          placeName: photo.placeName,
        }
      : null);

  return (
    <SafeAreaView edges={['top']} style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
        >
          <ChevronLeftIcon size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>촬영 위치 지정</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.photoRow}>
          <View style={s.thumb}>
            {photo?.imageUrl && (
              <Image
                source={{ uri: toImageUrl(photo.imageUrl) }}
                style={s.thumbImage}
              />
            )}
          </View>
          <View style={s.photoBody}>
            <Text style={s.photoTitle}>
              {marker?.placeName ?? (marker ? '고른 위치' : '위치 정보 없음')}
            </Text>
            <Text style={s.photoMeta}>
              {chosenDay ? dayLabel(chosenDay) : '촬영 날짜 없음'}
            </Text>
          </View>
        </View>

        {canLocate && (
          <>
            <Text style={s.label}>어디서 찍었나요?</Text>
            <Text style={s.hint}>
              지도를 누르거나, 아래 다녀온 곳에서 골라주세요.
            </Text>
            <View style={s.mapBox}>
              <MapView
                style={s.map}
                initialRegion={region}
                toolbarEnabled={false}
                onPress={e =>
                  setPick({ ...e.nativeEvent.coordinate, placeName: null })
                }
              >
                {marker && (
                  <Marker
                    coordinate={marker}
                    pinColor={colors.primary as string}
                  />
                )}
              </MapView>
            </View>
            {places.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.chips}
              >
                {places.map((place, i) => {
                  const on =
                    pick?.placeName === place.placeName &&
                    pick?.latitude === place.latitude;
                  return (
                    <TouchableOpacity
                      key={`${place.placeName}-${i}`}
                      style={[s.chip, on && s.chipOn]}
                      activeOpacity={0.85}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      onPress={() =>
                        setPick({
                          latitude: place.latitude as number,
                          longitude: place.longitude as number,
                          placeName: place.placeName,
                        })
                      }
                    >
                      <PinIcon
                        size={14}
                        color={on ? colors.textOnPrimary : colors.primary}
                      />
                      <Text style={[s.chipText, on && s.chipTextOn]}>
                        {place.placeName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </>
        )}

        {canDate && days.length > 0 && (
          <>
            <Text style={s.label}>언제 찍었나요?</Text>
            <View style={s.days}>
              {days.map(d => {
                const on = d === chosenDay;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[s.chip, on && s.chipOn]}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    onPress={() => setDay(d)}
                  >
                    <Text style={[s.chipText, on && s.chipTextOn]}>
                      {dayLabel(d)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.primaryBtn, !ready && s.primaryBtnOff]}
          activeOpacity={0.85}
          disabled={!ready}
          onPress={save}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryText}>저장</Text>
          )}
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default PhotoLocationView;
