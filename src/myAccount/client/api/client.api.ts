import axiosInstance from "@/shared/api/axios.instance";

export const clientApi = {
  getPropertiesSale: () =>
    axiosInstance.get("/api/user/properties-sale/"),

  getPropertySaleDetail: (id: number) =>
    axiosInstance.get(`/api/user/property-sale/${id}`),

  getPropertiesBuys: () =>
    axiosInstance.get("/api/user/properties-buys/"),

  getPropertyFiles: (propertyId: number) =>
    axiosInstance.get(`/api/user/property-files/${propertyId}`),

  uploadPropertyFiles: (propertyId: number, formData: FormData) =>
    axiosInstance.post(`/api/user/property-files/${propertyId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getUserProfile: () =>
    axiosInstance.get("/api/user/profile"),

  getRecentActivity: () =>
    axiosInstance.get("/api/user/recent-activity"),
};
