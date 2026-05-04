import { axiosInstance } from "@/shared/api/axios.instance";
import { isValidPhoneNumber } from "react-phone-number-input";

export interface UpdateUserPhoneParams {
  phone: string;
}

export interface UpdateUserPhoneResult {
  success: boolean;
  message?: string;
}

export const updateUserPhoneAction = async (
  params: UpdateUserPhoneParams
): Promise<UpdateUserPhoneResult> => {
  if (!params.phone || !isValidPhoneNumber(params.phone)) {
    return { success: false, message: "Ingresa un teléfono válido." };
  }

  try {
    await axiosInstance.patch("/client/profile", { phone: params.phone });
    return { success: true };
  } catch (error) {
    const axiosError = error as { response?: { data?: { error?: string; detail?: string } } };
    const message =
      axiosError?.response?.data?.error ??
      axiosError?.response?.data?.detail ??
      "No se pudo guardar el teléfono. Intenta de nuevo.";
    return { success: false, message };
  }
};
