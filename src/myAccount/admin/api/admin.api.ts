import { axiosInstance } from "@/shared/api/axios.instance";

export const adminApi = {
  // ─── Propiedades ────────────────────────────────────────────────────────────
  getProperties: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/properties", { params }),

  createProperty: (data: FormData | Record<string, unknown>) =>
    axiosInstance.post("/admin/properties", data),

  updateProperty: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/properties/${id}`, data),

  deleteProperty: (id: number) =>
    axiosInstance.delete(`/admin/properties/${id}`),

  uploadPropertyImages: (id: number, formData: FormData) =>
    axiosInstance.post(`/admin/properties/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  toggleFeatured: (id: number) =>
    axiosInstance.patch(`/admin/properties/${id}/toggle-featured`),

  // ─── Agentes ────────────────────────────────────────────────────────────────
  getAgents: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/agents", { params }),

  createAgent: (data: Record<string, unknown>) =>
    axiosInstance.post("/admin/agents", data),

  updateAgent: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/agents/${id}`, data),

  deleteAgent: (id: number) =>
    axiosInstance.delete(`/admin/agents/${id}`),

  // ─── Horarios de agente ─────────────────────────────────────────────────────
  getAgentSchedules: (agentId: number) =>
    axiosInstance.get(`/admin/agents/${agentId}/schedules`),

  createAgentSchedule: (agentId: number, data: Record<string, unknown>) =>
    axiosInstance.post(`/admin/agents/${agentId}/schedules`, data),

  updateAgentSchedule: (agentId: number, scheduleId: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/agents/${agentId}/schedules/${scheduleId}`, data),

  deleteAgentSchedule: (agentId: number, scheduleId: number) =>
    axiosInstance.delete(`/admin/agents/${agentId}/schedules/${scheduleId}`),

  // ─── Citas ──────────────────────────────────────────────────────────────────
  getAppointments: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/appointments", { params }),

  createAppointment: (data: Record<string, unknown>) =>
    axiosInstance.post("/admin/appointments", data),

  updateAppointment: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/appointments/${id}`, data),

  getAppointmentAvailability: (agentId: number, date: string) =>
    axiosInstance.get("/admin/appointments/availability", {
      params: { agent_id: agentId, date },
    }),

  // ─── Asignaciones (reemplaza el antiguo assignAgent que usaba endpoint inexistente) ─
  getAssignments: () => axiosInstance.get("/admin/assignments"),

  createAssignment: (propertyId: number, agentMembershipId: number, isVisible = true) =>
    axiosInstance.post("/admin/assignments", {
      property_id: propertyId,
      agent_membership_id: agentMembershipId,
      is_visible: isVisible,
    }),

  updateAssignment: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/assignments/${id}`, data),

  deleteAssignment: (id: number) =>
    axiosInstance.delete(`/admin/assignments/${id}`),

  // ─── Clientes ───────────────────────────────────────────────────────────────
  getClients: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/clients", { params }),

  getClientDetail: (id: number) =>
    axiosInstance.get(`/admin/clients/${id}`),

  // ─── Pipeline de compra (Kanban) ─────────────────────────────────────────────
  getPurchaseProcesses: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/purchase-processes", { params }),

  createPurchaseProcess: (data: Record<string, unknown>) =>
    axiosInstance.post("/admin/purchase-processes", data),

  updatePurchaseProcessStatus: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/purchase-processes/${id}/status`, data),

  // ─── Pipeline de venta ──────────────────────────────────────────────────────
  getSaleProcesses: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/sale-processes", { params }),

  createSaleProcess: (data: Record<string, unknown>) =>
    axiosInstance.post("/admin/sale-processes", data),

  updateSaleProcessStatus: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/sale-processes/${id}/status`, data),

  // ─── Seller Leads ───────────────────────────────────────────────────────────
  getSellerLeads: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/seller-leads", { params }),

  updateSellerLead: (id: number, data: Record<string, unknown>) =>
    axiosInstance.patch(`/admin/seller-leads/${id}`, data),

  convertSellerLead: (id: number, data: Record<string, unknown>) =>
    axiosInstance.post(`/admin/seller-leads/${id}/convert`, data),

  // ─── Historial ──────────────────────────────────────────────────────────────
  getSalesHistory: (params?: Record<string, unknown>) =>
    axiosInstance.get("/admin/history", { params }),

  // ─── Insights ───────────────────────────────────────────────────────────────
  getInsights: (period: string) =>
    axiosInstance.get("/admin/insights", { params: { period } }),
};
