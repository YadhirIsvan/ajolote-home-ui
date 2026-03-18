import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAppointment, AppointmentType, Paginated } from "@/myAccount/admin/types/admin.types";

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

export const getAdminAppointmentsAction = async (
  params?: GetAdminAppointmentsParams
): Promise<Paginated<AdminAppointment>> => {
  try {
    const { data } = await adminApi.getAppointments(params);
    return data;
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
    return data;
  } catch (error) {
    console.error("[createAdminAppointmentAction] Error al crear cita:", error);
    throw error;
  }
};

export const updateAdminAppointmentStatusAction = async (
  id: number,
  payload: { status: string; notes?: string }
): Promise<AdminAppointment> => {
  try {
    const { data } = await adminApi.updateAppointment(id, payload);
    return data;
  } catch (error) {
    console.error("[updateAdminAppointmentStatusAction] Error al actualizar cita:", error);
    throw error;
  }
};
