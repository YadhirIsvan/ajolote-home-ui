import { authApi } from "@/auth/api/auth.api";

export interface VerifyOtpResponse {
  success: boolean;
  accessToken?: string;
  message: string;
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
    return data as VerifyOtpResponse;
  } catch {
    return DEFAULT_RESPONSE;
  }
};
