import { clientApi } from "@/myAccount/client/api/client.api";

export interface SavedPropertyItem {
  id: number;
  propertyId: number;
  title: string;
  address: string;
  price: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  constructionSqm: string | null;
  image: string | null;
  isVerified: boolean;
  savedAt: string;
}

interface BackendSavedPropertyEntry {
  id: number;
  saved_at: string;
  property: {
    id: number;
    title: string;
    address: string;
    price: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    construction_sqm: string | null;
    image: string | null;
    is_verified: boolean;
  };
}

interface BackendSavedPropertiesResponse {
  results?: BackendSavedPropertyEntry[];
}

export async function getClientSavedPropertiesAction(): Promise<SavedPropertyItem[]> {
  try {
    const response = await clientApi.getSavedProperties();
    const raw = response.data as BackendSavedPropertiesResponse;
    const results: BackendSavedPropertyEntry[] = raw?.results ?? (response.data as BackendSavedPropertyEntry[]) ?? [];
    return results.map((item) => ({
      id: item.id,
      propertyId: item.property.id,
      title: item.property.title,
      address: item.property.address,
      price: item.property.price,
      propertyType: item.property.property_type,
      bedrooms: item.property.bedrooms,
      bathrooms: item.property.bathrooms,
      constructionSqm: item.property.construction_sqm,
      image: item.property.image,
      isVerified: item.property.is_verified,
      savedAt: item.saved_at,
    }));
  } catch (error) {
    console.error("[getClientSavedPropertiesAction] Error al obtener propiedades guardadas:", error);
    return [];
  }
}
