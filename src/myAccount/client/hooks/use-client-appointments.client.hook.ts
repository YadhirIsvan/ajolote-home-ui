import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClientAppointmentsAction,
  cancelClientAppointmentAction,
} from "@/myAccount/client/actions/get-client-appointments.actions";

const QUERY_KEY = "client-appointments";

export const useClientAppointments = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getClientAppointmentsAction,
    staleTime: 1000 * 60 * 3,
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      cancelClientAppointmentAction(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });

  return {
    appointments: data ?? [],
    isLoading,
    cancelAppointment: cancelMutation.mutate,
    isCancelling: cancelMutation.isPending,
  };
};
