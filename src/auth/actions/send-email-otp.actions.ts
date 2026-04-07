import { authApi } from "@/auth/api/auth.api";

export interface SendEmailOtpResponse {
  success: boolean;
  message: string;
}

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
      response?: { status?: number; data?: { error?: string; detail?: string } };
      message?: string;
    };

    // Sin respuesta del servidor = error de red o CORS
    if (!axiosError.response) {
      return {
        success: false,
        message: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.",
      };
    }

    const serverMsg =
      axiosError.response.data?.error ??
      axiosError.response.data?.detail;

    if (axiosError.response.status === 429) {
      return {
        success: false,
        message: serverMsg ?? "Demasiados intentos. Espera un momento e intenta de nuevo.",
      };
    }

    return {
      success: false,
      message: serverMsg ?? "Error al enviar el código. Intenta de nuevo.",
    };
  }
};
