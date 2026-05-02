import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminPurchaseProcessesAction,
  updatePurchaseProcessStatusAction,
} from "@/myAccount/admin/actions/get-admin-kanban.actions";
import type { PurchaseProcessStatus } from "@/myAccount/admin/types/admin.types";

export const useAdminKanban = () => {
  const queryClient = useQueryClient();

  const processesQuery = useQuery({
    queryKey: ["admin-kanban"],
    queryFn: () => getAdminPurchaseProcessesAction({ limit: 200 }),
  });

  const moveMutation = useMutation({
    mutationFn: ({
      rawId,
      status,
      extra,
    }: { rawId: number; status: PurchaseProcessStatus; extra?: Record<string, unknown> }) =>
      updatePurchaseProcessStatusAction(rawId, status, undefined, extra),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
    },
    onError: () => toast.error("Error al cambiar la etapa"),
  });

  return { processesQuery, moveMutation };
};
