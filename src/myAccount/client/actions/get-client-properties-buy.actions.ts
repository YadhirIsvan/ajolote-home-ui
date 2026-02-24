import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertyBuySummary } from "@/myAccount/client/types/client.types";

const DEFAULT_COMPRAS: PropertyBuySummary[] = [
  {
    id: 1,
    title: "Casa en Polanco",
    address: "Col. Polanco, CDMX",
    price: "$12,500,000",
    image: "/placeholder.svg",
    status: "En proceso",
    agent_name: "María López",
    overallProgress: "33%",
    processStage: "Documentos verificados",
    fileNames: [],
  },
];

export const getClientPropertiesBuyAction =
  async (): Promise<PropertyBuySummary[]> => {
    try {
      const { data } = await clientApi.getPropertiesBuys();
      return Array.isArray(data) ? (data as PropertyBuySummary[]) : DEFAULT_COMPRAS;
    } catch {
      return DEFAULT_COMPRAS;
    }
  };
