import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAppointment, Paginated } from "@/myAccount/admin/types/admin.types";

export interface GetAdminAppointmentsParams {
  date?: string;
  agent_id?: number;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const getAdminAppointmentsAction = async (
  params?: GetAdminAppointmentsParams
): Promise<Paginated<AdminAppointment>> => {
  const { data } = await adminApi.getAppointments(params as Record<string, unknown>);
  return data as Paginated<AdminAppointment>;
};
