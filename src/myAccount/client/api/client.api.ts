import { axiosInstance } from "@/shared/api/axios.instance";

export const clientApi = {
  getPropertiesSale: () => axiosInstance.get("/client/sales"),

  getPropertySaleDetail: (processId: number) =>
    axiosInstance.get(`/client/sales/${processId}`),

  getPropertiesBuys: () => axiosInstance.get("/client/purchases"),

  getPropertyDetail: (processId: number) =>
    axiosInstance.get(`/client/purchases/${processId}`),

  uploadPropertyFiles: (processId: number, formData: FormData) =>
    axiosInstance.post(`/client/purchases/${processId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserProfile: () => axiosInstance.get("/client/profile"),

  updateProfile: (data: Record<string, string>) =>
    axiosInstance.patch("/client/profile", data),

  getDashboard: () => axiosInstance.get("/client/dashboard"),

  getNotificationPreferences: () =>
    axiosInstance.get("/client/notification-preferences"),

  updateNotificationPreferences: (prefs: Record<string, boolean>) =>
    axiosInstance.put("/client/notification-preferences", prefs),
};
