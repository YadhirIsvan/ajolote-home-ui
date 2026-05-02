import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminAssignmentsAction,
  createAdminAssignmentAction,
  deleteAdminAssignmentAction,
} from "@/myAccount/admin/actions/get-admin-assignments.actions";
import { getAdminAgentsAction } from "@/myAccount/admin/actions/get-admin-agents.actions";
import { getAdminPropertiesAction } from "@/myAccount/admin/actions/get-admin-properties.actions";

const KEYS = {
  assignments: ["admin-assignments"] as const,
  agents: ["admin-agents"] as const,
  properties: ["admin-properties"] as const,
};

export const useAdminAsignar = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: KEYS.assignments });
    queryClient.invalidateQueries({ queryKey: KEYS.properties });
  };

  const assignmentsQuery = useQuery({
    queryKey: KEYS.assignments,
    queryFn: getAdminAssignmentsAction,
  });

  const agentsQuery = useQuery({
    queryKey: KEYS.agents,
    queryFn: getAdminAgentsAction,
  });

  const propertiesQuery = useQuery({
    queryKey: KEYS.properties,
    queryFn: () => getAdminPropertiesAction({ limit: 200 }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ propertyId, membershipId }: { propertyId: number; membershipId: number }) =>
      createAdminAssignmentAction(propertyId, membershipId),
    onSuccess: () => {
      invalidate();
      toast.success("Propiedad asignada");
    },
    onError: () => toast.error("Error al asignar la propiedad"),
  });

  const transferMutation = useMutation({
    mutationFn: async ({
      propertyId,
      allAssignmentIds,
      newMembershipId,
    }: { propertyId: number; allAssignmentIds: number[]; newMembershipId: number }) => {
      if (allAssignmentIds.length > 0) {
        await Promise.all(allAssignmentIds.map((id) => deleteAdminAssignmentAction(id)));
      }
      await createAdminAssignmentAction(propertyId, newMembershipId);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Agente actualizado");
    },
    onError: () => toast.error("Error al cambiar el agente"),
  });

  const removeMutation = useMutation({
    mutationFn: (allAssignmentIds: number[]) =>
      Promise.all(allAssignmentIds.map((id) => deleteAdminAssignmentAction(id))),
    onSuccess: () => {
      invalidate();
      toast.success("Agente removido");
    },
    onError: () => toast.error("Error al remover el agente"),
  });

  return {
    assignmentsQuery,
    agentsQuery,
    propertiesQuery,
    assignMutation,
    transferMutation,
    removeMutation,
  };
};
