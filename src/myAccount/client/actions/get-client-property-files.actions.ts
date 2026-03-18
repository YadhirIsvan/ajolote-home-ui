import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertyFileItem } from "@/myAccount/client/types/client.types";

export const getClientPropertyFilesAction = async (
  processId: number
): Promise<PropertyFileItem[]> => {
  try {
    const { data } = await clientApi.getPropertyFiles(processId);
    return Array.isArray(data.documents) ? data.documents : [];
  } catch (error) {
    console.error("[getClientPropertyFilesAction] Error al obtener documentos de propiedad:", error);
    return [];
  }
};
