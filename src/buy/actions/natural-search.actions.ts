import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { NaturalSearchResult } from "@/buy/types/property.types";

export const naturalSearchAction = async (
  query: string
): Promise<NaturalSearchResult> => {
  try {
    const response = await buyApi.post<NaturalSearchResult>(
      ENDPOINTS.NATURAL_SEARCH,
      { query }
    );
    return response.data;
  } catch (error) {
    console.error("[naturalSearchAction] Error al procesar búsqueda natural:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al procesar la búsqueda"
    );
  }
};
