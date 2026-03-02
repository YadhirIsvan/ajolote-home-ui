import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { BuyPropertyListItem, GetPropertiesParams } from "@/buy/types/property.types";

export interface GetPropertiesResponse {
  data: BuyPropertyListItem[];
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

const mapItem = (item: BackendPropertyItem): BuyPropertyListItem => ({
  id: item.id,
  title: item.title,
  address: item.address,
  image: item.image ?? "",
  price: formatPrice(item.price),
  priceNum: parseFloat(item.price),
  beds: item.bedrooms,
  baths: item.bathrooms,
  sqm: parseFloat(item.construction_sqm),
  type: item.property_type,
  state: item.property_condition,
  days_listed: item.days_listed,
  interested: item.interested,
  views: item.views,
  is_featured: item.is_featured,
  is_verified: item.is_verified,
});

export const getPropertiesAction = async (
  params: GetPropertiesParams
): Promise<GetPropertiesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.zone) searchParams.set("zone", params.zone);
  if (params.type) searchParams.set("type", TYPE_MAP[params.type] ?? params.type);
  if (params.state) searchParams.set("state", STATE_MAP[params.state] ?? params.state);
  if (params.amenities?.length) {
    params.amenities.forEach((a) => searchParams.append("amenities", a));
  }
  if (params.price_min != null) searchParams.set("price_min", String(params.price_min));
  if (params.price_max != null) searchParams.set("price_max", String(params.price_max));
  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.offset != null) searchParams.set("offset", String(params.offset));

  try {
    const url = `${ENDPOINTS.PROPERTIES}?${searchParams.toString()}`;
    const { data } = await buyApi.get<BackendPaginatedResponse>(url);
    return { data: data.results.map(mapItem), fromFallback: false };
  } catch {
    return { data: [], fromFallback: true };
  }
};
