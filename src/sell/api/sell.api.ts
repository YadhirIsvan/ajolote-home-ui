import { axiosInstance } from "@/shared/api/axios.instance";

export const ENDPOINTS = {
  SUBMIT_LEAD: "/public/sale-processes",
} as const;

export const sellApi = axiosInstance;
