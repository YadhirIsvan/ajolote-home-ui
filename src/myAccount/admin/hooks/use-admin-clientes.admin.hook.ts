import { useQuery } from "@tanstack/react-query";
import {
  getAdminClientsAction,
  getAdminClientDetailAction,
} from "@/myAccount/admin/actions/get-admin-clients.actions";

interface UseAdminClientesOptions {
  searchTerm: string;
  selectedClientId: number | null;
  isDetailOpen: boolean;
}

export const useAdminClientes = ({
  searchTerm,
  selectedClientId,
  isDetailOpen,
}: UseAdminClientesOptions) => {
  const clientsQuery = useQuery({
    queryKey: ["admin-clients", searchTerm],
    queryFn: () => getAdminClientsAction({ search: searchTerm || undefined, limit: 200 }),
  });

  const detailQuery = useQuery({
    queryKey: ["admin-client-detail", selectedClientId],
    queryFn: () => getAdminClientDetailAction(selectedClientId!),
    enabled: selectedClientId !== null && isDetailOpen,
  });

  return {
    clientsQuery,
    clients: clientsQuery.data?.results ?? [],
    detailQuery,
    clientDetail: detailQuery.data ?? null,
  };
};
