// ── Raw backend shapes (snake_case) ─────────────────────────────────
interface BackendNotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  reference_type: string;
  reference_id: number | null;
  created_at: string;
}

export interface BackendNotificationsResponse {
  count: number;
  unread_count: number;
  next: string | null;
  previous: string | null;
  results: BackendNotificationItem[];
}

// ── Clean domain types (camelCase) ───────────────────────────────────
export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  referenceType: string;
  referenceId: number | null;
  createdAt: string;
}

export interface NotificationsResult {
  count: number;
  unreadCount: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}
