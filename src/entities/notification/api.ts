import { authRequest } from '../../shared/api/http';

export type NotificationType =
  | 'VOTE_PARTICIPATED'
  | 'VOTE_DEADLINE'
  | 'PHOTO_ORGANIZED'
  | 'COUNTRY_ACQUIRED'
  | 'TRIP_CARD_CREATED'
  | 'GROUP_INVITE_ACCEPTED';

export type NotificationCategory = 'VOTE' | 'RECORD';

export interface Notification {
  notificationId: number;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string | null;
  /** 눌렀을 때 이동할 대상. 예) linkType "VOTE", linkId 12 */
  linkType: string | null;
  linkId: number | null;
  read: boolean;
  createdAt: string;
}

export interface NotificationPage {
  items: Notification[];
  /** 다음 요청에 그대로 넣는다. 더 없으면 null */
  nextCursor: number | null;
  hasNext: boolean;
}

export interface UnreadCount {
  unreadCount: number;
}


/** Func-004-01 알림 목록 (커서 방식) */
export function getNotifications(params?: {
  category?: 'ALL' | NotificationCategory;
  cursor?: number | null;
  size?: number;
}): Promise<NotificationPage> {
  const query = new URLSearchParams();
  // 명세서(API-004-01)가 정한 이름은 type 이고, 값은 탭 구분이다
  query.set('type', params?.category ?? 'ALL');
  if (params?.cursor != null) {
    query.set('cursor', String(params.cursor));
  }
  if (params?.size != null) {
    query.set('size', String(params.size));
  }
  return authRequest<NotificationPage>(`/api/notifications?${query}`, {
    method: 'GET',
  });
}

/** 상단 배지에 쓸 안읽음 개수 */
export function getUnreadCount(): Promise<UnreadCount> {
  return authRequest<UnreadCount>('/api/notifications/unread-count', {
    method: 'GET',
  });
}

/** Func-004-02 개별 읽음 처리 */
export function markAsRead(notificationId: number): Promise<void> {
  return authRequest<void>(`/api/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
}

/** Func-004-02 모두 읽음 */
export function markAllAsRead(): Promise<UnreadCount> {
  return authRequest<UnreadCount>('/api/notifications/read-all', {
    method: 'PATCH',
  });
}
