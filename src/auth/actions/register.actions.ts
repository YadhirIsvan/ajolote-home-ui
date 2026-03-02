import { authApi } from "@/auth/api/auth.api";
import type { RegisterRequest } from "@/auth/types/auth.types";

export interface RegisterActionResponse {
  success: boolean;
  message: string;
  email?: string;
  userExists?: boolean;
}

export const registerAction = async (
  data: RegisterRequest
): Promise<RegisterActionResponse> => {
  try {
    const { data: responseData } = await authApi.register(data);
    return {
      success: true,
      message: responseData.message,
      email: responseData.email,
    };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { status?: number; data?: { error?: string; detail?: string; message?: string } };
    };
    const responseData = axiosError.response?.data;
    const message = responseData?.error ?? responseData?.detail ?? responseData?.message ?? "";

    if (axiosError.response?.status === 400) {
      if (message.toLowerCase().includes("ya existe") || message.toLowerCase().includes("already exists")) {
        return {
          success: false,
          userExists: true,
          message: message || "El usuario ya existe. Inicia sesión.",
        };
      }
      return {
        success: false,
        message: message || "Datos inválidos. Revisa los campos e intenta de nuevo.",
      };
    }

    return {
      success: false,
      message: "Error al crear la cuenta. Intenta de nuevo.",
    };
  }
};
