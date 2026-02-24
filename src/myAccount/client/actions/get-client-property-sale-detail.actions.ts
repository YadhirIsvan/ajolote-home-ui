import { clientApi } from "@/myAccount/client/api/client.api";
import type { PropertySaleItem } from "@/myAccount/client/types/client.types";

export const getClientPropertySaleDetailAction = async (
  id: number,
  fallback?: PropertySaleItem
): Promise<PropertySaleItem> => {
  try {
    const { data } = await clientApi.getPropertySaleDetail(id);
    return data as PropertySaleItem;
  } catch {
    if (fallback) return fallback;
    throw new Error(`No se pudo cargar el detalle de la propiedad ${id}`);
  }
};
