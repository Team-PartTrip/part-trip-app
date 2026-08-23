import colors from '../../shared/tokens/colors';
import type { NotificationType } from '../../entities/notification/api';

// 알림 종류마다 목록 왼쪽 배지의 문구와 색이 다르다 (피그마 E6)
const META: Record<NotificationType, { badge: string; color: string }> = {
  VOTE_PARTICIPATED: { badge: '투표', color: colors.accent },
  VOTE_DEADLINE: { badge: '플래너', color: colors.primary },
  PHOTO_ORGANIZED: { badge: '기록', color: colors.success },
  COUNTRY_ACQUIRED: { badge: '국가', color: colors.primary },
  TRIP_CARD_CREATED: { badge: '여행카드', color: colors.accent },
  GROUP_INVITE_ACCEPTED: { badge: '그룹', color: colors.success },
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

/** 목록을 오늘 / 이번 주 / 이전 으로 나눈다 */
export function bucketOf(iso: string): '오늘' | '이번 주' | '이전' {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) {
    return '이전';
  }
  const days = (Date.now() - then) / 86_400_000;
  if (days < 1) {
    return '오늘';
  }
  return days < 7 ? '이번 주' : '이전';
}
