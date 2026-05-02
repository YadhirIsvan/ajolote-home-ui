import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminSaleProcessesAction,
  updateSaleProcessStatusAction,
} from "@/myAccount/admin/actions/get-admin-kanban.actions";
import type { SaleProcessStatus } from "@/myAccount/admin/types/admin.types";

export const useAdminKanbanVentas = () => {
  const queryClient = useQueryClient();

  const processesQuery = useQuery({
    queryKey: ["admin-kanban-ventas"],
    queryFn: () => getAdminSaleProcessesAction({ limit: 200 }),
  });

  const moveMutation = useMutation({
    mutationFn: ({ rawId, status }: { rawId: number; status: SaleProcessStatus }) =>
      updateSaleProcessStatusAction(rawId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kanban-ventas"] });
    },
    onError: () => toast.error("Error al cambiar la etapa"),
  });

  return { processesQuery, moveMutation };
};
