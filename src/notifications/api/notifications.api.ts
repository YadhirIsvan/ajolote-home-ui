import { axiosInstance } from "@/shared/api/axios.instance";

export const notificationsApi = {
  getNotifications: (params?: { is_read?: boolean; limit?: number; offset?: number }) =>
    axiosInstance.get("/notifications/", { params }),

  markRead: (id: number) =>
    axiosInstance.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    axiosInstance.post("/notifications/read-all"),
};
