import axiosInstance from "@/shared/api/axios.instance";

export const agentApi = {
  getProperties: () =>
    axiosInstance.get("/api/agent/properties"),

  getAppointments: () =>
    axiosInstance.get("/api/agent/appointments"),

  updateAppointmentStatus: (id: string, status: string) =>
    axiosInstance.patch(`/api/agent/appointments/${id}`, { status }),

  getPropertyLeads: (propertyId: string) =>
    axiosInstance.get(`/api/agent/properties/${propertyId}/leads`),
};
