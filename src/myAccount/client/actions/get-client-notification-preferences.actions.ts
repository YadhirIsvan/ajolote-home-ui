import { clientApi } from "@/myAccount/client/api/client.api";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "@/myAccount/client/constants/client.constants";
import type { NotificationPreferences } from "@/myAccount/client/types/client.types";

export const getClientNotificationPreferencesAction =
  async (): Promise<NotificationPreferences> => {
    try {
      const { data } = await clientApi.getNotificationPreferences();
      return data;
    } catch (error) {
      console.error("[getClientNotificationPreferencesAction] Error al obtener preferencias:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener preferencias de notificación"
      );
    }
  };

export const updateClientNotificationPreferencesAction = async (
  prefs: NotificationPreferences
): Promise<void> => {
  try {
    await clientApi.updateNotificationPreferences(prefs);
  } catch (error) {
    console.error("[updateClientNotificationPreferencesAction] Error al actualizar preferencias:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al actualizar preferencias de notificación"
    );
  }
};

export { DEFAULT_NOTIFICATION_PREFERENCES };
