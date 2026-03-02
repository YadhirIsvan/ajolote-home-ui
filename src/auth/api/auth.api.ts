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

  logout: () => {
    const refresh = localStorage.getItem("refresh_token");
    return axiosInstance.post("/auth/logout", { refresh });
  },

  refreshToken: () => {
    const refresh = localStorage.getItem("refresh_token");
    return axiosInstance.post("/auth/refresh", { refresh });
  },
};
