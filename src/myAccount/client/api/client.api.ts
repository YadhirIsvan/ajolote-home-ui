import { axiosInstance } from "@/shared/api/axios.instance";

const ENDPOINTS = {
  PROPERTIES_SALE: "/client/sales",
  PROPERTY_SALE_DETAIL: (id: number) => `/client/sales/${id}`,
  PROPERTIES_BUY: "/client/purchases",
  PROPERTY_BUY_DETAIL: (id: number) => `/client/purchases/${id}`,
  PURCHASE_DOCUMENTS: (id: number) => `/client/purchases/${id}/documents`,
  USER_PROFILE: "/client/profile",
  DASHBOARD: "/client/dashboard",
  NOTIFICATION_PREFERENCES: "/client/notification-preferences",
  SAVED_PROPERTIES: "/client/saved-properties",
  SAVED_PROPERTY_CHECK: "/client/saved-properties/check",
  CLIENT_PROFILE: "/client/profile-detail",
  FINANCIAL_PROFILE: "/client/financial-profile",
  APPOINTMENTS: "/client/appointments",
  CANCEL_APPOINTMENT: (id: number) => `/client/appointments/${id}/cancel`,
  AVATAR_UPLOAD: "/client/avatar-upload",
} as const;
import type {
  UserProfile,
  PropertyFileItem,
  NotificationPreferences,
  ClientAppointment,
} from "@/myAccount/client/types/client.types";

export const clientApi = {
  getPropertiesSale: () =>
    axiosInstance.get(ENDPOINTS.PROPERTIES_SALE),

  getPropertySaleDetail: (processId: number) =>
    axiosInstance.get(ENDPOINTS.PROPERTY_SALE_DETAIL(processId)),

  getPropertiesBuys: () =>
    axiosInstance.get(ENDPOINTS.PROPERTIES_BUY),

  getPropertyDetail: (processId: number) =>
    axiosInstance.get(ENDPOINTS.PROPERTY_BUY_DETAIL(processId)),

  uploadPropertyFiles: (processId: number, formData: FormData) =>
    axiosInstance.post<void>(ENDPOINTS.PURCHASE_DOCUMENTS(processId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserProfile: () =>
    axiosInstance.get<UserProfile>(ENDPOINTS.USER_PROFILE),

  updateProfile: (data: Record<string, string>) =>
    axiosInstance.patch<UserProfile>(ENDPOINTS.USER_PROFILE, data),

  getDashboard: () =>
    axiosInstance.get(ENDPOINTS.DASHBOARD),

  getNotificationPreferences: () =>
    axiosInstance.get<NotificationPreferences>(ENDPOINTS.NOTIFICATION_PREFERENCES),

  updateNotificationPreferences: (prefs: NotificationPreferences) =>
    axiosInstance.put<void>(ENDPOINTS.NOTIFICATION_PREFERENCES, prefs),

  getSavedProperties: () =>
    axiosInstance.get(ENDPOINTS.SAVED_PROPERTIES),

  saveProperty: (propertyId: number) =>
    axiosInstance.post(ENDPOINTS.SAVED_PROPERTIES, { property_id: propertyId }),

  unsaveProperty: (propertyId: number) =>
    axiosInstance.delete(`${ENDPOINTS.SAVED_PROPERTIES}/${propertyId}`),

  checkSavedProperty: (propertyId: number) =>
    axiosInstance.get<{ is_saved: boolean }>(
      `${ENDPOINTS.SAVED_PROPERTY_CHECK}?property_id=${propertyId}`
    ),

  getClientProfile: () =>
    axiosInstance.get(ENDPOINTS.CLIENT_PROFILE),

  updateClientProfile: (data: Record<string, string>) =>
    axiosInstance.patch(ENDPOINTS.CLIENT_PROFILE, data),

  getFinancialProfile: () =>
    axiosInstance.get(ENDPOINTS.FINANCIAL_PROFILE),

  getAppointments: () =>
    axiosInstance.get<ClientAppointment[]>(ENDPOINTS.APPOINTMENTS),

  cancelAppointment: (id: number, reason?: string) =>
    axiosInstance.patch<ClientAppointment>(ENDPOINTS.CANCEL_APPOINTMENT(id), { reason }),

  getPropertyFiles: (processId: number) =>
    axiosInstance.get<{ documents?: PropertyFileItem[] }>(ENDPOINTS.PROPERTY_BUY_DETAIL(processId)),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosInstance.post<{ avatar: string; avatar_medium?: string }>(
      ENDPOINTS.AVATAR_UPLOAD,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  },
};
