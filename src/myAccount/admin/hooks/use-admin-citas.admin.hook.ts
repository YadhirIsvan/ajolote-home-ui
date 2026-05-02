import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAdminAppointmentsAction,
  createAdminAppointmentAction,
  updateAdminAppointmentStatusAction,
  type CreateAdminAppointmentPayload,
} from "@/myAccount/admin/actions/get-admin-appointments.actions";
import { getAdminClientsAction } from "@/myAccount/admin/actions/get-admin-clients.actions";
import { getAdminPropertiesAction } from "@/myAccount/admin/actions/get-admin-properties.actions";

interface UseAdminCitasOptions {
  clientSearch: string;
}

export const useAdminCitas = ({ clientSearch }: UseAdminCitasOptions) => {
  const queryClient = useQueryClient();

  const appointmentsQuery = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => getAdminAppointmentsAction({ limit: 500 }),
  });

  const propertiesQuery = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminPropertiesAction({ limit: 200 }),
  });

  const clientsQuery = useQuery({
    queryKey: ["admin-clients-search", clientSearch],
    queryFn: () => getAdminClientsAction({ search: clientSearch, limit: 20 }),
    enabled: clientSearch.length >= 2,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAdminAppointmentStatusAction(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar el estado"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminAppointmentPayload) => createAdminAppointmentAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
      toast.success("Cita creada correctamente");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg ?? "Error al crear la cita");
    },
  });

  return {
    appointmentsQuery,
    propertiesQuery,
    clientsQuery,
    updateStatusMutation,
    createMutation,
  };
};
