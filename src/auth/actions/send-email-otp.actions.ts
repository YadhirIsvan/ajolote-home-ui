import { authApi } from "@/auth/api/auth.api";

export interface SendEmailOtpResponse {
  success: boolean;
  message: string;
}

const DEFAULT_RESPONSE: SendEmailOtpResponse = {
  success: false,
  message: "Error al enviar el código. Intenta de nuevo.",
};

export const sendEmailOtpAction = async (
  email: string
): Promise<SendEmailOtpResponse> => {
  try {
    const { data } = await authApi.sendEmailOtp(email);
    return data as SendEmailOtpResponse;
  } catch {
    return DEFAULT_RESPONSE;
  }
};
