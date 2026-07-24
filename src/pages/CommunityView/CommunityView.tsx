import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { communityStyles as styles } from './CommunityView.styles';
import {
  getReviews,
  getSharedTrips,
  getBoards,
  toggleLike,
  ReviewDto,
  BoardDto,
} from '../../entities/community/api';
import { TripDto } from '../../entities/trip/api';
import { toImageUrl } from '../../shared/api/image';

type TabKey = 'free' | 'review' | 'route';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'free', label: '자유게시판' },
  { key: 'review', label: '여행 후기' },
  { key: 'route', label: '경로/일정 공유' },
];

const PAGE_SIZE = 20;

interface FreePost {
  id: string;
  author: string;
  time: string;
  title: string;
  body: string;
  likeCount: number;
  liked: boolean;
  comments: number;
}
interface Review {
  id: string;
  place: string;
  rating: number;
  title: string;
  body: string;
  time: string;
  likeCount: number;
  liked: boolean;
  thumbnail: string | null;
}
interface Route {
  id: string;
  author: string;
  time: string;
  title: string;
  likeCount: number;
  liked: boolean;
  schedule: { day: number; text: string }[];
}

const stars = (n: number) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);

/** ISO 날짜 문자열을 "M/D HH:mm" 형태로 축약 */
const formatTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(
    2,
    '0',
  )}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const toReview = (r: ReviewDto): Review => ({
  id: String(r.reviewId),
  place: r.cityName || r.countryName || '',
  rating: r.rating,
  title: r.title,
  body: r.content,
  time: formatTime(r.createDate),
  likeCount: r.likeCount,
  liked: r.liked,
  thumbnail: r.images.length > 0 ? toImageUrl(r.images[0]) : null,
});

const toRoute = (t: TripDto): Route => ({
  id: String(t.tripId),
  author: t.nickName,
  time: formatTime(t.createDate),
  title: t.title,
  likeCount: t.likeCount,
  liked: t.liked,
  schedule: t.places
    .slice(0, 3)
    .map(p => ({ day: p.dayNumber, text: p.placeName })),
});

const toFreePost = (b: BoardDto): FreePost => ({
  id: String(b.boardId),
  author: b.nickName,
  time: formatTime(b.createDate),
  title: b.title,
  body: b.content,
  likeCount: b.likeCount,
  liked: b.liked,
  comments: b.commentCount,
});

