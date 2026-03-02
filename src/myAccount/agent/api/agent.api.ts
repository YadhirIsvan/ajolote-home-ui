import { axiosInstance } from "@/shared/api/axios.instance";

export const agentApi = {
  getDashboard: () => axiosInstance.get("/agent/dashboard"),

  getProperties: () => axiosInstance.get("/agent/properties"),

  getPropertyLeads: (propertyId: number) =>
    axiosInstance.get(`/agent/properties/${propertyId}/leads`),

  getAppointments: (params?: { status?: string; date?: string }) =>
    axiosInstance.get("/agent/appointments", { params }),

  updateAppointmentStatus: (id: number, status: string, notes?: string) =>
    axiosInstance.patch(`/agent/appointments/${id}/status`, { status, notes }),
};
