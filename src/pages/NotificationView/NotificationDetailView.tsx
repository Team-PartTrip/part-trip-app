import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { notificationDetailStyles as s } from './NotificationDetailView.styles';
import { metaOf, timeAgo } from './notificationMeta';
import type { Notification } from '../../entities/notification/api';

// "2026-08-21T10:24:00" → "2026.08.21  10:24"
function formatStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}  ${p(
    d.getHours(),
  )}:${p(d.getMinutes())}`;
}

// 알림을 눌렀을 때 갈 곳. 플래너는 아직 준비 중 화면이다.
const LINK_LABEL: Record<string, string> = {
  VOTE: '투표 보러가기',
  GROUP: '그룹 보러가기',
  TRIP_CARD: '여행카드 보러가기',
  RECORD: '기록 보러가기',
  WORLD_MAP: '세계지도 보러가기',
};

interface Props {
  notification: Notification;
  onBack?: () => void;
  onOpenLink?: (linkType: string, linkId: number | null) => void;
}

const NotificationDetailView: React.FC<Props> = ({
  notification: n,
  onBack,
  onOpenLink,
}) => {
  const meta = metaOf(n.type);
  const linkLabel = n.linkType ? LINK_LABEL[n.linkType] : undefined;

  return (
    <SafeAreaView style={s.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>

        <View style={s.titleRow}>
          <Text style={s.title}>알림 상세</Text>
          {n.read && (
            <View style={s.readBadge}>
              <Text style={s.readBadgeText}>✓ 읽음 처리</Text>
            </View>
          )}
        </View>

        <View style={s.card}>
          <View style={s.kindBadge}>
            <Text style={s.kindBadgeText}>{meta.badge}</Text>
          </View>
          <Text style={s.cardTitle}>{n.title}</Text>
          {!!n.body && <Text style={s.cardBody}>{n.body}</Text>}
          <Text style={s.cardTime}>
            {formatStamp(n.createdAt)}  ·  {timeAgo(n.createdAt)}
          </Text>
          <View style={s.divider} />
          <Text style={s.note}>
            이 알림은 열람 시 자동으로 읽음 처리됩니다.{'\n'}
            목록에서 [모두 읽음]으로 일괄 처리할 수도 있어요.
          </Text>
        </View>

        {!!linkLabel && (
          <TouchableOpacity
            style={s.primaryBtn}
            activeOpacity={0.85}
            onPress={() => onOpenLink?.(n.linkType as string, n.linkId)}
          >
            <Text style={s.primaryBtnText}>{linkLabel}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={s.secondaryBtn} activeOpacity={0.85} onPress={onBack}>
          <Text style={s.secondaryBtnText}>알림 목록으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationDetailView;
