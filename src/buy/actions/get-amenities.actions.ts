import { buyApi } from "@/buy/api/buy.api";

export interface AmenityItem {
  id: number;
  name: string;
  icon: string;
}

export const getAmenitiesAction = async (): Promise<AmenityItem[]> => {
  try {
    const { data } = await buyApi.get<AmenityItem[]>("/catalogs/amenities");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[getAmenitiesAction] Error al obtener catálogo de amenidades:", error);
    return [];
  }
};
