import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertiesBuyAction } from "@/myAccount/client/actions/get-client-properties-buy.actions";
import { getClientSavedPropertiesAction } from "@/myAccount/client/actions/get-client-saved-properties.actions";
import { getClientFinancialProfileAction } from "@/myAccount/client/actions/get-client-financial-profile.actions";
import { getClientProfileDetailAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import { getClientAppointmentsAction } from "@/myAccount/client/actions/get-client-appointments.actions";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";
import { updateClientProfileFieldAction } from "@/myAccount/client/actions/get-client-profile-detail.actions";
import {
  uploadClientAvatarAction,
  deleteClientAvatarAction,
} from "@/myAccount/client/actions/upload-client-avatar.actions";
import { useAuth } from "@/shared/hooks/use-auth.hook";
import type { PropertySaleItem, ClientAppointment } from "@/myAccount/client/types/client.types";

export const useClientDashboard = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuth();
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

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadClientAvatarAction(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-user-profile"] });
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: deleteClientAvatarAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-user-profile"] });
    },
  });

  const updateProfileFieldMutation = useMutation({
    mutationFn: ({ field, value }: { field: string; value: string }) =>
      updateClientProfileFieldAction(field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile-detail"] });
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
    appointmentsList: (appointmentsQuery.data ?? []) as ClientAppointment[],
    appointmentsLoading: appointmentsQuery.isLoading,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    latestAvatarUrl: uploadAvatarMutation.data?.avatarUrl ?? null,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    isDeletingAvatar: deleteAvatarMutation.isPending,
    updateProfileField: updateProfileFieldMutation.mutate,
    isUpdatingProfileField: updateProfileFieldMutation.isPending,
  };
};
