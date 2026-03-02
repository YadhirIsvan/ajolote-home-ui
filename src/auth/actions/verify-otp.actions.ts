import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

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
  token: string
): Promise<VerifyOtpResponse> => {
  try {
    const { data } = await authApi.verifyOtp(email, token);
    const authData = data as AuthTokens;

    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);

    return {
      success: true,
      message: "Autenticación exitosa.",
      data: authData,
    };
  } catch {
    return DEFAULT_RESPONSE;
  }
};
