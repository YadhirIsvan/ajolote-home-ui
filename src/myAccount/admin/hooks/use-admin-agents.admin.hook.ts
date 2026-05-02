import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminAgentsAction,
  getAdminAgentSchedulesAction,
  createAdminAgentScheduleAction,
  updateAdminAgentScheduleAction,
  deleteAdminAgentScheduleAction,
  createAdminAgentAction,
  updateAdminAgentAction,
  uploadAdminAgentAvatarAction,
  deleteAdminAgentAction,
  type CreateAgentPayload,
  type AgentFormPayload,
  type ScheduleFormPayload,
} from "@/myAccount/admin/actions/get-admin-agents.actions";

interface UseAdminAgentsOptions {
  selectedAgentId?: number | null;
  isSchedulerOpen: boolean;
}

export const useAdminAgents = ({ selectedAgentId, isSchedulerOpen }: UseAdminAgentsOptions) => {
  const queryClient = useQueryClient();

  const invalidateAgents = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
  const invalidateSchedules = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-agent-schedules", selectedAgentId] });

  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: getAdminAgentsAction,
  });

  const schedulesQuery = useQuery({
    queryKey: ["admin-agent-schedules", selectedAgentId],
    queryFn: () => getAdminAgentSchedulesAction(selectedAgentId!),
    enabled: isSchedulerOpen && !!selectedAgentId,
  });

  const createAgentMutation = useMutation({
    mutationFn: (payload: CreateAgentPayload) => createAdminAgentAction(payload),
    onSuccess: () => invalidateAgents(),
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || "Error al crear el agente");
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AgentFormPayload> }) =>
      updateAdminAgentAction(id, payload),
    onSuccess: () => invalidateAgents(),
    onError: () => toast.error("Error al guardar los datos del agente"),
  });

  const avatarMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadAdminAgentAvatarAction(id, file),
    onSuccess: () => invalidateAgents(),
    onError: () => toast.error("Error al subir la foto de perfil"),
  });

  const deleteAgentMutation = useMutation({
    mutationFn: (rawId: number) => deleteAdminAgentAction(rawId),
    onSuccess: () => {
      invalidateAgents();
      toast.success("Agente eliminado");
    },
    onError: () => toast.error("Error al eliminar el agente"),
  });

  const createScheduleMutation = useMutation({
    mutationFn: ({ agentId, payload }: { agentId: number; payload: ScheduleFormPayload }) =>
      createAdminAgentScheduleAction(agentId, payload),
    onSuccess: () => {
      invalidateSchedules();
      toast.success("Horario creado");
    },
    onError: () => toast.error("Error al crear el horario"),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ agentId, scheduleId, payload }: { agentId: number; scheduleId: number; payload: Partial<ScheduleFormPayload> }) =>
      updateAdminAgentScheduleAction(agentId, scheduleId, payload),
    onSuccess: () => {
      invalidateSchedules();
      toast.success("Horario actualizado");
    },
    onError: () => toast.error("Error al actualizar el horario"),
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: ({ agentId, scheduleId }: { agentId: number; scheduleId: number }) =>
      deleteAdminAgentScheduleAction(agentId, scheduleId),
    onSuccess: () => {
      invalidateSchedules();
      toast.success("Horario eliminado");
    },
    onError: () => toast.error("Error al eliminar el horario"),
  });

  return {
    agentsQuery,
    schedulesQuery,
    createAgentMutation,
    updateAgentMutation,
    avatarMutation,
    deleteAgentMutation,
    createScheduleMutation,
    updateScheduleMutation,
    deleteScheduleMutation,
    invalidateAgents,
  };
};
