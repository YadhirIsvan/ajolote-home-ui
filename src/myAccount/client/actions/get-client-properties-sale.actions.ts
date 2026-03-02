import { clientApi } from "@/myAccount/client/api/client.api";
import type {
  PropertiesSaleResponse,
  PropertySaleSummary,
} from "@/myAccount/client/types/client.types";

export interface PropertiesSaleResult {
  list: PropertySaleSummary[];
  summary: Omit<PropertiesSaleResponse, "properties"> | null;
}

interface BackendSaleResult {
  id: number;
  status: string;
  progress_step: number;
  views: number;
  interested: number;
  days_listed: number;
  trend: string;
  property: { id: number; title: string; address: string; price: string; image: string };
  agent: { name: string };
}

interface BackendSalesResponse {
  stats: {
    total_properties: number;
    total_views: number;
    total_interested: number;
    total_value: string;
  };
  results: BackendSaleResult[];
}

const mapSaleItem = (item: BackendSaleResult): PropertySaleSummary => ({
  id: item.id,
  title: item.property.title,
  address: item.property.address,
  price: item.property.price,
  image: item.property.image ?? "",
  status: item.status,
  views: item.views,
  interested: item.interested,
  daysListed: item.days_listed,
  trend: item.trend,
  progressStep: item.progress_step,
});

export const getClientPropertiesSaleAction =
  async (): Promise<PropertiesSaleResult> => {
    try {
      const { data } = await clientApi.getPropertiesSale();
      const raw = data as BackendSalesResponse;

      const list = raw.results.map(mapSaleItem);
      const summary: Omit<PropertiesSaleResponse, "properties"> = {
        propertiesAmount: raw.stats.total_properties,
        totalViews: raw.stats.total_views,
        interestedAmount: raw.stats.total_interested,
        totalValue: parseFloat(raw.stats.total_value),
      };

      return { list, summary };
    } catch {
      return { list: [], summary: null };
    }
  };
