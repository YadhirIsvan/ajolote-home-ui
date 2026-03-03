import { notificationsApi } from "@/notifications/api/notifications.api";
import type { NotificationsResponse } from "@/notifications/types/notifications.types";

export const getNotificationsAction = async (params?: {
  is_read?: boolean;
  limit?: number;
  offset?: number;
}): Promise<NotificationsResponse> => {
  const { data } = await notificationsApi.getNotifications(params);
  return data as NotificationsResponse;
};
