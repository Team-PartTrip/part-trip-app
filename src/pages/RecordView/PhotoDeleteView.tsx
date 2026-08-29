import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { photoDeleteStyles as s } from './PhotoDeleteView.styles';
import {
  deleteTripCardEntry,
  getTripCard,
  TimelineItem,
} from '../../entities/record/api';
import { toImageUrl } from '../../shared/api/image';

// 좌우 여백 20 · 칸 간격 8 을 빼고 세 칸으로 나눈 크기
const CELL = (Dimensions.get('window').width - 20 * 2 - 8 * 2) / 3;

interface Props {
  tripCardId: number;
  onBack?: () => void;
  onDeleted?: () => void;
}

const PhotoDeleteView: React.FC<Props> = ({ tripCardId, onBack, onDeleted }) => {
  const [photos, setPhotos] = useState<TimelineItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      // 목록을 다시 읽으니 선택도 비운다. 안 그러면 이미 지운 사진의
      // entryId 가 남아 "3개 선택됨" 같은 헛수가 뜬다.
      setSelected([]);
      getTripCard(tripCardId)
        .then(detail => {
          if (alive) {
            // 지울 수 있는 건 사용자가 올린 사진뿐이다. 확정 장소(PLACE)는 뺀다.
            setPhotos(
              (detail.timeline ?? []).filter(
                item => item.type !== 'PLACE' && item.entryId != null,
              ),
            );
          }
        })
        .catch(() => {
          if (alive) {
            setPhotos([]);
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
    }, [tripCardId]),
  );

  const allSelected = photos.length > 0 && selected.length === photos.length;

  const toggle = (entryId: number) =>
    setSelected(prev =>
      prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId],
    );

  const remove = async () => {
    setDeleting(true);
    try {
      // 서버는 한 장씩 받는다
      for (const entryId of selected) {
        await deleteTripCardEntry(tripCardId, entryId);
      }
      onDeleted?.();
    } catch (e: any) {
      Alert.alert('삭제 실패', e?.message ?? '잠시 후 다시 시도해주세요.');
    } finally {
      setDeleting(false);
    }
  };

  const confirm = () =>
    Alert.alert(
      '사진 삭제',
      `${selected.length}장을 삭제할까요? 삭제하면 되돌릴 수 없어요.`,
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: remove },
      ],
    );

  return (
    <SafeAreaView edges={['top']} style={s.safeArea}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.headerSide}>취소</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>{selected.length}개 선택됨</Text>
        <TouchableOpacity
          hitSlop={12}
          onPress={() =>
            setSelected(
              allSelected ? [] : photos.map(photo => photo.entryId as number),
            )
          }
        >
          <Text style={[s.headerSide, s.headerSideOn]}>
            {allSelected ? '해제' : '전체'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator style={s.empty} />
        ) : photos.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>지울 사진이 없어요.</Text>
          </View>
        ) : (
          <View style={s.grid}>
            {photos.map(photo => {
              const entryId = photo.entryId as number;
              const on = selected.includes(entryId);
              return (
                <TouchableOpacity
                  key={entryId}
                  style={[s.cell, { width: CELL, height: CELL }, on && s.cellOn]}
                  activeOpacity={0.85}
                  onPress={() => toggle(entryId)}
                >
                  {photo.imageUrl && (
                    <Image
                      source={{ uri: toImageUrl(photo.imageUrl) }}
                      style={s.thumb}
                    />
                  )}
                  {on && <View style={s.cellVeil} />}
                  <View style={[s.check, on ? s.checkOn : s.checkOff]}>
                    {on && <Text style={s.checkText}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={s.warning}>
          <View style={s.warningIcon}>
            <Text style={s.warningIconText}>!</Text>
          </View>
          <View style={s.warningBody}>
            <Text style={s.warningTitle}>삭제하면 되돌릴 수 없어요</Text>
            <Text style={s.warningDesc}>
              사진을 지우면 해당 기록은 기본 로고 이미지로 대체됩니다.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.footer}>
        <TouchableOpacity
          style={[s.dangerBtn, selected.length === 0 && s.dangerBtnOff]}
          activeOpacity={0.85}
          disabled={selected.length === 0 || deleting}
          onPress={confirm}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.dangerText}>{selected.length}개 삭제하기</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={s.cancelBtn}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Text style={s.cancelText}>취소</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default PhotoDeleteView;
