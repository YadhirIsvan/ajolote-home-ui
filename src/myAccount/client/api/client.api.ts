import { axiosInstance } from "@/shared/api/axios.instance";
import type {
  UserProfile,
  PropertyFileItem,
  NotificationPreferences,
  ClientAppointment,
} from "@/myAccount/client/types/client.types";

export const clientApi = {
  getPropertiesSale: () =>
    axiosInstance.get("/client/sales"),

  getPropertySaleDetail: (processId: number) =>
    axiosInstance.get(`/client/sales/${processId}`),

  getPropertiesBuys: () =>
    axiosInstance.get("/client/purchases"),

  getPropertyDetail: (processId: number) =>
    axiosInstance.get(`/client/purchases/${processId}`),

  uploadPropertyFiles: (processId: number, formData: FormData) =>
    axiosInstance.post<void>(`/client/purchases/${processId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserProfile: () =>
    axiosInstance.get<UserProfile>("/client/profile"),

  updateProfile: (data: Record<string, string>) =>
    axiosInstance.patch<UserProfile>("/client/profile", data),

  getDashboard: () =>
    axiosInstance.get("/client/dashboard"),

  getNotificationPreferences: () =>
    axiosInstance.get<NotificationPreferences>("/client/notification-preferences"),

  updateNotificationPreferences: (prefs: NotificationPreferences) =>
    axiosInstance.put<void>("/client/notification-preferences", prefs),

  getSavedProperties: () =>
    axiosInstance.get("/client/saved-properties"),

  saveProperty: (propertyId: number) =>
    axiosInstance.post("/client/saved-properties", { property_id: propertyId }),

  unsaveProperty: (propertyId: number) =>
    axiosInstance.delete(`/client/saved-properties/${propertyId}`),

  checkSavedProperty: (propertyId: number) =>
    axiosInstance.get<{ is_saved: boolean }>(
      `/client/saved-properties/check?property_id=${propertyId}`
    ),

  getClientProfile: () =>
    axiosInstance.get("/client/profile-detail"),

  updateClientProfile: (data: Record<string, string>) =>
    axiosInstance.patch("/client/profile-detail", data),

  getFinancialProfile: () =>
    axiosInstance.get("/client/financial-profile"),

  getAppointments: () =>
    axiosInstance.get<ClientAppointment[]>("/client/appointments"),

  cancelAppointment: (id: number, reason?: string) =>
    axiosInstance.patch<ClientAppointment>(`/client/appointments/${id}/cancel`, { reason }),

  getPropertyFiles: (processId: number) =>
    axiosInstance.get<{ documents?: PropertyFileItem[] }>(`/client/purchases/${processId}`),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosInstance.post<{ avatar: string }>("/client/avatar-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
