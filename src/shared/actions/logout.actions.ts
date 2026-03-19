import { axiosInstance } from "@/shared/api/axios.instance";

// Decisión de diseño: los errores se silencian intencionalmente porque el
// logout local (limpiar tokens) siempre debe proceder sin importar la respuesta del servidor.
export const logoutAction = async (): Promise<void> => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    await axiosInstance.post("/auth/logout", { refresh });
  } catch (error) {
    console.error("[logoutAction] Error al notificar logout al servidor:", error);
  }
};
