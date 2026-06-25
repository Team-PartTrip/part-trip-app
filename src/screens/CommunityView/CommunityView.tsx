import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { communityStyles as styles } from './CommunityView.styles';

type TabKey = 'free' | 'review' | 'route';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'free', label: '자유게시판' },
  { key: 'review', label: '여행 후기' },
  { key: 'route', label: '경로/일정 공유' },
];

// ── 더미 데이터 (추후 GET /api/community 연동) ──
interface FreePost {
  id: string;
  author: string;
  verified?: boolean;
  time: string;
  title: string;
  body: string;
  thumbs: number;
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
  schedule: { time: string; text: string }[];
}

const FREE_POSTS: FreePost[] = [
  {
    id: 'f1',
    author: '계획적인 탐험가',
    time: '15분 전',
    title: '일본 교토 숙소 추천 부탁드려요! 🏮',
    body: '다음 달에 부모님 모시고 교토 3박 4일 여행 갑니다. 가와라마치 쪽이랑 교토역 근처 중에 어디가 더 이동하기 편할까요?',
    thumbs: 0,
    likes: 8,
    comments: 12,
  },
  {
    id: 'f2',
    author: 'TRAVLR 에디터',
    verified: true,
    time: '어제 · 여행꿀팁',
    title: '초보 여행자를 위한 짐 싸기 꿀팁 TOP 5 🧳',
    body: '셀러는 첫 해외여행, 무엇을 챙겨야 할지 막막하시죠? 베테랑 여행 에디터가 알려주는 부피 1/2로 줄이는...',
    thumbs: 3,
    likes: 452,
    comments: 89,
  },
];

const REVIEWS: Review[] = [
  {
    id: 'r1',
    place: '제주도 앞의 해변',
    rating: 5,
    title: '투명한 바다와 완벽한 휴식',
    body: '한 여 해수욕장의 에메랄드빛 바다는 정말 환상적입니다. 일정 시간에 맞춰 방문하는 것을 추천합니다.',
    time: '2시간 전',
  },
  {
    id: 'r2',
    place: '프랑스 파리 에펠탑',
    rating: 4,
    title: '낭만적인 야경의 정석',
    body: '정시에 1번씩 빛나는 에펠탑은 정말 잊지 못할 추억이 될 거예요. 마르스 광장에서 보는 야경이 최고!',
    time: '6시간 전',
  },
];

const ROUTES: Route[] = [
  {
    id: 'rt1',
    author: '무작정 탐험가',
    time: '어제',
    title: '교토 숨은 감성 골목 2박 3일',
    schedule: [
      { time: '오전 10:00', text: '기요미즈데라 관람 · 여유로운 산책' },
      { time: '오후 1:30', text: '니시키 시장 먹거리 투어 · 로컬 푸드 체험' },
    ],
  },
];
// ────────────────────────────────────────────

const stars = (n: number) => '★★★★★☆☆☆☆☆'.slice(5 - n, 10 - n);

interface CommunityViewProps {
  /** 게시글 작성 화면 열기 */
  onWrite?: (tab: TabKey) => void;
  /** 게시글 상세 열기 */
  onOpenPost?: (id: string) => void;
}

const CommunityView: React.FC<CommunityViewProps> = ({
  onWrite,
  onOpenPost,
}) => {
  const [tab, setTab] = useState<TabKey>('free');
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const match = (...fields: string[]) =>
    !q || fields.some(f => f.toLowerCase().includes(q));

  const freeList = useMemo(
    () => FREE_POSTS.filter(p => match(p.title, p.body, p.author)),
    [q],
  );
  const reviewList = useMemo(
    () => REVIEWS.filter(r => match(r.title, r.body, r.place)),
    [q],
  );
  const routeList = useMemo(
    () => ROUTES.filter(r => match(r.title, r.author)),
    [q],
  );

  const isEmpty =
    (tab === 'free' && freeList.length === 0) ||
    (tab === 'review' && reviewList.length === 0) ||
    (tab === 'route' && routeList.length === 0);

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
              onPress={() => onOpenPost?.(p.id)}
            >
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarIcon}>🧑</Text>
                </View>
                <Text style={styles.authorName}>{p.author}</Text>
                {p.verified && <Text style={styles.verified}>✔</Text>}
                <Text style={styles.dot}>·</Text>
                <Text style={styles.time}>{p.time}</Text>
              </View>
              <Text style={styles.postTitle}>{p.title}</Text>
              <Text style={styles.postBody} numberOfLines={3}>
                {p.body}
              </Text>

              {p.thumbs > 0 && (
                <View style={styles.thumbRow}>
                  {Array.from({ length: Math.min(p.thumbs, 2) }).map((_, i) => (
                    <View key={i} style={styles.thumb} />
                  ))}
                  {p.thumbs > 2 && (
                    <View style={[styles.thumb, styles.thumbMore]}>
                      <Text style={styles.thumbMoreText}>+{p.thumbs - 2}</Text>
                    </View>
                  )}
                </View>
              )}

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
              onPress={() => onOpenPost?.(r.id)}
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
              onPress={() => onOpenPost?.(r.id)}
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
                  <Text style={styles.scheduleTime}>{s.time}</Text>
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
