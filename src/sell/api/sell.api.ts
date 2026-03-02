import { axiosInstance } from "@/shared/api/axios.instance";

export const ENDPOINTS = {
  SUBMIT_LEAD: "/public/seller-leads",
} as const;

export const sellApi = axiosInstance;
