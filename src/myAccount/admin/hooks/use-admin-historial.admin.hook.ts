import { useQuery } from "@tanstack/react-query";
import { getAdminHistoryAction } from "@/myAccount/admin/actions/get-admin-history.actions";

export const useAdminHistorial = () => {
  const historyQuery = useQuery({
    queryKey: ["admin-history"],
    queryFn: () => getAdminHistoryAction({ limit: 100 }),
  });

  return {
    historyQuery,
    results: historyQuery.data?.results ?? [],
  };
};
