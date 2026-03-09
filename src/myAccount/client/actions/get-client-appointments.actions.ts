import { clientApi } from "@/myAccount/client/api/client.api";
import type { ClientAppointment } from "@/myAccount/client/types/client.types";

export const getClientAppointmentsAction = async (): Promise<ClientAppointment[]> => {
  try {
    const { data } = await clientApi.getAppointments();
    return data as ClientAppointment[];
  } catch {
    return [];
  }
};

export const cancelClientAppointmentAction = async (
  id: number,
  reason?: string
): Promise<ClientAppointment | null> => {
  const { data } = await clientApi.cancelAppointment(id, reason);
  return data as ClientAppointment;
};
