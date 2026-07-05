import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { communityStyles as styles } from './CommunityView.styles';
import {
  getReviews,
  getSharedTrips,
  getBoards,
  ReviewDto,
  BoardDto,
} from '../../api/community';
import { TripDto } from '../../api/trip';

type TabKey = 'free' | 'review' | 'route';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'free', label: '자유게시판' },
  { key: 'review', label: '여행 후기' },
  { key: 'route', label: '경로/일정 공유' },
];

interface FreePost {
  id: string;
  author: string;
  time: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
}
interface Review {
  id: string;
  place: string;
  rating: number;
  title: string;
  body: string;
  time: string;
}
interface Route {
  id: string;
  author: string;
  time: string;
  title: string;
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
});

const toRoute = (t: TripDto): Route => ({
  id: String(t.tripId),
  author: t.nickName,
  time: formatTime(t.createDate),
  title: t.title,
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
  likes: b.likeCount,
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  const loadFreePosts = useCallback(async () => {
    try {
      setFreeLoading(true);
      const data = await getBoards();
      setFreePosts(data.map(toFreePost));
    } catch {
      setFreePosts([]);
    } finally {
      setFreeLoading(false);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviews();
      setReviews(data.map(toReview));
    } catch {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const loadRoutes = useCallback(async () => {
    try {
      setRoutesLoading(true);
      const data = await getSharedTrips();
      setRoutes(data.map(toRoute));
    } catch {
      setRoutes([]);
    } finally {
      setRoutesLoading(false);
    }
  }, []);

  // 화면에 다시 진입할 때마다(글 작성 후 돌아왔을 때 포함) 최신 데이터 갱신
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
                <Text style={styles.meta}>👍 {p.likes}</Text>
                <Text style={styles.meta}>💬 {p.comments}</Text>
              </View>
            </TouchableOpacity>
          ))}

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
                <Text style={styles.time}>{r.time}</Text>
              </View>
            </TouchableOpacity>
          ))}

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
            </TouchableOpacity>
          ))}
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
