import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAgent, AgentSchedule, Paginated } from "@/myAccount/admin/types/admin.types";

export interface AgentFormPayload {
  first_name: string;
  last_name: string;
  phone: string;
  zone: string;
  bio: string;
}

export interface CreateAgentPayload {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  zone: string;
  bio: string;
}

export interface ScheduleBreakPayload {
  break_type: string;
  name: string;
  start_time: string;
  end_time: string;
}

export interface ScheduleFormPayload {
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  start_time: string;
  end_time: string;
  has_lunch_break: boolean;
  lunch_start: string | null;
  lunch_end: string | null;
  is_active: boolean;
  priority: number;
  breaks: ScheduleBreakPayload[];
}

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

export const createAdminAgentScheduleAction = async (
  agentId: number,
  payload: ScheduleFormPayload
): Promise<AgentSchedule> => {
  const { data } = await adminApi.createAgentSchedule(agentId, payload as Record<string, unknown>);
  return data as AgentSchedule;
};

export const updateAdminAgentScheduleAction = async (
  agentId: number,
  scheduleId: number,
  payload: Partial<ScheduleFormPayload>
): Promise<AgentSchedule> => {
  const { data } = await adminApi.updateAgentSchedule(agentId, scheduleId, payload as Record<string, unknown>);
  return data as AgentSchedule;
};

export const deleteAdminAgentScheduleAction = async (
  agentId: number,
  scheduleId: number
): Promise<void> => {
  await adminApi.deleteAgentSchedule(agentId, scheduleId);
};

export const createAdminAgentAction = async (
  payload: CreateAgentPayload
): Promise<AdminAgent> => {
  const { data } = await adminApi.createAgent(payload as Record<string, unknown>);
  return data as AdminAgent;
};

export const updateAdminAgentAction = async (
  id: number,
  payload: Partial<AgentFormPayload>
): Promise<AdminAgent> => {
  const { data } = await adminApi.updateAgent(id, payload as Record<string, unknown>);
  return data as AdminAgent;
};

export const uploadAdminAgentAvatarAction = async (
  agentId: number,
  file: File
): Promise<AdminAgent> => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await adminApi.updateAgentAvatar(agentId, formData);
  return data as AdminAgent;
};

export const deleteAdminAgentAction = async (id: number): Promise<void> => {
  await adminApi.deleteAgent(id);
};
