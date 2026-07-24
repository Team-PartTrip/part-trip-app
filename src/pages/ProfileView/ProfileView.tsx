import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { profileStyles as s } from './ProfileView.styles';
import {
  getMyReviews,
  getMyBoards,
  ReviewDto,
  BoardDto,
} from '../../entities/community/api';
import { getMyTrips, TripDto } from '../../entities/trip/api';
import { logout } from '../../entities/auth/api';
import { getRefreshToken, clearTokens } from '../../shared/api/tokenStorage';
import { getMyProfile, getMyCharacter, UserProfile, CharacterInfo } from '../../entities/profile/api';
import { toImageUrl } from '../../shared/api/image';

interface Badge {
  id: string;
  icon: number;
  label: string;
  sub: string;
  earned: boolean;
  desc: string;
}

const DEFAULT_AVATAR = require('../../shared/assets/images/profile-character.jpg');

const BADGES: Badge[] = [
  {
    id: 'b1',
    icon: require('../../shared/assets/images/profile-badge-1.png'),
    label: '첫 발걸음',
    sub: '첫 여행지 등록',
    earned: true,
    desc: '첫 여행지를 등록하고 여정을 시작했어요!',
  },
  {
    id: 'b2',
    icon: require('../../shared/assets/images/profile-badge-2.png'),
    label: '세계 탐험가',
    sub: '5개국 방문',
    earned: true,
    desc: '5개국을 방문한 진정한 탐험가예요.',
  },
  {
    id: 'b3',
    icon: require('../../shared/assets/images/profile-badge-3.png'),
    label: '초보 모험가',
    sub: 'LV.5 달성',
    earned: true,
    desc: '레벨 5를 달성했어요.',
  },
  {
    id: 'b4',
    icon: require('../../shared/assets/images/profile-badge-4.png'),
    label: '탐험의 시작',
    sub: '첫 사진 분석',
    earned: true,
    desc: '첫 사진 분석을 완료했어요.',
  },
  {
    id: 'b5',
    icon: require('../../shared/assets/images/profile-badge-5.png'),
    label: '지구 한 바퀴',
    sub: '20개국 방문',
    earned: false,
    desc: '20개국을 방문하면 획득할 수 있어요.',
  },
  {
    id: 'b6',
    icon: require('../../shared/assets/images/profile-badge-6.png'),
    label: '속련 탐험가',
    sub: 'LV.20 달성',
    earned: false,
    desc: '레벨 20을 달성하면 획득할 수 있어요.',
  },
];

type MyTab = 'review' | 'free' | 'route';
const MY_TABS: { key: MyTab; label: string }[] = [
  { key: 'free', label: '자유게시판' },
  { key: 'review', label: '여행 후기' },
  { key: 'route', label: '경로/일정' },
];
const PAGE_SIZE = 10;

interface Props {
  onEdit?: () => void;
  onSeeAllBadges?: () => void;
  onOpenPost?: (id: string, type: 'free' | 'review' | 'route') => void;
  onLogout?: () => void;
}

