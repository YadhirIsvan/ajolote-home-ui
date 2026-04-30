import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AppointmentStatus } from "@/myAccount/agent/types/agent.types";

export const updateAgentAppointmentStatusAction = async (
  id: number,
  status: AppointmentStatus,
  notes?: string
): Promise<void> => {
  try {
    await agentApi.updateAppointmentStatus(id, status, notes);
  } catch (error) {
    console.error("[updateAgentAppointmentStatusAction] Error al actualizar estado de cita:", error);
    throw new Error(
      error instanceof Error ? error.message : "No se pudo actualizar el estado de la cita"
    );
  }
};
