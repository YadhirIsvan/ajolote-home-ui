import { clientApi } from "@/myAccount/client/api/client.api";
import type { UserProfile } from "@/myAccount/client/types/client.types";

export const getClientProfileAction = async (): Promise<UserProfile | null> => {
  try {
    const { data } = await clientApi.getUserProfile();
    return data as UserProfile;
  } catch {
    return null;
  }
};
