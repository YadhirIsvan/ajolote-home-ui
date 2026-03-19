import { axiosInstance } from "@/shared/api/axios.instance";
import type { Paginated } from "@/myAccount/admin/types/admin.types";

// ─── Backend raw types (snake_case — mirrors actual API responses) ─────────────

export interface BackendAdminProperty {
  id: number;
  title: string;
  address: string;
  price: string;
  currency: string;
  property_type: string;
  listing_type: string;
  status: string;
  is_featured: boolean;
  is_verified: boolean;
  is_active: boolean;
  image: string | null;
  agent: { id: number; name: string } | null;
  documents_count: number;
  created_at: string;
}

export interface BackendAdminPropertyImage {
  id: number;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

export interface BackendAdminPropertyDetail extends BackendAdminProperty {
  description: string;
  property_condition: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  construction_sqm: string;
  land_sqm: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_zip: string;
  city: { id: number; name: string; state_id: number } | null;
  zone: string;
  video_id: string;
  latitude: string;
  longitude: string;
  images: BackendAdminPropertyImage[];
  amenities: { id: number; name: string; icon: string }[];
}

export interface BackendCatalogState {
  id: number;
  name: string;
  code: string;
  country_id: number;
}

export interface BackendCatalogCity {
  id: number;
  name: string;
  state_id: number;
}

export interface BackendCatalogAmenity {
  id: number;
  name: string;
  icon: string;
}

export interface BackendAdminAgent {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  zone: string;
  bio: string;
  score: string;
  properties_count: number;
  sales_count: number;
  leads_count: number;
  active_leads: number;
}

export interface BackendAgentScheduleBreak {
  id: number;
  break_type: string;
  name: string;
  start_time: string;
  end_time: string;
}

export interface BackendAgentSchedule {
  id: number;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_time: string;
  end_time: string;
  has_lunch_break: boolean;
  lunch_start: string | null;
  lunch_end: string | null;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  priority: number;
  breaks: BackendAgentScheduleBreak[];
}

export interface BackendAdminAppointment {
  id: number;
  matricula: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  appointment_type: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  property: { id: number; title: string };
  agent: { id: number; name: string };
}

export interface BackendAdminAssignmentProperty {
  id: number;
  title: string;
  property_type: string;
}

export interface BackendAdminAssignmentAgent {
  id: number;
  membership_id: number;
  name: string;
  is_visible: boolean;
}

export interface BackendAdminAssignment {
  property: BackendAdminAssignmentProperty;
  agents: BackendAdminAssignmentAgent[];
}

export interface BackendAdminAssignmentsResponse {
  unassigned_properties: BackendAdminAssignmentProperty[];
  assignments: BackendAdminAssignment[];
}

export interface BackendSaleProcessAssignmentEntry {
  sale_process_id: number;
  property: {
    id: number;
    title: string;
    property_type: string;
    image: string | null;
    price: string | null;
    address: string;
  };
  status: string;
  agent: { membership_id: number; name: string } | null;
}

export interface BackendSaleProcessAssignmentsResponse {
  unassigned: BackendSaleProcessAssignmentEntry[];
  assigned: BackendSaleProcessAssignmentEntry[];
}

export interface BackendAdminClient {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchase_processes_count: number;
  sale_processes_count: number;
  date_joined: string;
}

export interface BackendAdminClientPurchaseProcess {
  id: number;
  status: string;
  overall_progress: number;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  documents: { id: number; name: string; uploaded_at: string }[];
  created_at: string;
}

export interface BackendAdminClientSaleProcess {
  id: number;
  status: string;
  property: { id: number; title: string; image: string | null };
  agent: { name: string };
  created_at: string;
}

export interface BackendAdminClientDetail {
  id: number;
  membership_id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  city: string;
  purchase_processes: BackendAdminClientPurchaseProcess[];
  sale_processes: BackendAdminClientSaleProcess[];
}

export interface BackendAdminPurchaseProcess {
  id: number;
  status: string;
  overall_progress: number;
  client: { id: number; name: string; avatar: string | null };
  property: { id: number; title: string; image: string | null; price: string };
  agent: { id: number; name: string };
  created_at: string;
  updated_at: string;
}

export interface BackendAdminSaleProcess {
  id: number;
  status: string;
  property: { id: number; title: string; image: string | null };
  client: { id: number; name: string } | null;
  agent: { id: number; name: string } | null;
  created_at: string;
  updated_at: string;
}

export interface BackendAdminSellerLead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  property_type: string;
  location: string;
  expected_price: string;
  status: string;
  assigned_agent: { id: number; name: string } | null;
  created_at: string;
}

export interface BackendAdminSaleHistoryItem {
  id: number;
  property: { title: string; property_type: string; zone: string };
  client: { name: string };
  agent: { name: string };
  sale_price: string;
  payment_method: string;
  closed_at: string;
}

