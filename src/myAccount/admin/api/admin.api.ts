import { axiosInstance } from "@/shared/api/axios.instance";
import type {
  AdminProperty,
  AdminPropertyDetail,
  AdminPropertyImage,
  AdminAgent,
  AgentSchedule,
  AdminAppointment,
  AdminAssignmentsResponse,
  SaleProcessAssignmentsResponse,
  AdminClient,
  AdminClientDetail,
  AdminPurchaseProcess,
  AdminSaleProcess,
  AdminSellerLead,
  AdminSaleHistoryItem,
  AdminInsights,
  CatalogState,
  CatalogCity,
  CatalogAmenity,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

export const adminApi = {
  // ─── Propiedades ────────────────────────────────────────────────────────────
  getProperties: (params?: object) =>
    axiosInstance.get<Paginated<AdminProperty>>("/admin/properties", { params }),

  createProperty: (data: FormData | object) =>
    axiosInstance.post<AdminPropertyDetail>("/admin/properties", data),

  updateProperty: (id: number, data: object) =>
    axiosInstance.patch<AdminPropertyDetail>(`/admin/properties/${id}`, data),

  deleteProperty: (id: number) =>
    axiosInstance.delete<void>(`/admin/properties/${id}`),

  uploadPropertyImages: (id: number, formData: FormData) =>
    axiosInstance.post<AdminPropertyImage[]>(
      `/admin/properties/${id}/images`,
      formData,
      {
        transformRequest: [
          (data: unknown, headers: Record<string, string>) => {
            if (headers) {
              delete headers["Content-Type"];
              delete headers["content-type"];
            }
            return data;
          },
        ],
      }
    ),

  toggleFeatured: (id: number) =>
    axiosInstance.patch<{ is_featured: boolean }>(
      `/admin/properties/${id}/toggle-featured`
    ),

  getPropertyDetail: (id: number) =>
    axiosInstance.get<AdminPropertyDetail>(`/admin/properties/${id}`),

  deletePropertyImage: (propertyId: number, imageId: number) =>
    axiosInstance.delete<void>(
      `/admin/properties/${propertyId}/images/${imageId}`
    ),

  getStates: () =>
    axiosInstance.get<Paginated<CatalogState>>("/catalogs/states", {
      params: { country_id: 1 },
    }),

  getCities: (stateId: number) =>
    axiosInstance.get<Paginated<CatalogCity>>("/catalogs/cities", {
      params: { state_id: stateId },
    }),

  getAmenities: () =>
    axiosInstance.get<Paginated<CatalogAmenity>>("/catalogs/amenities"),

  // ─── Agentes ────────────────────────────────────────────────────────────────
  getAgents: (params?: object) =>
    axiosInstance.get<Paginated<AdminAgent>>("/admin/agents", { params }),

  createAgent: (data: object) =>
    axiosInstance.post<AdminAgent>("/admin/agents", data),

  updateAgent: (id: number, data: object) =>
    axiosInstance.patch<AdminAgent>(`/admin/agents/${id}`, data),

  updateAgentAvatar: (id: number, formData: FormData) =>
    axiosInstance.patch<AdminAgent>(`/admin/agents/${id}`, formData, {
      transformRequest: [
        (data: unknown, headers: Record<string, string>) => {
          if (headers) {
            delete headers["Content-Type"];
            delete headers["content-type"];
          }
          return data;
        },
      ],
    }),

  deleteAgent: (id: number) =>
    axiosInstance.delete<void>(`/admin/agents/${id}`),

  // ─── Horarios de agente ─────────────────────────────────────────────────────
  getAgentSchedules: (agentId: number) =>
    axiosInstance.get<AgentSchedule[]>(
      `/admin/agents/${agentId}/schedules`
    ),

  createAgentSchedule: (agentId: number, data: object) =>
    axiosInstance.post<AgentSchedule>(
      `/admin/agents/${agentId}/schedules`,
      data
    ),

  updateAgentSchedule: (
    agentId: number,
    scheduleId: number,
    data: object
  ) =>
    axiosInstance.patch<AgentSchedule>(
      `/admin/agents/${agentId}/schedules/${scheduleId}`,
      data
    ),

  deleteAgentSchedule: (agentId: number, scheduleId: number) =>
    axiosInstance.delete<void>(
      `/admin/agents/${agentId}/schedules/${scheduleId}`
    ),

  // ─── Citas ──────────────────────────────────────────────────────────────────
  getAppointments: (params?: object) =>
    axiosInstance.get<Paginated<AdminAppointment>>("/admin/appointments", {
      params,
    }),

  createAppointment: (data: object) =>
    axiosInstance.post<AdminAppointment>("/admin/appointments", data),

  updateAppointment: (id: number, data: object) =>
    axiosInstance.patch<AdminAppointment>(
      `/admin/appointments/${id}`,
      data
    ),

  getAppointmentAvailability: (agentId: number, date: string) =>
    axiosInstance.get<{ available_slots: string[] }>(
      "/admin/appointments/availability",
      { params: { agent_id: agentId, date } }
    ),

  // ─── Asignaciones ───────────────────────────────────────────────────────────
  getAssignments: () =>
    axiosInstance.get<AdminAssignmentsResponse>("/admin/assignments"),

  createAssignment: (
    propertyId: number,
    agentMembershipId: number,
    isVisible = true
  ) =>
    axiosInstance.post<void>("/admin/assignments", {
      property_id: propertyId,
      agent_membership_id: agentMembershipId,
      is_visible: isVisible,
    }),

  updateAssignment: (id: number, data: object) =>
    axiosInstance.patch<void>(`/admin/assignments/${id}`, data),

  deleteAssignment: (id: number) =>
    axiosInstance.delete<void>(`/admin/assignments/${id}`),

  // ─── Asignaciones SaleProcess ────────────────────────────────────────────────
  getSaleProcessAssignments: () =>
    axiosInstance.get<SaleProcessAssignmentsResponse>(
      "/admin/sale-processes/assignments"
    ),

  assignSaleProcessAgent: (
    saleProcessId: number,
    agentMembershipId: number
  ) =>
    axiosInstance.post<void>(
      `/admin/sale-processes/${saleProcessId}/assign`,
      { agent_membership_id: agentMembershipId }
    ),

  unassignSaleProcessAgent: (saleProcessId: number) =>
    axiosInstance.post<void>(
      `/admin/sale-processes/${saleProcessId}/unassign`
    ),

  // ─── Clientes ───────────────────────────────────────────────────────────────
  getClients: (params?: object) =>
    axiosInstance.get<Paginated<AdminClient>>("/admin/clients", { params }),

  getClientDetail: (id: number) =>
    axiosInstance.get<AdminClientDetail>(`/admin/clients/${id}`),

  // ─── Pipeline de compra (Kanban) ─────────────────────────────────────────────
  getPurchaseProcesses: (params?: object) =>
    axiosInstance.get<Paginated<AdminPurchaseProcess>>(
      "/admin/purchase-processes",
      { params }
    ),

  createPurchaseProcess: (data: object) =>
    axiosInstance.post<void>("/admin/purchase-processes", data),

  updatePurchaseProcessStatus: (id: number, data: object) =>
    axiosInstance.patch<void>(
      `/admin/purchase-processes/${id}/status`,
      data
    ),

  // ─── Pipeline de venta ──────────────────────────────────────────────────────
  getSaleProcesses: (params?: object) =>
    axiosInstance.get<Paginated<AdminSaleProcess>>("/admin/sale-processes", {
      params,
    }),

  createSaleProcess: (data: object) =>
    axiosInstance.post<void>("/admin/sale-processes", data),

  updateSaleProcessStatus: (id: number, data: object) =>
    axiosInstance.patch<void>(
      `/admin/sale-processes/${id}/status`,
      data
    ),

  // ─── Seller Leads ───────────────────────────────────────────────────────────
  getSellerLeads: (params?: object) =>
    axiosInstance.get<Paginated<AdminSellerLead>>("/admin/seller-leads", {
      params,
    }),

  updateSellerLead: (id: number, data: object) =>
    axiosInstance.patch<void>(`/admin/seller-leads/${id}`, data),

  convertSellerLead: (id: number, data: object) =>
    axiosInstance.post<{
      property_id: number;
      sale_process_id: number;
      message: string;
    }>(`/admin/seller-leads/${id}/convert`, data),

  // ─── Historial ──────────────────────────────────────────────────────────────
  getSalesHistory: (params?: object) =>
    axiosInstance.get<Paginated<AdminSaleHistoryItem>>("/admin/history", {
      params,
    }),

  // ─── Insights ───────────────────────────────────────────────────────────────
  getInsights: (period: string) =>
    axiosInstance.get<AdminInsights>("/admin/insights", {
      params: { period },
    }),
};
