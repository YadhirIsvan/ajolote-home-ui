import { axiosInstance } from "@/shared/api/axios.instance";
import type { AppointmentStatus } from "@/myAccount/agent/types/agent.types";

export interface BackendAgentDashboard {
  agent: {
    id: number;
    name: string;
    avatar: string | null;
    zone: string;
    score: string;
  };
  stats: {
    active_leads: number;
    today_appointments: number;
    month_sales: number;
  };
}

export interface BackendAgentProperty {
  id: number;
  title: string;
  address: string;
  price: string;
  property_type: string;
  status: string;
  display_status: string;
  image: string | null;
  leads_count: number;
  assigned_at: string;
}

export interface BackendAppointment {
  id: number;
  matricula: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: AppointmentStatus;
  client_name: string;
  client_phone: string;
  property: { id: number; title: string };
}

export interface BackendLead {
  id: number;
  status: string;
  overall_progress: number;
  client: { name: string; email: string; phone: string };
  created_at: string;
  updated_at: string;
}

export interface BackendPaginatedResponse<T> {
  count: number;
  results: T[];
}

export const agentApi = {
  getDashboard: () =>
    axiosInstance.get<BackendAgentDashboard>("/agent/dashboard"),

  getProperties: () =>
    axiosInstance.get<BackendPaginatedResponse<BackendAgentProperty>>("/agent/properties"),

  getPropertyLeads: (propertyId: number) =>
    axiosInstance.get<BackendPaginatedResponse<BackendLead>>(
      `/agent/properties/${propertyId}/leads`
    ),

  getAppointments: (params?: { status?: string; date?: string }) =>
    axiosInstance.get<BackendPaginatedResponse<BackendAppointment>>(
      "/agent/appointments",
      { params }
    ),

  updateAppointmentStatus: (id: number, status: string, notes?: string) =>
    axiosInstance.patch<void>(`/agent/appointments/${id}/status`, {
      status,
      notes,
    }),
};
