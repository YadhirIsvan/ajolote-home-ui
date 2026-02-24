import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AgentAppointment } from "@/myAccount/agent/types/agent.types";

const DEFAULT_APPOINTMENTS: AgentAppointment[] = [
  { id: "1", client: "María García", property: "Casa en Polanco", date: "15 Ene", time: "10:00 AM", status: "confirmada" },
  { id: "2", client: "Carlos Rodríguez", property: "Depto Roma Norte", date: "15 Ene", time: "2:00 PM", status: "programada" },
  { id: "3", client: "Ana Martínez", property: "Penthouse Santa Fe", date: "16 Ene", time: "11:00 AM", status: "en_progreso" },
  { id: "4", client: "Pedro López", property: "Casa en Polanco", date: "14 Ene", time: "4:00 PM", status: "completada" },
  { id: "5", client: "Laura Sánchez", property: "Depto Roma Norte", date: "13 Ene", time: "1:00 PM", status: "cancelada" },
  { id: "6", client: "Roberto Díaz", property: "Penthouse Santa Fe", date: "17 Ene", time: "9:00 AM", status: "reagendada" },
];

export const getAgentAppointmentsAction = async (): Promise<AgentAppointment[]> => {
  try {
    const { data } = await agentApi.getAppointments();
    return Array.isArray(data) ? (data as AgentAppointment[]) : DEFAULT_APPOINTMENTS;
  } catch {
    return DEFAULT_APPOINTMENTS;
  }
};
