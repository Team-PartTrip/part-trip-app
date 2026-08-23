import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { notificationListStyles as s } from './NotificationListView.styles';
import { bucketOf, metaOf, timeAgo } from './notificationMeta';
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
  Notification,
  NotificationCategory,
} from '../../entities/notification/api';

const FILTERS: { key: 'ALL' | NotificationCategory; label: string }[] = [
  { key: 'ALL', label: '전체' },
  { key: 'VOTE', label: '투표' },
  { key: 'RECORD', label: '기록' },
];

const BUCKET_ORDER = ['오늘', '이번 주', '이전'] as const;

interface Props {
  onBack?: () => void;
  onOpen?: (notification: Notification) => void;
}

const NotificationListView: React.FC<Props> = ({ onBack, onOpen }) => {
  const [filter, setFilter] = useState<'ALL' | NotificationCategory>('ALL');
  const [items, setItems] = useState<Notification[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async (category: 'ALL' | NotificationCategory) => {
    setLoading(true);
    try {
      const page = await getNotifications({ category });
      setItems(page.items);
      setCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch {
      setItems([]);
      setCursor(null);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(filter);
    }, [filter, load]),
  );

  const loadMore = async () => {
    if (!hasNext || loadingMore) {
      return;
    }
    setLoadingMore(true);
    try {
      const page = await getNotifications({ category: filter, cursor });
      setItems(prev => [...prev, ...page.items]);
      setCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch {
      setHasNext(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllAsRead();
      setItems(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e: any) {
      Alert.alert('실패', e?.message ?? '모두 읽음 처리에 실패했습니다.');
    }
  };

  const handleOpen = async (n: Notification) => {
    // 목록에서 먼저 읽음으로 바꿔 화면이 바로 반응하게 한다
    if (!n.read) {
      setItems(prev =>
        prev.map(x =>
          x.notificationId === n.notificationId ? { ...x, read: true } : x,
        ),
      );
      markAsRead(n.notificationId).catch(() => {});
    }
    onOpen?.({ ...n, read: true });
  };

  const grouped = BUCKET_ORDER.map(bucket => ({
    bucket,
    rows: items.filter(n => bucketOf(n.createdAt) === bucket),
  })).filter(g => g.rows.length > 0);

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={onBack} hitSlop={12}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
        </View>
        <View style={s.headerRow}>
          <Text style={s.title}>알림</Text>
          <TouchableOpacity onPress={handleReadAll} hitSlop={8}>
            <Text style={s.readAll}>모두 읽음</Text>
          </TouchableOpacity>
        </View>

        <View style={s.chipRow}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[s.chip, active && s.chipActive]}
                activeOpacity={0.85}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading ? (
          <ActivityIndicator style={s.loading} />
        ) : items.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>받은 알림이 없어요</Text>
            <Text style={s.emptyDesc}>새 소식이 생기면 여기에 모아드릴게요.</Text>
          </View>
        ) : (
          grouped.map(group => (
            <View key={group.bucket}>
              <Text style={s.bucket}>{group.bucket}</Text>
              {group.rows.map(n => {
                const meta = metaOf(n.type);
                return (
                  <TouchableOpacity
                    key={n.notificationId}
                    style={[s.card, !n.read && s.cardUnread]}
                    activeOpacity={0.85}
                    onPress={() => handleOpen(n)}
                  >
                    <View style={[s.badge, { backgroundColor: meta.color }]}>
                      <Text style={s.badgeText}>{meta.badge}</Text>
                    </View>
                    <View style={s.cardBody}>
                      <Text
                        style={[s.cardTitle, n.read && s.cardTitleRead]}
                        numberOfLines={1}
                      >
                        {n.body ?? n.title}
                      </Text>
                      <Text style={s.cardTime}>{timeAgo(n.createdAt)}</Text>
                    </View>
                    {!n.read && <View style={s.dot} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        {hasNext && (
          <TouchableOpacity style={s.more} onPress={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <ActivityIndicator />
            ) : (
              <Text style={[s.emptyDesc, { textAlign: 'center' }]}>더 보기</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationListView;
