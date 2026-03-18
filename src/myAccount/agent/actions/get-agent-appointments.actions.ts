import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { BackendAppointment } from "@/myAccount/agent/api/agent.api";
import type { AgentAppointment } from "@/myAccount/agent/types/agent.types";

const formatTime = (time24: string): string => {
  const [hoursStr, minutes] = time24.split(":");
  const hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${period}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
};

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
    return [];
  }
};
