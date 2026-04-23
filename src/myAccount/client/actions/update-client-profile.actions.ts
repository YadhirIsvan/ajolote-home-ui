import { isValidPhoneNumber } from "react-phone-number-input";
import { clientApi } from "@/myAccount/client/api/client.api";

export interface UpdateClientProfileData {
  phone: string;
  first_name?: string;
  last_name?: string;
  city?: string;
}

export interface UpdateClientProfileResponse {
  success: boolean;
  message?: string;
}

export const updateClientProfileAction = async (
  data: UpdateClientProfileData
): Promise<UpdateClientProfileResponse> => {
  if (!data.phone || !isValidPhoneNumber(data.phone)) {
    return { success: false, message: "Ingresa un teléfono válido." };
  }

  const payload: Record<string, string> = { phone: data.phone };
  if (data.first_name !== undefined) payload.first_name = data.first_name;
  if (data.last_name !== undefined) payload.last_name = data.last_name;
  if (data.city !== undefined) payload.city = data.city;

  try {
    await clientApi.updateProfile(payload);
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { error?: string; detail?: string } };
    };
    const message =
      axiosError.response?.data?.error ??
      axiosError.response?.data?.detail ??
      "No se pudo guardar el perfil. Intenta de nuevo.";
    return { success: false, message };
  }
};
