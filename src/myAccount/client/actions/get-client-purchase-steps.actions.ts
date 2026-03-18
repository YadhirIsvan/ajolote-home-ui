import { clientApi } from "@/myAccount/client/api/client.api";
import type { Step } from "@/myAccount/client/types/client.types";

interface BackendStep {
  key: string;
  label: string;
  progress: number;
  status: "completed" | "current" | "pending";
  allow_upload: boolean;
}

interface PurchaseDetailResponse {
  steps?: BackendStep[];
}

const mapBackendSteps = (steps: BackendStep[]): Step[] =>
  steps.map((s) => ({
    label: s.label,
    done: s.status === "completed",
    current: s.status === "current",
    allowUpload: s.allow_upload,
  }));

export const getClientPurchaseStepsAction = async (
  processId: number
): Promise<Step[]> => {
  try {
    const { data } = await clientApi.getPropertyDetail(processId);
    const detail = data as PurchaseDetailResponse;
    return detail.steps ? mapBackendSteps(detail.steps) : [];
  } catch (error) {
    console.error("[getClientPurchaseStepsAction] Error al obtener pasos del proceso de compra:", error);
    return [];
  }
};
