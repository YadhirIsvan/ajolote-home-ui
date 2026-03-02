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
      return data as NotificationPreferences;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  };

export const updateClientNotificationPreferencesAction = async (
  prefs: NotificationPreferences
): Promise<void> => {
  await clientApi.updateNotificationPreferences(prefs);
};
