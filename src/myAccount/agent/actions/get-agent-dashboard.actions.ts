import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { BackendAgentDashboard } from "@/myAccount/agent/api/agent.api";
import type { AgentDashboard } from "@/myAccount/agent/types/agent.types";

const mapDashboard = (raw: BackendAgentDashboard): AgentDashboard => ({
  agent: raw.agent,
  stats: {
    activeLeads: raw.stats.active_leads,
    todayAppointments: raw.stats.today_appointments,
    monthSales: raw.stats.month_sales,
  },
});

export const getAgentDashboardAction = async (): Promise<AgentDashboard | null> => {
  try {
    const { data } = await agentApi.getDashboard();
    return mapDashboard(data);
  } catch (error) {
    console.error("[getAgentDashboardAction] Error al obtener dashboard del agente:", error);
    return null;
  }
};
