import { notificationsApi } from "@/notifications/api/notifications.api";

export const markNotificationReadAction = async (id: number): Promise<void> => {
  try {
    await notificationsApi.markRead(id);
  } catch (error) {
    console.error("[markNotificationReadAction] Error al marcar notificación como leída:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al marcar notificación como leída"
    );
  }
};

export const markAllNotificationsReadAction = async (): Promise<void> => {
  try {
    await notificationsApi.markAllRead();
  } catch (error) {
    console.error("[markAllNotificationsReadAction] Error al marcar todas las notificaciones como leídas:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al marcar notificaciones como leídas"
    );
  }
};
