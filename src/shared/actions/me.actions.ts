import { axiosInstance } from "@/shared/api/axios.instance";
import type { AuthUser } from "@/shared/types/user.types";

export interface MeResponse {
  refresh_expires_at: number;
  user: AuthUser;
}

/**
 * Fetches the current authenticated user's profile from the backend.
 * Used by the auth context on app load to rehidrate the session.
 * Returns null on any error (expired token, network error, etc.).
 */
export const meAction = async (): Promise<MeResponse | null> => {
  try {
    const { data } = await axiosInstance.get<MeResponse>("/auth/me");
    return data;
  } catch {
    return null;
  }
};
