import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getSaleProcessAssignmentsAction,
  assignSaleProcessAgentAction,
  unassignSaleProcessAgentAction,
} from "@/myAccount/admin/actions/get-admin-sale-assignments.actions";
import { getAdminAgentsAction } from "@/myAccount/admin/actions/get-admin-agents.actions";

const ASSIGNMENTS_KEY = ["admin-sale-process-assignments"] as const;

export const useAdminAsignarVentas = () => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });

  const assignmentsQuery = useQuery({
    queryKey: ASSIGNMENTS_KEY,
    queryFn: getSaleProcessAssignmentsAction,
  });

  const agentsQuery = useQuery({
    queryKey: ["admin-agents"],
    queryFn: getAdminAgentsAction,
  });

  const assignMutation = useMutation({
    mutationFn: ({ saleProcessId, membershipId }: { saleProcessId: number; membershipId: number }) =>
      assignSaleProcessAgentAction(saleProcessId, membershipId),
    onSuccess: () => {
      invalidate();
      toast.success("Agente asignado al proceso de venta");
    },
    onError: () => toast.error("Error al asignar el agente"),
  });

  const unassignMutation = useMutation({
    mutationFn: (saleProcessId: number) => unassignSaleProcessAgentAction(saleProcessId),
    onSuccess: () => {
      invalidate();
      toast.success("Agente removido del proceso de venta");
    },
    onError: () => toast.error("Error al remover el agente"),
  });

  const transferMutation = useMutation({
    mutationFn: async ({ saleProcessId, newMembershipId }: { saleProcessId: number; newMembershipId: number }) => {
      await unassignSaleProcessAgentAction(saleProcessId);
      await assignSaleProcessAgentAction(saleProcessId, newMembershipId);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Agente actualizado");
    },
    onError: () => toast.error("Error al cambiar el agente"),
  });

  return {
    assignmentsQuery,
    agentsQuery,
    assignMutation,
    unassignMutation,
    transferMutation,
  };
};
