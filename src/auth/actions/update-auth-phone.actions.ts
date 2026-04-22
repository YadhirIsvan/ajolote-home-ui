import { isValidPhoneNumber } from "react-phone-number-input";
import { authApi } from "@/auth/api/auth.api";
import type { UpdateAuthPhoneResponse } from "@/auth/types/auth.types";

export const updateAuthPhoneAction = async (
  phoneE164: string | undefined
): Promise<UpdateAuthPhoneResponse> => {
  if (!phoneE164 || !isValidPhoneNumber(phoneE164)) {
    return {
      success: false,
      message: "Ingresa un teléfono válido.",
    };
  }

  try {
    await authApi.updateAuthPhone(phoneE164);
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
