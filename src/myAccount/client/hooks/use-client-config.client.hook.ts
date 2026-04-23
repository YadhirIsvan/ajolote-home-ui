import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";
import {
  updateClientProfileAction,
  type UpdateClientProfileData,
  type UpdateClientProfileResponse,
} from "@/myAccount/client/actions/update-client-profile.actions";

export const useClientConfig = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["client-user-profile"],
    queryFn: getClientProfileAction,
  });

  const updateMutation = useMutation<
    UpdateClientProfileResponse,
    unknown,
    UpdateClientProfileData
  >({
    mutationFn: updateClientProfileAction,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["client-user-profile"] });
      }
    },
  });

  const updateProfile = (data: UpdateClientProfileData) =>
    updateMutation.mutateAsync(data);

  const phone = profile?.phone ?? "";

  return {
    profile,
    profileLoading,
    phone,
    updateProfile,
    isSaving: updateMutation.isPending,
  };
};
