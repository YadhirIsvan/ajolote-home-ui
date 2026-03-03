import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AgentDashboard } from "@/myAccount/agent/types/agent.types";

export const getAgentDashboardAction = async (): Promise<AgentDashboard | null> => {
  try {
    const { data } = await agentApi.getDashboard();
    return data as AgentDashboard;
  } catch {
    return null;
  }
};
