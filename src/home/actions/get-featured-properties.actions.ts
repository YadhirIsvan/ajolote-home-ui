import homeApi, { ENDPOINTS } from "@/home/api/home.api";
import type { GetFeaturedPropertiesParams, PropertyListItem } from "@/home/types/property.types";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface GetFeaturedPropertiesResponse {
  data: PropertyListItem[];
  fromFallback: boolean;
}

const FALLBACK_PROPERTIES: PropertyListItem[] = [
  { id: 1, image: property1, price: "$4,500,000", priceNum: 4500000, title: "Casa Moderna en Zona Residencial", address: "Orizaba, Veracruz", beds: 3, baths: 2, sqm: 180, type: "casa", state: "nueva" },
  { id: 2, image: property2, price: "$6,800,000", priceNum: 6800000, title: "Departamento de Lujo con Vista Panorámica", address: "Córdoba, Veracruz", beds: 2, baths: 2, sqm: 145, type: "departamento", state: "preventa" },
  { id: 3, image: property3, price: "$12,500,000", priceNum: 12500000, title: "Villa con Jardín Amplio", address: "Fortín, Veracruz", beds: 4, baths: 3, sqm: 320, type: "casa", state: "usada" },
  { id: 4, image: property1, price: "$3,200,000", priceNum: 3200000, title: "Casa Colonial Restaurada", address: "Peñuela, Veracruz", beds: 4, baths: 3, sqm: 220, type: "casa", state: "usada" },
  { id: 5, image: property2, price: "$5,900,000", priceNum: 5900000, title: "Penthouse Contemporáneo", address: "Amatlán, Veracruz", beds: 3, baths: 3, sqm: 200, type: "departamento", state: "nueva" },
  { id: 6, image: property3, price: "$8,500,000", priceNum: 8500000, title: "Residencia con Alberca", address: "Río Blanco, Veracruz", beds: 5, baths: 4, sqm: 380, type: "casa", state: "preventa" },
];

export const getFeaturedPropertiesAction = async (
  params: GetFeaturedPropertiesParams
): Promise<GetFeaturedPropertiesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.zone) searchParams.set("zone", params.zone);
  if (params.type) searchParams.set("type", params.type);
  if (params.state) searchParams.set("state", params.state);
  if (params.amenities?.length) {
    params.amenities.forEach((a) => searchParams.append("amenities", a));
  }
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.offset != null) searchParams.set("offset", String(params.offset));

  try {
    const url = `${ENDPOINTS.FEATURED_PROPERTIES}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const { data } = await homeApi.get<PropertyListItem[]>(url);

    return { data, fromFallback: false };
  } catch {
    const fallback = params.zone
      ? FALLBACK_PROPERTIES.filter((p) => p.address.includes(params.zone!))
      : FALLBACK_PROPERTIES;

    return {
      data: fallback.length ? fallback : FALLBACK_PROPERTIES,
      fromFallback: true,
    };
  }
};
