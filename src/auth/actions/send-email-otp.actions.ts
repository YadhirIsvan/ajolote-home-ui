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
    return {
      success: true,
      message: data.message ?? "Código enviado correctamente.",
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { error?: string } };
    };
    if (axiosError.response?.status === 429) {
      return {
        success: false,
        message:
          axiosError.response.data?.error ??
          "Demasiados intentos. Intenta en 60 segundos.",
      };
    }
    return DEFAULT_RESPONSE;
  }
};
