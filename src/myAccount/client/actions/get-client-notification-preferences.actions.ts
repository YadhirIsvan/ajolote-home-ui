import { clientApi } from "@/myAccount/client/api/client.api";
import type { NotificationPreferences } from "@/myAccount/client/types/client.types";

const DEFAULT_PREFERENCES: NotificationPreferences = {
  new_properties: false,
  price_updates: false,
  appointment_reminders: false,
  offers: false,
};

export const getClientNotificationPreferencesAction =
  async (): Promise<NotificationPreferences> => {
    try {
      const { data } = await clientApi.getNotificationPreferences();
      return data;
    } catch (error) {
      console.error("[getClientNotificationPreferencesAction] Error al obtener preferencias:", error);
      return DEFAULT_PREFERENCES;
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
