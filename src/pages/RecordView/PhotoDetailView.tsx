import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { photoDetailStyles as s } from './PhotoDetailView.styles';
import { samplePhotosOf } from '../../entities/record/sampleData';
import { formatDateTime, Photo } from '../../entities/record/types';

interface Props {
  tripCardId: number;
  /** 이 장소에서 찍은 사진만 볼 때 */
  tripCardPlaceId?: number;
  /** 처음 보여줄 사진. 없으면 첫 장부터 */
  photoId?: number;
  onBack?: () => void;
  /** 코멘트 작성(D4) · 수정(D5) */
  onWriteComment?: (photo: Photo) => void;
  onEditComment?: (photo: Photo) => void;
  /** 사진 삭제(D6) */
  onDeletePhotos?: () => void;
}

const PhotoDetailView: React.FC<Props> = ({
  tripCardId,
  tripCardPlaceId,
  photoId,
  onBack,
  onWriteComment,
  onEditComment,
  onDeletePhotos,
}) => {
  const photos = samplePhotosOf(tripCardId).filter(
    photo =>
      tripCardPlaceId === undefined ||
      photo.tripCardPlaceId === tripCardPlaceId,
  );
  const [index, setIndex] = useState(() => {
    const found = photos.findIndex(photo => photo.photoId === photoId);
    return found < 0 ? 0 : found;
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const photo = photos[index];
  if (!photo) {
    return <View style={s.safeArea} />;
  }
  const hasComment = photo.commContent.length > 0;

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
        <Text style={s.photoCaption}>{photo.commTitle}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.stripScroll}
        contentContainerStyle={s.strip}
      >
        {photos.map((item, i) => (
          <TouchableOpacity
            key={item.photoId}
            style={[s.thumb, i === index && s.thumbOn]}
            activeOpacity={0.85}
            onPress={() => setIndex(i)}
          />
        ))}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={s.sheet}>
        <Text style={s.title}>{photo.commTitle}</Text>
        <Text style={s.meta}>
          {formatDateTime(photo.takenAt)} · {photo.areaName}
        </Text>

        {!!photo.aiSummary && (
          <View style={s.aiCard}>
            <View style={s.aiIcon}>
              <Text style={s.aiIconText}>🤖</Text>
            </View>
            <View style={s.aiBody}>
              <Text style={s.aiLabel}>AI 해설</Text>
              <Text style={s.aiText}>{photo.aiSummary}</Text>
            </View>
          </View>
        )}

        <Text style={s.label}>코멘트</Text>
        <View style={s.commentRow}>
          <Text
            style={[s.commentText, !hasComment && s.commentPlaceholder]}
            numberOfLines={2}
          >
            {hasComment ? photo.commContent : '이 사진에 대한 메모를 남겨보세요'}
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
