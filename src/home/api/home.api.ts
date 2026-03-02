import { axiosInstance } from "@/shared/api/axios.instance";

export const ENDPOINTS = {
  FEATURED_PROPERTIES: "/public/properties",
} as const;

export const homeApi = axiosInstance;
