import { useQuery } from "@tanstack/react-query";
import { getClientProfileAction } from "@/myAccount/client/actions/get-client-profile.actions";

export const useClientConfig = () => {
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["client-user-profile"],
    queryFn: getClientProfileAction,
  });

  const phone = profile?.phone ?? "";

  return { profile, profileLoading, phone };
};
