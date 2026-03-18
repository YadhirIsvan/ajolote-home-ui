import { axiosInstance } from "@/shared/api/axios.instance";
import type { BackendNotificationsResponse } from "@/notifications/types/notifications.types";

export const notificationsApi = {
  getNotifications: (params?: { is_read?: boolean; limit?: number; offset?: number }) =>
    axiosInstance.get<BackendNotificationsResponse>("/notifications/", { params }),

  markRead: (id: number) =>
    axiosInstance.patch<void>(`/notifications/${id}/read`),

  markAllRead: () =>
    axiosInstance.post<void>("/notifications/read-all"),
};
