import { notificationsApi } from "@/notifications/api/notifications.api";

export const markNotificationReadAction = async (id: number): Promise<void> => {
  await notificationsApi.markRead(id);
};

export const markAllNotificationsReadAction = async (): Promise<void> => {
  await notificationsApi.markAllRead();
};
