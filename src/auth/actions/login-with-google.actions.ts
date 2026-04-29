import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse, AuthUser } from "@/auth/types/auth.types";

export interface LoginWithGoogleResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export const loginWithGoogleAction = async (
  accessToken: string
): Promise<LoginWithGoogleResult> => {
  try {
    const { data } = await authApi.loginWithGoogle(accessToken);
    const authData = data as AuthResponse;

    return { success: true, user: authData.user };
  } catch (error: unknown) {
    console.error("[loginWithGoogleAction] Error al iniciar sesión con Google:", error);
    const axiosError = error as { response?: { data?: { error?: string } } };
    const message = axiosError.response?.data?.error ?? "Error al iniciar sesión con Google";
    return { success: false, message };
  }
};
