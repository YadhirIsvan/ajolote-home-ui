import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { NaturalSearchResult } from "@/buy/types/property.types";

export const naturalSearchAction = async (
  query: string
): Promise<NaturalSearchResult> => {
  const response = await buyApi.post<NaturalSearchResult>(
    ENDPOINTS.NATURAL_SEARCH,
    { query }
  );
  return response.data;
};
