import colors from '../../shared/tokens/colors';
import type { NotificationType } from '../../entities/notification/api';
import type { ColorValue } from 'react-native';

// 알림 종류마다 목록 왼쪽 배지의 문구와 색이 다르다 (피그마 E6)
const META: Record<NotificationType, { badge: string; color: ColorValue }> = {
  VOTE_PARTICIPATED: { badge: '투표', color: colors.accent },
  VOTE_DEADLINE: { badge: '플래너', color: colors.primary },
  VOTE_REMINDER: { badge: '투표', color: colors.accent },
  GROUP_INVITED: { badge: '그룹', color: colors.primary },
  GROUP_INVITE_ACCEPTED: { badge: '그룹', color: colors.success },
  COUNTRY_ACQUIRED: { badge: '국가', color: colors.primary },
  TRIP_CARD_CREATED: { badge: '여행카드', color: colors.accent },
};

export function metaOf(type: NotificationType) {
  return META[type] ?? { badge: '알림', color: colors.primary };
}

/** "10분 전" · "3시간 전" · "2일 전" */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return '';
  }
  const min = Math.max(0, Math.floor((Date.now() - then) / 60_000));
  if (min < 1) {
    return '방금 전';
  }
  if (min < 60) {
    return `${min}분 전`;
  }
  const hour = Math.floor(min / 60);
  if (hour < 24) {
    return `${hour}시간 전`;
  }
  return `${Math.floor(hour / 24)}일 전`;
}

/**
 * 목록을 오늘 / 이번 주 / 이전 으로 나눈다.
 *
 * '오늘'은 달력 기준이다. 24시간을 재면 어제 밤 11시가 오늘로 들어간다.
 */
export function bucketOf(iso: string): '오늘' | '이번 주' | '이전' {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return '이전';
  }
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  if (then.getTime() >= midnight.getTime()) {
    return '오늘';
  }
  // 자정 기준으로 며칠 전인지 센다
  const days = (midnight.getTime() - then.getTime()) / 86_400_000;
  return days < 6 ? '이번 주' : '이전';
}
