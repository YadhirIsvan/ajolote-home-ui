import { authApi } from "@/auth/api/auth.api";

export interface SendEmailOtpResponse {
  success: boolean;
  message: string;
  isNewUser: boolean;
}

const DEFAULT_RESPONSE: SendEmailOtpResponse = {
  success: false,
  message: "Error al enviar el código. Intenta de nuevo.",
  isNewUser: false,
};

export const sendEmailOtpAction = async (
  email: string
): Promise<SendEmailOtpResponse> => {
  try {
    const { data } = await authApi.sendEmailOtp(email);
    return {
      success: true,
      message: data.message ?? "Código enviado correctamente.",
      isNewUser: data.is_new_user ?? false,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { error?: string } };
    };
    if (axiosError.response?.status === 429) {
      return {
        success: false,
        isNewUser: false,
        message:
          axiosError.response.data?.error ??
          "Demasiados intentos. Intenta en 60 segundos.",
      };
    }
    return DEFAULT_RESPONSE;
  }
};
