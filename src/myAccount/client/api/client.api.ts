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

  getSavedProperties: () => axiosInstance.get("/client/saved-properties"),

  saveProperty: (propertyId: number) =>
    axiosInstance.post("/client/saved-properties", { property_id: propertyId }),

  unsaveProperty: (propertyId: number) =>
    axiosInstance.delete(`/client/saved-properties/${propertyId}`),

  checkSavedProperty: (propertyId: number) =>
    axiosInstance.get(`/client/saved-properties/check?property_id=${propertyId}`),

  getClientProfile: () => axiosInstance.get("/client/client-profile"),

  updateClientProfile: (data: Record<string, string>) =>
    axiosInstance.patch("/client/client-profile", data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return axiosInstance.post("/client/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
