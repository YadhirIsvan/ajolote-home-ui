import { useQuery } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientSavedPropertiesAction } from "@/myAccount/client/actions/get-client-saved-properties.actions";
import { getClientFinancialProfileAction } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import { getClientProfileDetailAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import { clientApi } from "@/myAccount/client/api/client.api";
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

  const savedQuery = useQuery({
    queryKey: ["client-saved-properties"],
    queryFn: getClientSavedPropertiesAction,
  });

  const financialQuery = useQuery({
    queryKey: ["client-financial-profile"],
    queryFn: getClientFinancialProfileAction,
  });

  const clientProfileQuery = useQuery({
    queryKey: ["client-profile-detail"],
    queryFn: getClientProfileDetailAction,
  });

  const userProfileQuery = useQuery({
    queryKey: ["client-user-profile"],
    queryFn: async () => {
      const { data } = await clientApi.getUserProfile();
      return data as { avatar: string | null };
    },
  });

  return {
    ventasList: (ventasQuery.data?.list ?? []) as PropertySaleItem[],
    ventasSummary: ventasQuery.data?.summary ?? null,
    ventasLoading: ventasQuery.isLoading,
    comprasList: comprasQuery.data ?? [],
    comprasLoading: comprasQuery.isLoading,
    savedProperties: savedQuery.data ?? [],
    savedLoading: savedQuery.isLoading,
    financialProfile: financialQuery.data ?? null,
    financialLoading: financialQuery.isLoading,
    clientProfile: clientProfileQuery.data ?? null,
    clientProfileLoading: clientProfileQuery.isLoading,
    userAvatar: userProfileQuery.data?.avatar ?? null,
  };
};
