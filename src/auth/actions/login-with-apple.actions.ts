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

    // Tokens are set as httpOnly cookies by the backend — not stored here.
    if (authData.user.memberships?.length) {
      localStorage.setItem(
        "selected_tenant_id",
        String(authData.user.memberships[0].tenant_id)
      );
    }

    return { success: true, user: authData.user };
  } catch (error) {
    console.error("[loginWithAppleAction] Error al iniciar sesión con Apple:", error);
    return { success: false, message: "Apple Login no está disponible actualmente" };
  }
};
