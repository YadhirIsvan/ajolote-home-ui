import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { BackendAdminAppointment, AdminAppointment, AppointmentType, Paginated } from "@/myAccount/admin/types/admin.types";

export interface GetAdminAppointmentsParams {
  date?: string;
  agent_id?: number;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CreateAdminAppointmentPayload {
  property_id: number;
  agent_membership_id: number;
  client_membership_id?: number | null;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes?: number | null;
  appointment_type?: AppointmentType;
  notes?: string;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapAdminAppointment = (b: BackendAdminAppointment): AdminAppointment => ({
  id: b.id,
  matricula: b.matricula,
  scheduledDate: b.scheduled_date,
  scheduledTime: b.scheduled_time,
  durationMinutes: b.duration_minutes,
  status: b.status,
  appointmentType: b.appointment_type as AppointmentType,
  clientName: b.client_name,
  clientEmail: b.client_email,
  clientPhone: b.client_phone,
  property: b.property,
  agent: b.agent,
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getAdminAppointmentsAction = async (
  params?: GetAdminAppointmentsParams
): Promise<Paginated<AdminAppointment>> => {
  try {
    const { data } = await adminApi.getAppointments(params);
    return { ...data, results: data.results.map(mapAdminAppointment) };
  } catch (error) {
    console.error("[getAdminAppointmentsAction] Error al obtener citas:", error);
    throw error;
  }
};

export const createAdminAppointmentAction = async (
  payload: CreateAdminAppointmentPayload
): Promise<AdminAppointment> => {
  try {
    const { data } = await adminApi.createAppointment(payload);
    return mapAdminAppointment(data);
  } catch (error) {
    console.error("[createAdminAppointmentAction] Error al crear cita:", error);
    throw error;
  }
};

export const getAdminAppointmentAvailabilityAction = async (
  agentMembershipId: number,
  date: string
): Promise<string[]> => {
  try {
    const { data } = await adminApi.getAppointmentAvailability(agentMembershipId, date);
    return data.available_slots ?? [];
  } catch (error) {
    console.error("[getAdminAppointmentAvailabilityAction] Error al obtener disponibilidad:", error);
    return [];
  }
};

export const updateAdminAppointmentStatusAction = async (
  id: number,
  payload: { status: string; notes?: string }
): Promise<AdminAppointment> => {
  try {
    const { data } = await adminApi.updateAppointment(id, payload);
    return mapAdminAppointment(data);
  } catch (error) {
    console.error("[updateAdminAppointmentStatusAction] Error al actualizar cita:", error);
    throw error;
  }
};
