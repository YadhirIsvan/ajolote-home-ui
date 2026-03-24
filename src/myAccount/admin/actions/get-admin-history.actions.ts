import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { BackendAdminSaleHistoryItem, AdminSaleHistoryItem, Paginated } from "@/myAccount/admin/types/admin.types";

export interface GetAdminHistoryParams {
  zone?: string;
  property_type?: string;
  payment_method?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapAdminSaleHistoryItem = (b: BackendAdminSaleHistoryItem): AdminSaleHistoryItem => ({
  id: b.id,
  property: {
    title: b.property.title,
    propertyType: b.property.property_type,
    zone: b.property.zone,
  },
  client: b.client,
  agent: b.agent,
  salePrice: b.sale_price,
  paymentMethod: b.payment_method,
  closedAt: b.closed_at,
});

// ─── Action ───────────────────────────────────────────────────────────────────

export const getAdminHistoryAction = async (
  params?: GetAdminHistoryParams
): Promise<Paginated<AdminSaleHistoryItem>> => {
  try {
    const { data } = await adminApi.getSalesHistory(params);
    return { ...data, results: data.results.map(mapAdminSaleHistoryItem) };
  } catch (error) {
    console.error("[getAdminHistoryAction] Error al obtener historial:", error);
    throw error;
  }
};
