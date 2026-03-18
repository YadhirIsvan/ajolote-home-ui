import { notificationsApi } from "@/notifications/api/notifications.api";
import type { NotificationsResult } from "@/notifications/types/notifications.types";

export interface GetNotificationsParams {
  isRead?: boolean;
  limit?: number;
  offset?: number;
}

const mapItem = (raw: {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  reference_type: string;
  reference_id: number | null;
  created_at: string;
}) => ({
  id: raw.id,
  title: raw.title,
  message: raw.message,
  notificationType: raw.notification_type,
  isRead: raw.is_read,
  referenceType: raw.reference_type,
  referenceId: raw.reference_id,
  createdAt: raw.created_at,
});

export const getNotificationsAction = async (
  params?: GetNotificationsParams
): Promise<NotificationsResult> => {
  try {
    const { data } = await notificationsApi.getNotifications({
      is_read: params?.isRead,
      limit: params?.limit,
      offset: params?.offset,
    });
    return {
      count: data.count,
      unreadCount: data.unread_count,
      next: data.next,
      previous: data.previous,
      results: data.results.map(mapItem),
    };
  } catch (error) {
    console.error("[getNotificationsAction] Error al obtener notificaciones:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error desconocido al obtener notificaciones"
    );
  }
};
