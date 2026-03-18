import { authApi } from "@/auth/api/auth.api";

// Decisión de diseño: los errores se silencian intencionalmente porque el
// logout local (limpiar tokens) siempre debe proceder sin importar la respuesta del servidor.
export const logoutAction = async (): Promise<void> => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("[logoutAction] Error al notificar logout al servidor:", error);
  }
};
