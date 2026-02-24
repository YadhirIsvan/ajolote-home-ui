import axiosInstance from "@/shared/api/axios.instance";

const buyApi = axiosInstance;

export const ENDPOINTS = {
  PROPERTIES: "/api/properties",
  PROPERTY_DETAIL: (id: number) => `/api/properties/${id}/`,
} as const;

export default buyApi;
