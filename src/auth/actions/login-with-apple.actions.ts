import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse, AuthUser } from "@/auth/types/auth.types";

export interface LoginWithAppleResult {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export const loginWithAppleAction = async (
  identityToken: string
): Promise<LoginWithAppleResult> => {
  try {
    const { data } = await authApi.loginWithApple(identityToken);
    const authData = data as AuthResponse;

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("[loginWithAppleAction] Error al iniciar sesión con Apple:", error);
    return { success: false, message: "Apple Login no está disponible actualmente" };
  }
};
