import { axiosInstance } from "@/shared/api/axios.instance";

export const ENDPOINTS = {
  PROPERTIES: "/public/properties",
  PROPERTY_DETAIL: (id: number) => `/public/properties/${id}`,
  SCHEDULE_APPOINTMENT: (id: number) => `/public/properties/${id}/appointment`,
  APPOINTMENT_SLOTS: "/public/appointment/slots",
} as const;

export const buyApi = axiosInstance;
