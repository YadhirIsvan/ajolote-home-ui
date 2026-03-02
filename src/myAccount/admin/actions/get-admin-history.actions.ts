import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminSaleHistoryItem, Paginated } from "@/myAccount/admin/types/admin.types";

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

export const getAdminHistoryAction = async (
  params?: GetAdminHistoryParams
): Promise<Paginated<AdminSaleHistoryItem>> => {
  const { data } = await adminApi.getSalesHistory(params as Record<string, unknown>);
  return data as Paginated<AdminSaleHistoryItem>;
};
