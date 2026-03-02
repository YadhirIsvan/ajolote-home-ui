import { clientApi } from "@/myAccount/client/api/client.api";
import type {
  PropertySaleItem,
  SaleProcessStage,
  SaleProcessHistoryEntry,
} from "@/myAccount/client/types/client.types";

interface BackendSaleDetail {
  id: number;
  status: string;
  property: { id: number; title: string; address?: string; price?: string; image: string };
  agent: { name: string; phone: string; email: string };
  stages: { name: string; status: "completed" | "current" | "pending"; completed_at: string | null }[];
  history: { previous_status: string; new_status: string; changed_at: string; notes: string }[];
}

const mapDetail = (item: BackendSaleDetail): PropertySaleItem => ({
  id: item.id,
  title: item.property.title,
  address: item.property.address ?? "",
  price: item.property.price ?? "",
  image: item.property.image ?? "",
  status: item.status,
  views: 0,
  interested: 0,
  daysListed: 0,
  trend: "stable",
  progressStep: 0,
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
    return mapDetail(data as BackendSaleDetail);
  } catch {
    if (fallback) return fallback;
    throw new Error(`No se pudo cargar el detalle del proceso de venta ${id}`);
  }
};
