import axiosInstance from "@/shared/api/axios.instance";

export const authApi = {
  sendEmailOtp: (email: string) =>
    axiosInstance.post("/auth/email/otp", { email }),

  verifyOtp: (email: string, token: string) =>
    axiosInstance.post("/auth/email/verify", { email, token }),

  loginWithGoogle: (idToken: string) =>
    axiosInstance.post("/auth/google", { idToken }),

  loginWithApple: (identityToken: string) =>
    axiosInstance.post("/auth/apple", { identityToken }),

  logout: () => axiosInstance.post("/auth/logout"),

  refreshToken: () => axiosInstance.post("/auth/refresh"),
};
