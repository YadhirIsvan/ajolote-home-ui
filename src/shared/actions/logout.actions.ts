import { axiosInstance } from "@/shared/api/axios.instance";

export const logoutAction = async (): Promise<void> => {
  try {
    // refresh_token is sent automatically as an httpOnly cookie — no body needed.
    // The backend blacklists the token and deletes all auth cookies.
    await axiosInstance.post("/auth/logout");
  } catch (error) {
    console.error("[logoutAction] Error al notificar logout al servidor:", error);
  }
};
