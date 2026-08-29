import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { photoDetailStyles as s } from './PhotoDetailView.styles';
import { getTripCard, TimelineItem } from '../../entities/record/api';
import { toImageUrl } from '../../shared/api/image';

interface Props {
  tripCardId: number;
  /** 처음 보여줄 사진. 없으면 첫 장부터 */
  photoId?: number;
  onBack?: () => void;
  /** 코멘트 작성(D4) · 수정(D5) */
  onWriteComment?: (photo: TimelineItem) => void;
  onEditComment?: (photo: TimelineItem) => void;
  /** 사진 삭제(D6) */
  onDeletePhotos?: () => void;
}

/** 촬영 시각을 "2026.08.23 14:20" 으로. 시각이 없는 사진도 있다 */
function formatTakenAt(takenAt: string | null): string {
  if (!takenAt) {
    return '촬영 시각 정보 없음';
  }
  return `${takenAt.slice(0, 10).replace(/-/g, '.')} ${takenAt.slice(11, 16)}`;
}

const PhotoDetailView: React.FC<Props> = ({
  tripCardId,
  photoId,
  onBack,
  onWriteComment,
  onEditComment,
  onDeletePhotos,
}) => {
  const [photos, setPhotos] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setLoading(true);
      getTripCard(tripCardId)
        .then(detail => {
          if (!alive) {
            return;
          }
          // 확정 장소(PLACE)는 사진이 아니라 방문 기록이라 뺀다
          const list = (detail.timeline ?? []).filter(
            item => item.type !== 'PLACE',
          );
          setPhotos(list);
          const found = list.findIndex(item => item.entryId === photoId);
          setIndex(found < 0 ? 0 : found);
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
    }, [tripCardId, photoId]),
  );

  const photo = photos[index];

  if (loading) {
    return (
      <View style={s.safeArea}>
        <ActivityIndicator style={s.loading} />
      </View>
    );
  }
  if (!photo) {
    return (
      <SafeAreaView edges={['top']} style={s.safeArea}>
        <TouchableOpacity style={s.circleBtn} activeOpacity={0.8} onPress={onBack}>
          <Text style={s.circleBtnText}>‹</Text>
        </TouchableOpacity>
        <View style={s.blankBody}>
          <Text style={s.blankText}>아직 남긴 사진이 없어요</Text>
        </View>
      </SafeAreaView>
    );
  }
  const comment = photo.comment ?? '';
  const hasComment = comment.length > 0;

  const openMenu = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <View style={s.safeArea}>
      <SafeAreaView edges={['top']}>
        <View style={s.topBar}>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={onBack}
          >
            <Text style={s.circleBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.counter}>
            {index + 1} / {photos.length}
          </Text>
          <TouchableOpacity
            style={s.circleBtn}
            activeOpacity={0.8}
            onPress={() => setMenuOpen(true)}
          >
            <Text style={s.circleBtnText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={s.photo}>
        {photo.imageUrl ? (
          <Image
            source={{ uri: toImageUrl(photo.imageUrl) }}
            style={s.photoImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={s.photoCaption}>사진</Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.stripScroll}
        contentContainerStyle={s.strip}
      >
        {photos.map((item, i) => (
          <TouchableOpacity
            key={item.entryId ?? i}
            style={[s.thumb, i === index && s.thumbOn]}
            activeOpacity={0.85}
            onPress={() => setIndex(i)}
          >
            {item.imageUrl && (
              <Image
                source={{ uri: toImageUrl(item.imageUrl) }}
                style={s.thumbImage}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.sheet}>
        <Text style={s.title}>{hasComment ? comment : '사진'}</Text>
        <Text style={s.meta}>
          {formatTakenAt(photo.takenAt)}
          {photo.type === 'NO_INFO_PHOTO' ? '  ·  위치 정보 없음' : ''}
        </Text>

        <Text style={s.label}>코멘트</Text>
        <View style={s.commentRow}>
          <Text
            style={[s.commentText, !hasComment && s.commentPlaceholder]}
            numberOfLines={2}
          >
            {hasComment ? comment : '이 사진에 대한 메모를 남겨보세요'}
          </Text>
          <TouchableOpacity
            style={s.commentBtn}
            activeOpacity={0.85}
            onPress={() =>
              hasComment ? onEditComment?.(photo) : onWriteComment?.(photo)
            }
          >
            <Text style={s.commentBtnText}>{hasComment ? '수정' : '작성'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          <SafeAreaView edges={['bottom']} style={s.menu}>
            <View style={s.menuHandle} />
            <TouchableOpacity
              style={s.menuItem}
              onPress={() =>
                openMenu(() =>
                  hasComment ? onEditComment?.(photo) : onWriteComment?.(photo),
                )
              }
            >
              <Text style={s.menuText}>
                {hasComment ? '코멘트 수정' : '코멘트 작성'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.menuItem}
              onPress={() => openMenu(() => onDeletePhotos?.())}
            >
              <Text style={[s.menuText, s.menuDanger]}>사진 삭제</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default PhotoDetailView;
