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
  client_visible_status: 'registrar_propiedad' | 'aprobar_estado' | 'marketing' | 'vendida' | 'cancelado';
  progress_step: number;
  views: number;
  interested: number;
  days_listed: number;
  trend: string;
  property: { 
    id: number; 
    title: string; 
    address: string; 
    price: string; 
    image: string;
    bedrooms?: number;
    bathrooms?: number;
    construction_sqm?: number;
    land_sqm?: number;
    address_street?: string;
    address_number?: string;
    address_neighborhood?: string;
    city?: { id: number; name: string } | null;
    currency?: string;
  };
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
  client_visible_status: item.client_visible_status,
  views: item.views,
  interested: item.interested,
  daysListed: item.days_listed,
  trend: item.trend,
  progressStep: item.progress_step,
  // Property detail fields
  bedrooms: item.property.bedrooms,
  bathrooms: item.property.bathrooms,
  construction_sqm: item.property.construction_sqm,
  land_sqm: item.property.land_sqm,
  address_street: item.property.address_street,
  address_number: item.property.address_number,
  address_neighborhood: item.property.address_neighborhood,
  city: item.property.city,
  currency: item.property.currency,
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
