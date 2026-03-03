import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertyFileItem } from "@/myAccount/client/types/client.types";

interface PurchaseDetailResponse {
  documents?: PropertyFileItem[];
}

export const getClientPropertyFilesAction = async (
  processId: number
): Promise<PropertyFileItem[]> => {
  try {
    const { data } = await clientApi.getPropertyDetail(processId);
    const detail = data as PurchaseDetailResponse;
    return Array.isArray(detail.documents) ? detail.documents : [];
  } catch {
    return [];
  }
};
