import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AppointmentStatus } from "@/myAccount/agent/types/agent.types";

export interface UpdateAppointmentStatusResponse {
  success: boolean;
  message?: string;
}

export const updateAgentAppointmentStatusAction = async (
  id: number,
  status: AppointmentStatus,
  notes?: string
): Promise<UpdateAppointmentStatusResponse> => {
  try {
    await agentApi.updateAppointmentStatus(id, status, notes);
    return { success: true };
  } catch (error) {
    console.error("[updateAgentAppointmentStatusAction] Error al actualizar estado de cita:", error);
    return {
      success: false,
      message: "No se pudo actualizar el estado de la cita.",
    };
  }
};
