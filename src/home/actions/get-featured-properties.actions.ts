import { homeApi, ENDPOINTS } from "@/home/api/home.api";
import type { GetFeaturedPropertiesParams, PropertyListItem } from "@/home/types/property.types";

export interface GetFeaturedPropertiesResponse {
  data: PropertyListItem[];
  fromFallback: boolean;
}

interface BackendPropertyItem {
  id: number;
  title: string;
  address: string;
  price: string;
  property_type: string;
  property_condition: string;
  bedrooms: number;
  bathrooms: number;
  construction_sqm: string;
  image: string | null;
  is_verified: boolean;
  is_featured: boolean;
  days_listed: number;
  interested: number;
  views: number;
}

interface BackendPaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BackendPropertyItem[];
}

const TYPE_MAP: Record<string, string> = {
  casa: "house",
  departamento: "apartment",
  terreno: "land",
  local: "commercial",
};

const STATE_MAP: Record<string, string> = {
  nueva: "new",
  preventa: "new",
  usada: "used",
  semi_new: "semi_new",
};

const formatPrice = (raw: string): string => {
  const num = parseFloat(raw);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(num);
};

const mapItem = (item: BackendPropertyItem): PropertyListItem => ({
  id: item.id,
  title: item.title,
  address: item.address,
  image: item.image || "/placeholder.svg",
  price: formatPrice(item.price),
  priceNum: parseFloat(item.price),
  beds: item.bedrooms,
  baths: item.bathrooms,
  sqm: item.construction_sqm ? parseFloat(item.construction_sqm) : 0,
  type: item.property_type,
  state: item.property_condition,
  days_listed: item.days_listed,
  interested: item.interested,
  views: item.views,
  is_featured: item.is_featured,
  is_verified: item.is_verified,
});

export const getFeaturedPropertiesAction = async (
  params: GetFeaturedPropertiesParams
): Promise<GetFeaturedPropertiesResponse> => {
  const searchParams = new URLSearchParams();

  searchParams.set("featured", "true");

  if (params.zone) searchParams.set("zone", params.zone);
  if (params.type && params.type !== "all") {
    searchParams.set("type", TYPE_MAP[params.type] ?? params.type);
  }
  if (params.state && params.state !== "all") {
    searchParams.set("state", STATE_MAP[params.state] ?? params.state);
  }
  if (params.amenities?.length) {
    params.amenities.forEach((a) => searchParams.append("amenities", a));
  }
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.offset != null) searchParams.set("offset", String(params.offset));

  try {
    const url = `${ENDPOINTS.FEATURED_PROPERTIES}?${searchParams.toString()}`;
    const { data } = await homeApi.get<BackendPaginatedResponse>(url);
    return { data: data.results.map(mapItem), fromFallback: false };
  } catch {
    return { data: [], fromFallback: true };
  }
};
