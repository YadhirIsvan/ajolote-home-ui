import { clientApi } from "@/myAccount/client/api/client.api";
import type { ClientAppointment } from "@/myAccount/client/types/client.types";

export const getClientAppointmentsAction = async (): Promise<ClientAppointment[]> => {
  try {
    const { data } = await clientApi.getAppointments();
    return data;
  } catch (error) {
    console.error("[getClientAppointmentsAction] Error al obtener citas:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las citas"
    );
  }
};

export const cancelClientAppointmentAction = async (
  id: number,
  reason?: string
): Promise<ClientAppointment | null> => {
  try {
    const { data } = await clientApi.cancelAppointment(id, reason);
    return data;
  } catch (error) {
    console.error("[cancelClientAppointmentAction] Error al cancelar cita:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al cancelar la cita"
    );
  }
};
