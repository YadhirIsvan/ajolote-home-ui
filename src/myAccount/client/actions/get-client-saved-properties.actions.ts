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

export async function getClientSavedPropertiesAction(): Promise<SavedPropertyItem[]> {
  try {
    const response = await clientApi.getSavedProperties();
    const results = response.data?.results ?? response.data ?? [];

    return results.map((item: any) => ({
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
    console.error("Error fetching saved properties:", error);
    return [];
  }
}