export interface BackendAdminInsights {
  period: string;
  sales_by_month: { month: string; count: number; total_amount: string }[];
  distribution_by_type: { property_type: string; count: number; percentage: number }[];
  activity_by_zone: { zone: string; views: number; leads: number; sales: number }[];
  top_agents: { id: number; name: string; sales_count: number; leads_count: number; score: string }[];
  summary: {
    total_properties: number;
    total_sales: number;
    total_revenue: string;
    active_leads: number;
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const adminApi = {
  // ─── Propiedades ────────────────────────────────────────────────────────────
  getProperties: (params?: object) =>
    axiosInstance.get<Paginated<BackendAdminProperty>>("/admin/properties", { params }),

  createProperty: (data: FormData | object) =>
    axiosInstance.post<BackendAdminPropertyDetail>("/admin/properties", data),

  updateProperty: (id: number, data: object) =>
    axiosInstance.patch<BackendAdminPropertyDetail>(`/admin/properties/${id}`, data),

  deleteProperty: (id: number) =>
    axiosInstance.delete<void>(`/admin/properties/${id}`),

  uploadPropertyImages: (id: number, formData: FormData) =>
    axiosInstance.post<BackendAdminPropertyImage[]>(
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
    axiosInstance.get<BackendAdminPropertyDetail>(`/admin/properties/${id}`),

  deletePropertyImage: (propertyId: number, imageId: number) =>
    axiosInstance.delete<void>(
      `/admin/properties/${propertyId}/images/${imageId}`
    ),

  getStates: () =>
    axiosInstance.get<Paginated<BackendCatalogState>>("/catalogs/states", {
      params: { country_id: 1 },
    }),

  getCities: (stateId: number) =>
    axiosInstance.get<Paginated<BackendCatalogCity>>("/catalogs/cities", {
      params: { state_id: stateId },
    }),

  getAmenities: () =>
    axiosInstance.get<Paginated<BackendCatalogAmenity>>("/catalogs/amenities"),

  // ─── Agentes ────────────────────────────────────────────────────────────────
  getAgents: (params?: object) =>
    axiosInstance.get<Paginated<BackendAdminAgent>>("/admin/agents", { params }),

  createAgent: (data: object) =>
    axiosInstance.post<BackendAdminAgent>("/admin/agents", data),

  updateAgent: (id: number, data: object) =>
    axiosInstance.patch<BackendAdminAgent>(`/admin/agents/${id}`, data),

  updateAgentAvatar: (id: number, formData: FormData) =>
    axiosInstance.patch<BackendAdminAgent>(`/admin/agents/${id}`, formData, {
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
    axiosInstance.get<BackendAgentSchedule[]>(
      `/admin/agents/${agentId}/schedules`
    ),

  createAgentSchedule: (agentId: number, data: object) =>
    axiosInstance.post<BackendAgentSchedule>(
      `/admin/agents/${agentId}/schedules`,
      data
    ),

  updateAgentSchedule: (
    agentId: number,
    scheduleId: number,
    data: object
  ) =>
    axiosInstance.patch<BackendAgentSchedule>(
      `/admin/agents/${agentId}/schedules/${scheduleId}`,
      data
    ),

  deleteAgentSchedule: (agentId: number, scheduleId: number) =>
    axiosInstance.delete<void>(
      `/admin/agents/${agentId}/schedules/${scheduleId}`
    ),

  // ─── Citas ──────────────────────────────────────────────────────────────────
  getAppointments: (params?: object) =>
    axiosInstance.get<Paginated<BackendAdminAppointment>>("/admin/appointments", {
      params,
    }),

  createAppointment: (data: object) =>
    axiosInstance.post<BackendAdminAppointment>("/admin/appointments", data),

  updateAppointment: (id: number, data: object) =>
    axiosInstance.patch<BackendAdminAppointment>(
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
    axiosInstance.get<BackendAdminAssignmentsResponse>("/admin/assignments"),

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
    axiosInstance.get<BackendSaleProcessAssignmentsResponse>(
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
    axiosInstance.get<Paginated<BackendAdminClient>>("/admin/clients", { params }),

  getClientDetail: (id: number) =>
    axiosInstance.get<BackendAdminClientDetail>(`/admin/clients/${id}`),

  // ─── Pipeline de compra (Kanban) ─────────────────────────────────────────────
  getPurchaseProcesses: (params?: object) =>
    axiosInstance.get<Paginated<BackendAdminPurchaseProcess>>(
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
    axiosInstance.get<Paginated<BackendAdminSaleProcess>>("/admin/sale-processes", {
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
    axiosInstance.get<Paginated<BackendAdminSellerLead>>("/admin/seller-leads", {
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
    axiosInstance.get<Paginated<BackendAdminSaleHistoryItem>>("/admin/history", {
      params,
    }),

  // ─── Insights ───────────────────────────────────────────────────────────────
  getInsights: (period: string) =>
    axiosInstance.get<BackendAdminInsights>("/admin/insights", {
      params: { period },
    }),
};
