import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens, AuthUser } from "@/auth/types/auth.types";

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
    const authData = data as AuthTokens;

    localStorage.setItem("access_token", authData.access);
    localStorage.setItem("refresh_token", authData.refresh);
    localStorage.setItem("user", JSON.stringify(authData.user));
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
