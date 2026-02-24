import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertyFileItem } from "@/myAccount/client/types/client.types";

const DEFAULT_FILES: PropertyFileItem[] = [
  { name: "identificacion_oficial.pdf", mimeType: "application/pdf", size: 204800 },
  { name: "comprobante_domicilio.pdf", mimeType: "application/pdf", size: 153600 },
];

export const getClientPropertyFilesAction = async (
  propertyId: number
): Promise<PropertyFileItem[]> => {
  try {
    const { data } = await clientApi.getPropertyFiles(propertyId);
    return Array.isArray(data) ? (data as PropertyFileItem[]) : DEFAULT_FILES;
  } catch {
    return DEFAULT_FILES;
  }
};