interface CommunityViewProps {
  /** 게시글 작성 화면 열기 */
  onWrite?: (tab: TabKey) => void;
  /** 게시글 상세 열기 */
  onOpenPost?: (id: string, type: TabKey) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({
                                                       onWrite,
                                                       onOpenPost,
                                                     }) => {
  const [tab, setTab] = useState<TabKey>('free');
  const [query, setQuery] = useState('');

  const [freePosts, setFreePosts] = useState<FreePost[]>([]);
  const [freeLoading, setFreeLoading] = useState(true);
  const [freePage, setFreePage] = useState(0);
  const [freeHasNext, setFreeHasNext] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewHasNext, setReviewHasNext] = useState(false);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routePage, setRoutePage] = useState(0);
  const [routeHasNext, setRouteHasNext] = useState(false);

  const loadFreePosts = useCallback(async () => {
    try {
      setFreeLoading(true);
      const data = await getBoards(0, PAGE_SIZE);
      setFreePosts(data.content.map(toFreePost));
      setFreePage(0);
      setFreeHasNext(data.hasNext);
    } catch {
      setFreePosts([]);
      setFreeHasNext(false);
    } finally {
      setFreeLoading(false);
    }
  }, []);

  const loadMoreFreePosts = useCallback(async () => {
    const next = freePage + 1;
    const data = await getBoards(next, PAGE_SIZE);
    setFreePosts(prev => [...prev, ...data.content.map(toFreePost)]);
    setFreePage(next);
    setFreeHasNext(data.hasNext);
  }, [freePage]);

  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviews(undefined, 0, PAGE_SIZE);
      setReviews(data.content.map(toReview));
      setReviewPage(0);
      setReviewHasNext(data.hasNext);
    } catch {
      setReviews([]);
      setReviewHasNext(false);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const loadMoreReviews = useCallback(async () => {
    const next = reviewPage + 1;
    const data = await getReviews(undefined, next, PAGE_SIZE);
    setReviews(prev => [...prev, ...data.content.map(toReview)]);
    setReviewPage(next);
    setReviewHasNext(data.hasNext);
  }, [reviewPage]);

  const loadRoutes = useCallback(async () => {
    try {
      setRoutesLoading(true);
      const data = await getSharedTrips(0, PAGE_SIZE);
      setRoutes(data.content.map(toRoute));
      setRoutePage(0);
      setRouteHasNext(data.hasNext);
    } catch {
      setRoutes([]);
      setRouteHasNext(false);
    } finally {
      setRoutesLoading(false);
    }
  }, []);

  const loadMoreRoutes = useCallback(async () => {
    const next = routePage + 1;
    const data = await getSharedTrips(next, PAGE_SIZE);
    setRoutes(prev => [...prev, ...data.content.map(toRoute)]);
    setRoutePage(next);
    setRouteHasNext(data.hasNext);
  }, [routePage]);

  // 화면에 다시 진입할 때마다(글 작성 후 돌아왔을 때 포함) 최신 데이터로 새로고침
  useFocusEffect(
    useCallback(() => {
      loadFreePosts();
      loadReviews();
      loadRoutes();
    }, [loadFreePosts, loadReviews, loadRoutes]),
  );

  const q = query.trim().toLowerCase();
  const match = useCallback(
    (...fields: string[]) =>
      !q || fields.some(f => f.toLowerCase().includes(q)),
    [q],
  );

  const freeList = useMemo(
    () => freePosts.filter(p => match(p.title, p.body, p.author)),
    [match, freePosts],
  );
  const reviewList = useMemo(
    () => reviews.filter(r => match(r.title, r.body, r.place)),
    [match, reviews],
  );
  const routeList = useMemo(
    () => routes.filter(r => match(r.title, r.author)),
    [match, routes],
  );

  const isEmpty =
    (tab === 'free' && !freeLoading && freeList.length === 0) ||
    (tab === 'review' && !reviewsLoading && reviewList.length === 0) ||
    (tab === 'route' && !routesLoading && routeList.length === 0);

  const handleLikeFree = async (id: string) => {
    setFreePosts(prev =>
      prev.map(p =>
        p.id === id
          ? {
            ...p,
            liked: !p.liked,
            likeCount: p.likeCount + (p.liked ? -1 : 1),
          }
          : p,
      ),
    );
    try {
      const result = await toggleLike('BOARD', Number(id));
      setFreePosts(prev =>
        prev.map(p =>
          p.id === id
            ? { ...p, liked: result.liked, likeCount: result.likeCount }
            : p,
        ),
      );
    } catch {
      loadFreePosts();
    }
  };

  const handleLikeReview = async (id: string) => {
    setReviews(prev =>
      prev.map(r =>
        r.id === id
          ? {
            ...r,
            liked: !r.liked,
            likeCount: r.likeCount + (r.liked ? -1 : 1),
          }
          : r,
      ),
    );
    try {
      const result = await toggleLike('REVIEW', Number(id));
      setReviews(prev =>
        prev.map(r =>
          r.id === id
            ? { ...r, liked: result.liked, likeCount: result.likeCount }
            : r,
        ),
      );
    } catch {
      loadReviews();
    }
  };

  const handleLikeRoute = async (id: string) => {
    setRoutes(prev =>
      prev.map(r =>
        r.id === id
          ? {
            ...r,
            liked: !r.liked,
            likeCount: r.likeCount + (r.liked ? -1 : 1),
          }
          : r,
      ),
    );
    try {
      const result = await toggleLike('TRIP', Number(id));
      setRoutes(prev =>
        prev.map(r =>
          r.id === id
            ? { ...r, liked: result.liked, likeCount: result.likeCount }
            : r,
        ),
      );
    } catch {
      loadRoutes();
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* 카테고리 탭 */}
      <View style={styles.tabRow}>
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, active && styles.tabActive]}
              activeOpacity={0.85}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 검색 */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="제목, 내용, 작성자 검색"
          placeholderTextColor="#aab4be"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {tab === 'free' && freeLoading && (
          <ActivityIndicator style={{ marginTop: 40 }} />
        )}
        {tab === 'review' && reviewsLoading && (
          <ActivityIndicator style={{ marginTop: 40 }} />
        )}
        {tab === 'route' && routesLoading && (
          <ActivityIndicator style={{ marginTop: 40 }} />
        )}

        {isEmpty && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        )}

        {/* 자유게시판 */}
        {tab === 'free' &&
          freeList.map(p => (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => onOpenPost?.(p.id, 'free')}
            >
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>🧑</Text>
                </View>
                <Text style={styles.authorName}>{p.author}</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.time}>{p.time}</Text>
              </View>
              <Text style={styles.postTitle}>{p.title}</Text>
              <Text style={styles.postBody} numberOfLines={3}>
                {p.body}
              </Text>

              <View style={styles.metaRow}>
                <TouchableOpacity onPress={() => handleLikeFree(p.id)}>
                  <Text style={styles.meta}>
                    {p.liked ? '❤️' : '🤍'} {p.likeCount}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.meta}>💬 {p.comments}</Text>
              </View>
            </TouchableOpacity>
          ))}
        {tab === 'free' && !freeLoading && freeHasNext && (
          <TouchableOpacity style={styles.empty} onPress={loadMoreFreePosts}>
            <Text style={styles.emptyText}>더보기</Text>
          </TouchableOpacity>
        )}

        {/* 여행 후기 */}
        {tab === 'review' &&
          reviewList.map(r => (
            <TouchableOpacity
              key={r.id}
              style={styles.reviewCard}
              activeOpacity={0.9}
              onPress={() => onOpenPost?.(r.id, 'review')}
            >
              <View style={styles.reviewImage}>
                {r.thumbnail && (
                  <Image
                    source={{ uri: r.thumbnail }}
                    style={styles.reviewImagePhoto}
                  />
                )}
                <View style={styles.placePill}>
                  <Text style={styles.placePillText}>📍 {r.place}</Text>
                </View>
              </View>
              <View style={styles.reviewBodyWrap}>
                <Text style={styles.reviewStars}>{stars(r.rating)}</Text>
                <Text style={styles.reviewTitle}>{r.title}</Text>
                <Text style={styles.reviewBody} numberOfLines={2}>
                  {r.body}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.time}>{r.time}</Text>
                  <TouchableOpacity onPress={() => handleLikeReview(r.id)}>
                    <Text style={styles.meta}>
                      {r.liked ? '❤️' : '🤍'} {r.likeCount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        {tab === 'review' && !reviewsLoading && reviewHasNext && (
          <TouchableOpacity style={styles.empty} onPress={loadMoreReviews}>
            <Text style={styles.emptyText}>더보기</Text>
          </TouchableOpacity>
        )}

        {/* 경로/일정 공유 */}
        {tab === 'route' &&
          routeList.map(r => (
            <TouchableOpacity
              key={r.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => onOpenPost?.(r.id, 'route')}
            >
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>🧑</Text>
                </View>
                <Text style={styles.authorName}>{r.author}</Text>
                <Text style={styles.dot}>·</Text>
                <Text style={styles.time}>{r.time}</Text>
              </View>
              <Text style={styles.postTitle}>{r.title}</Text>
              {r.schedule.map((s, i) => (
                <View key={i} style={styles.scheduleItem}>
                  <View style={styles.scheduleDot} />
                  <Text style={styles.scheduleTime}>Day {s.day}</Text>
                  <Text style={styles.scheduleText}>{s.text}</Text>
                </View>
              ))}
              <View style={styles.metaRow}>
                <TouchableOpacity onPress={() => handleLikeRoute(r.id)}>
                  <Text style={styles.meta}>
                    {r.liked ? '❤️' : '🤍'} {r.likeCount}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        {tab === 'route' && !routesLoading && routeHasNext && (
          <TouchableOpacity style={styles.empty} onPress={loadMoreRoutes}>
            <Text style={styles.emptyText}>더보기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 플로팅 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => onWrite?.(tab)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityView;