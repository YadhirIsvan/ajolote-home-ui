import { useQuery } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientSavedPropertiesAction } from "@/myAccount/client/actions/get-client-saved-properties.actions";
import { getClientFinancialProfileAction } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import { getClientProfileDetailAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import { getClientAppointmentsAction } from "@/myAccount/client/actions/get-client-appointments.actions";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";
import { useAuth } from "@/auth/hooks/use-auth.auth.hook";
// TODO (deuda técnica): mover useAuth a src/shared/hooks/ para eliminar import cross-domain
import type { PropertySaleItem, ClientAppointment } from "@/myAccount/client/types/client.types";

export const useClientDashboard = () => {
  const { isAuthenticated, role } = useAuth();
  // Solo disparar queries cuando el usuario está autenticado y tiene rol client
  const enabled = isAuthenticated && role === "client";

  const ventasQuery = useQuery({
    queryKey: ["client-properties-sale"],
    queryFn: getClientPropertiesSaleAction,
    enabled,
  });

  const comprasQuery = useQuery({
    queryKey: ["client-properties-buy"],
    queryFn: getClientPropertiesBuyAction,
    enabled,
  });

  const savedQuery = useQuery({
    queryKey: ["client-saved-properties"],
    queryFn: getClientSavedPropertiesAction,
    enabled,
  });

  const financialQuery = useQuery({
    queryKey: ["client-financial-profile"],
    queryFn: getClientFinancialProfileAction,
    enabled,
  });

  const clientProfileQuery = useQuery({
    queryKey: ["client-profile-detail"],
    queryFn: getClientProfileDetailAction,
    enabled,
  });

  const userProfileQuery = useQuery({
    queryKey: ["client-user-profile"],
    queryFn: getClientProfileAction,
    enabled,
  });

  const appointmentsQuery = useQuery({
    queryKey: ["client-appointments"],
    queryFn: getClientAppointmentsAction,
    staleTime: 1000 * 60 * 3,
    enabled,
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
    appointmentsList: (appointmentsQuery.data ?? []) as ClientAppointment[],
    appointmentsLoading: appointmentsQuery.isLoading,
  };
};
