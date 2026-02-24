import { clientApi } from "@/myAccount/client/api/client.api";
import type { UserProfile } from "@/myAccount/client/types/client.types";

const DEFAULT_PROFILE: UserProfile = {
  Name: "Juan Díaz",
  PhoneNumber: 5551234567,
  Email: "juan.diaz@email.com",
  City: "CDMX",
  NewProperties: true,
  PriceUpdates: true,
  AppointmentReminders: false,
  Offers: false,
};

export const getClientProfileAction = async (): Promise<UserProfile> => {
  try {
    const { data } = await clientApi.getUserProfile();
    return data as UserProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
};
