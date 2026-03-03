export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  reference_type: string;
  reference_id: number | null;
  created_at: string;
}

export interface NotificationsResponse {
  count: number;
  unread_count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}
