import { clientApi } from "@/myAccount/client/api/client.api";
import type {
  PropertySaleItem,
  SaleProcessStage,
  SaleProcessHistoryEntry,
} from "@/myAccount/client/types/client.types";

interface BackendSaleDetail {
  id: number;
  status: string;
  property: { 
    id: number; 
    title: string; 
    address?: string; 
    price?: string; 
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
    views?: number;
  };
  agent: { name: string; phone: string; email: string };
  stages: { name: string; status: "completed" | "current" | "pending"; completed_at: string | null }[];
  history: { previous_status: string; new_status: string; changed_at: string; notes: string }[];
}

const mapDetail = (item: BackendSaleDetail, fallback?: PropertySaleItem): PropertySaleItem => ({
  id: item.id,
  title: item.property.title,
  address: item.property.address ?? "",
  price: item.property.price ?? "",
  image: item.property.image ?? "",
  status: item.status,
  views: fallback?.views ?? item.property.views ?? 0,
  interested: fallback?.interested ?? 0,
  daysListed: fallback?.daysListed ?? 0,
  trend: fallback?.trend ?? "stable",
  progressStep: fallback?.progressStep ?? 0,
  client_visible_status: fallback?.client_visible_status ?? 'registrar_propiedad',
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
  agent: item.agent,
  stages: item.stages as SaleProcessStage[],
  history: item.history as SaleProcessHistoryEntry[],
});

export const getClientPropertySaleDetailAction = async (
  id: number,
  fallback?: PropertySaleItem
): Promise<PropertySaleItem> => {
  try {
    const { data } = await clientApi.getPropertySaleDetail(id);
    return mapDetail(data as BackendSaleDetail, fallback);
  } catch (error) {
    console.error("[getClientPropertySaleDetailAction] Error al obtener detalle de venta:", error);
    if (fallback) return fallback;
    throw new Error(`No se pudo cargar el detalle del proceso de venta ${id}`);
  }
};
