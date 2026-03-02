import { axiosInstance } from "@/shared/api/axios.instance";

export const authApi = {
  sendEmailOtp: (email: string) =>
    axiosInstance.post("/auth/email/otp", { email }),

  verifyOtp: (email: string, token: string) =>
    axiosInstance.post("/auth/email/verify", { email, token }),

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
