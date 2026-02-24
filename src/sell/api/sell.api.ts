import axiosInstance from "@/shared/api/axios.instance";

const sellApi = axiosInstance;

export const ENDPOINTS = {
  SUBMIT_LEAD: "/api/seller-leads/",
} as const;

export default sellApi;
