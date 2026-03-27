import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";
import { tokenStore } from "@/shared/api/token.store";

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

    tokenStore.setTokens(authData.access, authData.refresh);
    localStorage.setItem("user", JSON.stringify(authData.user));
    if (authData.user.memberships?.length) {
      localStorage.setItem(
        "selected_tenant_id",
        String(authData.user.memberships[0].tenant_id)
      );
    }

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
