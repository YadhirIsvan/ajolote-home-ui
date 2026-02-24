import { useQuery } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientRecentActivityAction } from "@/myAccount/client/actions/get-client-recent-activity.actions";
import type { PropertySaleItem } from "@/myAccount/client/types/client.types";

export const useClientDashboard = () => {
  const ventasQuery = useQuery({
    queryKey: ["client-properties-sale"],
    queryFn: getClientPropertiesSaleAction,
  });

  const comprasQuery = useQuery({
    queryKey: ["client-properties-buy"],
    queryFn: getClientPropertiesBuyAction,
  });

  const activityQuery = useQuery({
    queryKey: ["client-recent-activity"],
    queryFn: getClientRecentActivityAction,
  });

  return {
    ventasList: (ventasQuery.data?.list ?? []) as PropertySaleItem[],
    ventasSummary: ventasQuery.data?.summary ?? null,
    ventasLoading: ventasQuery.isLoading,
    comprasList: comprasQuery.data ?? [],
    comprasLoading: comprasQuery.isLoading,
    activityData: activityQuery.data ?? [],
    activityLoading: activityQuery.isLoading,
  };
};