const ProfileView: React.FC<Props> = ({
  onEdit,
  onSeeAllBadges,
  onOpenPost,
  onLogout,
}) => {
  const [selected, setSelected] = useState<Badge | null>(null);
  const [myTab, setMyTab] = useState<MyTab>('free');

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [character, setCharacter] = useState<CharacterInfo | null>(null);

  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasNext, setReviewHasNext] = useState(false);

  const [boards, setBoards] = useState<BoardDto[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(true);
  const [boardPage, setBoardPage] = useState(0);
  const [boardHasNext, setBoardHasNext] = useState(false);

  const [trips, setTrips] = useState<TripDto[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getMyProfile()
        .then(setProfile)
        .catch(() => setProfile(null));
      getMyCharacter()
        .then(setCharacter)
        .catch(() => setCharacter(null));

      setReviewsLoading(true);
      getMyReviews(0, PAGE_SIZE)
        .then(data => {
          setReviews(data.content);
          setReviewPage(0);
          setReviewHasNext(data.hasNext);
        })
        .catch(() => setReviews([]))
        .finally(() => setReviewsLoading(false));

      setBoardsLoading(true);
      getMyBoards(0, PAGE_SIZE)
        .then(data => {
          setBoards(data.content);
          setBoardPage(0);
          setBoardHasNext(data.hasNext);
        })
        .catch(() => setBoards([]))
        .finally(() => setBoardsLoading(false));

      setTripsLoading(true);
      getMyTrips()
        .then(setTrips)
        .catch(() => setTrips([]))
        .finally(() => setTripsLoading(false));
    }, []),
  );

  const loadMoreReviews = async () => {
    const next = reviewPage + 1;
    const data = await getMyReviews(next, PAGE_SIZE);
    setReviews(prev => [...prev, ...data.content]);
    setReviewPage(next);
    setReviewHasNext(data.hasNext);
  };

  const loadMoreBoards = async () => {
    const next = boardPage + 1;
    const data = await getMyBoards(next, PAGE_SIZE);
    setBoards(prev => [...prev, ...data.content]);
    setBoardPage(next);
    setBoardHasNext(data.hasNext);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          try {
            const refreshToken = await getRefreshToken();
            if (refreshToken) {
              await logout(refreshToken).catch(() => {});
            }
          } finally {
            await clearTokens();
            onLogout?.();
          }
        },
      },
    ]);
  };

  return (
    <View style={s.safeArea}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Image
              source={
                profile?.imgUrl
                  ? { uri: toImageUrl(profile.imgUrl) }
                  : DEFAULT_AVATAR
              }
              style={{ width: '100%', height: '100%', borderRadius: 38 }}
              resizeMode="cover"
            />
          </View>
          <View style={s.profileInfo}>
            <Text style={s.nickname}>{profile?.nickName ?? '...'}</Text>
            <Text style={s.type}>
              {character?.characterType ?? '아직 여행 캐릭터가 없어요'}
            </Text>
            <TouchableOpacity
              style={s.editBtn}
              activeOpacity={0.85}
              onPress={onEdit}
            >
              <Text style={s.editBtnText}>정보 수정</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 뱃지 */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>뱃지</Text>
          <TouchableOpacity onPress={onSeeAllBadges}>
            <Text style={s.seeAll}>전체보기 →</Text>
          </TouchableOpacity>
        </View>
        <View style={s.grid}>
          {BADGES.map(b => (
            <TouchableOpacity
              key={b.id}
              style={s.badgeCard}
              activeOpacity={0.85}
              onPress={() => setSelected(b)}
            >
              <View style={[s.badgeEmblem, !b.earned && s.badgeLocked]}>
                <Image
                  source={b.icon}
                  style={{ width: '100%', height: '100%', borderRadius: 44 }}
                  resizeMode="cover"
                />
              </View>
              <View style={[s.ribbon, !b.earned && s.ribbonLocked]}>
                <Text style={s.ribbonText}>{b.label}</Text>
              </View>
              <Text style={s.badgeSub}>{b.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 내가 쓴 글 */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>내가 쓴 글</Text>
        </View>
        <View style={s.myTabRow}>
          {MY_TABS.map(t => {
            const active = myTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[s.myTab, active && s.myTabActive]}
                activeOpacity={0.85}
                onPress={() => setMyTab(t.key)}
              >
                <Text style={[s.myTabText, active && s.myTabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {myTab === 'review' && (
          <>
            {reviewsLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
            {!reviewsLoading && reviews.length === 0 && (
              <View style={s.emptyMy}>
                <Text style={s.emptyMyText}>작성한 리뷰가 없습니다.</Text>
              </View>
            )}
            {reviews.map(r => (
              <TouchableOpacity
                key={r.reviewId}
                style={s.postCard}
                activeOpacity={0.9}
                onPress={() => onOpenPost?.(String(r.reviewId), 'review')}
              >
                <Text style={s.postCardTitle}>{r.title}</Text>
                <Text style={s.postCardBody} numberOfLines={2}>
                  {r.content}
                </Text>
                <View style={s.postCardMetaRow}>
                  <Text style={s.postCardMeta}>
                    📍 {r.cityName || r.countryName}
                  </Text>
                  <Text style={s.postCardMeta}>❤️ {r.likeCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {!reviewsLoading && reviewHasNext && (
              <TouchableOpacity style={s.moreBtn} onPress={loadMoreReviews}>
                <Text style={s.moreBtnText}>더보기</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {myTab === 'free' && (
          <>
            {boardsLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
            {!boardsLoading && boards.length === 0 && (
              <View style={s.emptyMy}>
                <Text style={s.emptyMyText}>작성한 글이 없습니다.</Text>
              </View>
            )}
            {boards.map(b => (
              <TouchableOpacity
                key={b.boardId}
                style={s.postCard}
                activeOpacity={0.9}
                onPress={() => onOpenPost?.(String(b.boardId), 'free')}
              >
                <Text style={s.postCardTitle}>{b.title}</Text>
                <Text style={s.postCardBody} numberOfLines={2}>
                  {b.content}
                </Text>
                <View style={s.postCardMetaRow}>
                  <Text style={s.postCardMeta}>❤️ {b.likeCount}</Text>
                  <Text style={s.postCardMeta}>💬 {b.commentCount}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {!boardsLoading && boardHasNext && (
              <TouchableOpacity style={s.moreBtn} onPress={loadMoreBoards}>
                <Text style={s.moreBtnText}>더보기</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {myTab === 'route' && (
          <>
            {tripsLoading && <ActivityIndicator style={{ marginTop: 12 }} />}
            {!tripsLoading && trips.length === 0 && (
              <View style={s.emptyMy}>
                <Text style={s.emptyMyText}>만든 일정이 없습니다.</Text>
              </View>
            )}
            {trips.map(t => (
              <TouchableOpacity
                key={t.tripId}
                style={s.postCard}
                activeOpacity={0.9}
                onPress={() =>
                  t.isPublic && onOpenPost?.(String(t.tripId), 'route')
                }
              >
                <Text style={s.postCardTitle}>{t.title}</Text>
                <View style={s.postCardMetaRow}>
                  <Text style={s.postCardMeta}>
                    📍 {t.cityName || t.countryName}
                  </Text>
                  <Text style={s.postCardMeta}>
                    {t.isPublic ? '공개' : '비공개'}
                  </Text>
                  {t.isPublic && (
                    <Text style={s.postCardMeta}>❤️ {t.likeCount}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        <TouchableOpacity
          style={s.logoutBtn}
          activeOpacity={0.85}
          onPress={handleLogout}
        >
          <Text style={s.logoutBtnText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 뱃지 상세 */}
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <TouchableOpacity
              style={s.modalClose}
              onPress={() => setSelected(null)}
            >
              <Text style={s.modalCloseText}>✕</Text>
            </TouchableOpacity>
            <View style={s.modalEmblem}>
              {selected && (
                <Image
                  source={selected.icon}
                  style={{ width: '100%', height: '100%', borderRadius: 60 }}
                  resizeMode="cover"
                />
              )}
            </View>
            <Text style={s.modalTitle}>{selected?.label}</Text>
            <Text style={s.modalSub}>{selected?.sub}</Text>
            <View style={s.modalDescBox}>
              <Text style={s.modalDesc}>{selected?.desc}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileView;
