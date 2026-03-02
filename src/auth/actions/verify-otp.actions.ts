import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

export interface VerifyOtpExtra {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: AuthTokens;
}

const DEFAULT_RESPONSE: VerifyOtpResponse = {
  success: false,
  message: "Código inválido o expirado. Intenta de nuevo.",
};

export const verifyOtpAction = async (
  email: string,
  token: string,
  extra?: VerifyOtpExtra
): Promise<VerifyOtpResponse> => {
  try {
    const { data } = await authApi.verifyOtp(email, token, extra);
    const authData = data as AuthTokens;

    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);
    localStorage.setItem("user", JSON.stringify(authData.user));

    return {
      success: true,
      message: "Autenticación exitosa.",
      data: authData,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { error?: string; detail?: string } };
    };
    const msg =
      axiosError.response?.data?.error ??
      axiosError.response?.data?.detail ??
      DEFAULT_RESPONSE.message;
    return { success: false, message: msg };
  }
};
