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

    // Tokens are set as httpOnly cookies by the backend — not stored here.
    // Only the UI preference (tenant selection) goes to localStorage.
    if (authData.user.memberships?.length) {
      localStorage.setItem(
        "selected_tenant_id",
        String(authData.user.memberships[0].tenant_id)
      );
    }

    return { success: true, user: authData.user };
  } catch (error: unknown) {
    console.error("[loginWithGoogleAction] Error al iniciar sesión con Google:", error);
    const axiosError = error as { response?: { data?: { error?: string } } };
    const message = axiosError.response?.data?.error ?? "Error al iniciar sesión con Google";
    return { success: false, message };
  }
};
