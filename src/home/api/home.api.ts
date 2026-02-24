import axiosInstance from "@/shared/api/axios.instance";

const homeApi = axiosInstance;

export const ENDPOINTS = {
  FEATURED_PROPERTIES: "/api/properties",
} as const;

export default homeApi;
