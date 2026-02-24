import { clientApi } from "@/myAccount/client/api/client.api";
import type {
  PropertiesSaleResponse,
  PropertySaleSummary,
} from "@/myAccount/client/types/client.types";

export interface PropertiesSaleResult {
  list: PropertySaleSummary[];
  summary: Omit<PropertiesSaleResponse, "properties"> | null;
}

const DEFAULT_RESPONSE: PropertiesSaleResponse = {
  propertiesAmount: 2,
  totalViews: 209,
  interestedAmount: 11,
  totalValue: 7000000,
  properties: [
    {
      id: 1,
      title: "Casa en Querétaro",
      address: "Col. Juriquilla, Querétaro",
      price: "$4,200,000",
      status: "Publicada",
      views: 142,
      interested: 8,
      daysListed: 15,
      image: "/placeholder.svg",
      trend: 12,
      progressStep: 3,
    },
    {
      id: 2,
      title: "Departamento en CDMX",
      address: "Col. Roma Norte, CDMX",
      price: "$2,800,000",
      status: "En revisión",
      views: 0,
      interested: 0,
      daysListed: 5,
      image: "/placeholder.svg",
      trend: 0,
      progressStep: 1,
    },
  ],
};

export const getClientPropertiesSaleAction =
  async (): Promise<PropertiesSaleResult> => {
    try {
      const { data } = await clientApi.getPropertiesSale();
      const raw = data as PropertiesSaleResponse | PropertySaleSummary[];

      if (Array.isArray(raw)) {
        return { list: raw, summary: null };
      }

      const { properties = [], ...summaryRest } = raw;
      return { list: properties, summary: summaryRest };
    } catch {
      const { properties = [], ...summaryRest } = DEFAULT_RESPONSE;
      return { list: properties, summary: summaryRest };
    }
  };
