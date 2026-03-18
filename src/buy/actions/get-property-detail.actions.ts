import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { PropertyDetailData } from "@/buy/types/property.types";

export interface GetPropertyDetailResponse {
  data: PropertyDetailData;
  fromFallback: boolean;
}

interface BackendNearbyPlace {
  name: string;
  place_type: string;
  distance_km: string;
}

interface BackendImage {
  id: number;
  image_url: string;
  is_cover: boolean;
  sort_order: number;
}

interface BackendPropertyDetail {
  id: number;
  title: string;
  description: string;
  price: string;
  currency: string;
  property_type: string;
  property_condition: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  construction_sqm: string;
  land_sqm: string;
  address: string;
  zone: string;
  latitude: string;
  longitude: string;
  is_verified: boolean;
  views: number;
  days_listed: number;
  interested: number;
  images: BackendImage[];
  amenities: { id: number; name: string; icon: string }[];
  nearby_places: BackendNearbyPlace[];
  video_id?: string;
  video_thumbnail?: string;
  agent: { name: string; photo: string; phone: string; email: string };
  coordinates: { lat: number; lng: number };
}

const formatPrice = (raw: string): string => {
  const num = parseFloat(raw);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(num);
};

const mapDetail = (item: BackendPropertyDetail): PropertyDetailData => ({
  id: item.id,
  title: item.title,
  description: item.description,
  address: item.address,
  price: formatPrice(item.price),
  beds: item.bedrooms,
  baths: item.bathrooms,
  sqm: parseFloat(item.construction_sqm),
  landSqm: item.land_sqm ? parseFloat(item.land_sqm) : undefined,
  verified: item.is_verified,
  status: item.status,
  images: item.images
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.image_url),
  videoId: item.video_id,
  videoImg: item.video_thumbnail,
  coordinates: item.coordinates || {
    lat: parseFloat(item.latitude) || 0,
    lng: parseFloat(item.longitude) || 0,
  },
  nearbyPlaces: item.nearby_places.map((place) => ({
    icon: place.place_type,
    label: `${place.name} - ${parseFloat(place.distance_km).toFixed(1)} km`,
  })),
  amenities: item.amenities,
  agent: item.agent
    ? {
        name: item.agent.name,
        photo: item.agent.photo,
        phone: item.agent.phone,
        email: item.agent.email,
      }
    : null,
});

export const getPropertyDetailAction = async (
  id: number
): Promise<GetPropertyDetailResponse> => {
  try {
    const { data } = await buyApi.get<BackendPropertyDetail>(
      ENDPOINTS.PROPERTY_DETAIL(id)
    );
    return { data: mapDetail(data), fromFallback: false };
  } catch (error) {
    console.error("[getPropertyDetailAction] Error al obtener detalle de propiedad:", error);
    return {
      data: {
        id,
        images: [],
        price: "",
        title: "Propiedad no encontrada",
        address: "",
        beds: 0,
        baths: 0,
        sqm: 0,
        landSqm: undefined,
        verified: false,
        status: "",
        description: "",
        coordinates: { lat: 0, lng: 0 },
        amenities: [],
        agent: { name: "", photo: "", phone: "", email: "" },
      },
      fromFallback: true,
    };
  }
};
