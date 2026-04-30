import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { BackendAppointment } from "@/myAccount/agent/api/agent.api";
import type { AgentAppointment } from "@/myAccount/agent/types/agent.types";
import { formatDate, formatTime } from "@/myAccount/agent/utils/agent.utils";

const mapItem = (item: BackendAppointment): AgentAppointment => ({
  id: item.id,
  client: item.client_name,
  property: item.property.title,
  date: formatDate(item.scheduled_date),
  time: formatTime(item.scheduled_time.slice(0, 5)),
  status: item.status,
  matricula: item.matricula,
  durationMinutes: item.duration_minutes,
  clientPhone: item.client_phone,
});

export const getAgentAppointmentsAction = async (): Promise<AgentAppointment[]> => {
  try {
    const { data } = await agentApi.getAppointments();
    return data.results.map(mapItem);
  } catch (error) {
    console.error("[getAgentAppointmentsAction] Error al obtener citas del agente:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las citas del agente"
    );
  }
};
