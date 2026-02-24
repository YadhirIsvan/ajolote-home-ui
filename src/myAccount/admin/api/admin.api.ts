import { axiosInstance } from "@/shared/api/axios.instance";

export const adminApi = {
  getProperties: () => axiosInstance.get("/admin/properties"),
  getAgents: () => axiosInstance.get("/admin/agents"),
  getAppointments: () => axiosInstance.get("/admin/appointments"),
  getClients: () => axiosInstance.get("/admin/clients"),
  getSalesHistory: () => axiosInstance.get("/admin/sales/history"),
  getInsights: (period: string) =>
    axiosInstance.get("/admin/insights", { params: { period } }),
  createProperty: (data: unknown) =>
    axiosInstance.post("/admin/properties", data),
  updateProperty: (id: string, data: unknown) =>
    axiosInstance.put(`/admin/properties/${id}`, data),
  deleteProperty: (id: string) =>
    axiosInstance.delete(`/admin/properties/${id}`),
  assignAgent: (propertyId: string, agentId: string) =>
    axiosInstance.patch(`/admin/properties/${propertyId}/assign`, { agentId }),
};
