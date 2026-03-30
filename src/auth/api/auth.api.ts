import { axiosInstance } from "@/shared/api/axios.instance";
import type { RegisterRequest, RegisterResponse } from "@/auth/types/auth.types";

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosInstance.post<RegisterResponse>("/auth/register", data),

  sendEmailOtp: (email: string) =>
    axiosInstance.post("/auth/email/otp", { email }),

  verifyOtp: (
    email: string,
    token: string,
    extra?: { first_name?: string; last_name?: string; phone?: string }
  ) =>
    axiosInstance.post("/auth/email/verify", { email, token, ...extra }),

  loginWithGoogle: (idToken: string) =>
    axiosInstance.post("/auth/google", { idToken }),

  loginWithApple: (identityToken: string) =>
    axiosInstance.post("/auth/apple", { identityToken }),

  me: () => axiosInstance.get("/auth/me"),

  // No body needed — refresh_token is sent automatically as an httpOnly cookie
  logout: () => axiosInstance.post("/auth/logout"),

  // No body needed — refresh_token is sent automatically as an httpOnly cookie
  refreshToken: () => axiosInstance.post("/auth/refresh"),
};
