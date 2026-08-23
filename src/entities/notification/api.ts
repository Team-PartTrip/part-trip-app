import { authRequest } from '../../shared/api/http';

export interface UnreadCount {
  unreadCount: number;
}

/** 상단 알림 배지에 쓸 안읽음 개수 (Func-004-01) */
export function getUnreadCount(): Promise<UnreadCount> {
  return authRequest<UnreadCount>('/api/notifications/unread-count', {
    method: 'GET',
  });
}
