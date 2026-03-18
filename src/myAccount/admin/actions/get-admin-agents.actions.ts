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
  try {
    const { data } = await adminApi.getAgents();
    return data;
  } catch (error) {
    console.error("[getAdminAgentsAction] Error al obtener agentes:", error);
    throw error;
  }
};

export const getAdminAgentSchedulesAction = async (
  agentId: number
): Promise<AgentSchedule[]> => {
  try {
    const { data } = await adminApi.getAgentSchedules(agentId);
    return data;
  } catch (error) {
    console.error("[getAdminAgentSchedulesAction] Error al obtener horarios:", error);
    throw error;
  }
};

export const createAdminAgentScheduleAction = async (
  agentId: number,
  payload: ScheduleFormPayload
): Promise<AgentSchedule> => {
  try {
    const { data } = await adminApi.createAgentSchedule(agentId, payload);
    return data;
  } catch (error) {
    console.error("[createAdminAgentScheduleAction] Error al crear horario:", error);
    throw error;
  }
};

export const updateAdminAgentScheduleAction = async (
  agentId: number,
  scheduleId: number,
  payload: Partial<ScheduleFormPayload>
): Promise<AgentSchedule> => {
  try {
    const { data } = await adminApi.updateAgentSchedule(agentId, scheduleId, payload);
    return data;
  } catch (error) {
    console.error("[updateAdminAgentScheduleAction] Error al actualizar horario:", error);
    throw error;
  }
};

export const deleteAdminAgentScheduleAction = async (
  agentId: number,
  scheduleId: number
): Promise<void> => {
  try {
    await adminApi.deleteAgentSchedule(agentId, scheduleId);
  } catch (error) {
    console.error("[deleteAdminAgentScheduleAction] Error al eliminar horario:", error);
    throw error;
  }
};

export const createAdminAgentAction = async (
  payload: CreateAgentPayload
): Promise<AdminAgent> => {
  try {
    const { data } = await adminApi.createAgent(payload);
    return data;
  } catch (error) {
    console.error("[createAdminAgentAction] Error al crear agente:", error);
    throw error;
  }
};

export const updateAdminAgentAction = async (
  id: number,
  payload: Partial<AgentFormPayload>
): Promise<AdminAgent> => {
  try {
    const { data } = await adminApi.updateAgent(id, payload);
    return data;
  } catch (error) {
    console.error("[updateAdminAgentAction] Error al actualizar agente:", error);
    throw error;
  }
};

export const uploadAdminAgentAvatarAction = async (
  agentId: number,
  file: File
): Promise<AdminAgent> => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await adminApi.updateAgentAvatar(agentId, formData);
    return data;
  } catch (error) {
    console.error("[uploadAdminAgentAvatarAction] Error al subir avatar:", error);
    throw error;
  }
};

export const deleteAdminAgentAction = async (id: number): Promise<void> => {
  try {
    await adminApi.deleteAgent(id);
  } catch (error) {
    console.error("[deleteAdminAgentAction] Error al eliminar agente:", error);
    throw error;
  }
};
