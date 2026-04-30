import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertyBuySummary } from "@/myAccount/client/types/client.types";

interface BackendPurchaseResult {
  id: number;
  status: string;
  overall_progress: number;
  process_stage: string;
  documents_count: number;
  property: { id: number; title: string; address: string; price: string; image: string };
  agent: { name: string };
}

interface BackendPurchasesResponse {
  count: number;
  results: BackendPurchaseResult[];
}

const mapBuyItem = (item: BackendPurchaseResult): PropertyBuySummary => ({
  id: item.id,
  title: item.property.title,
  address: item.property.address,
  price: item.property.price,
  image: item.property.image ?? "",
  status: item.status,
  agent_name: item.agent.name,
  overallProgress: item.overall_progress,
  processStage: item.process_stage,
  documents_count: item.documents_count,
});

export const getClientPropertiesBuyAction =
  async (): Promise<PropertyBuySummary[]> => {
    try {
      const { data } = await clientApi.getPropertiesBuys();
      const raw = data as BackendPurchasesResponse;
      return raw.results.map(mapBuyItem);
    } catch (error) {
      console.error("[getClientPropertiesBuyAction] Error al obtener propiedades en compra:", error);
      throw new Error(
        error instanceof Error ? error.message : "Error al obtener propiedades en compra"
      );
    }
  };
