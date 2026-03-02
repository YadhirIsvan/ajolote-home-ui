import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAgent, AgentSchedule, Paginated } from "@/myAccount/admin/types/admin.types";

export const getAdminAgentsAction = async (): Promise<Paginated<AdminAgent>> => {
  const { data } = await adminApi.getAgents();
  return data as Paginated<AdminAgent>;
};

export const getAdminAgentSchedulesAction = async (
  agentId: number
): Promise<AgentSchedule[]> => {
  const { data } = await adminApi.getAgentSchedules(agentId);
  return data as AgentSchedule[];
};

export const deleteAdminAgentAction = async (id: number): Promise<void> => {
  await adminApi.deleteAgent(id);
};
