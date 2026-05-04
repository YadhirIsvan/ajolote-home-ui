import { isValidPhoneNumber } from "react-phone-number-input";
import { axiosInstance } from "@/shared/api/axios.instance";

export interface UpdateUserPhoneData {
  phone: string;
}

export interface UpdateUserPhoneResponse {
  success: boolean;
  message?: string;
}

export const updateUserPhoneAction = async (
  data: UpdateUserPhoneData
): Promise<UpdateUserPhoneResponse> => {
  if (!data.phone || !isValidPhoneNumber(data.phone)) {
    return { success: false, message: "Ingresa un teléfono válido." };
  }

  try {
    await axiosInstance.patch("/client/profile", { phone: data.phone });
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { error?: string; detail?: string } };
    };
    const message =
      axiosError.response?.data?.error ??
      axiosError.response?.data?.detail ??
      "No se pudo guardar el teléfono. Intenta de nuevo.";
    return { success: false, message };
  }
};
