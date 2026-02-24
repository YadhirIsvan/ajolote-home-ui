import buyApi, { ENDPOINTS } from "@/buy/api/buy.api";
import type { PropertyDetailData } from "@/buy/types/property.types";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface GetPropertyDetailResponse {
  data: PropertyDetailData;
  fromFallback: boolean;
}

const FALLBACK_PROPERTY: PropertyDetailData = {
  id: 1,
  images: [property1, property2, property3, property1, property2],
  price: "$4,500,000",
  title: "Casa Moderna en Zona Residencial Premium",
  address: "Orizaba, Veracruz",
  beds: 3,
  baths: 2,
  sqm: 180,
  verified: true,
  status: "Disponible",
  description:
    "Hermosa casa de diseño contemporáneo en una de las zonas más exclusivas de Orizaba. Cuenta con amplios espacios, jardín privado, y acabados de primera calidad. Perfecta para familias que buscan confort y seguridad. La propiedad incluye cocina integral de granito, pisos de mármol en áreas comunes, sistema de seguridad inteligente, y estacionamiento para 2 vehículos. Ubicada cerca de escuelas, hospitales y centros comerciales.",
  coordinates: { lat: 18.91583, lng: -96.98977 },
  "nearby-places": [
    { icon: "school", label: "5 min de Escuelas" },
    { icon: "shopping", label: "10 min de Centros Comerciales" },
    { icon: "hospital", label: "8 min de Hospitales" },
    { icon: "transport", label: "3 min de Transporte" },
  ],
  agent: {
    name: "María González",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    phone: 2721234567,
    email: "maria@vycite.com",
  },
};

export const getPropertyDetailAction = async (
  id: number
): Promise<GetPropertyDetailResponse> => {
  try {
    const { data } = await buyApi.get<PropertyDetailData>(ENDPOINTS.PROPERTY_DETAIL(id));
    return { data, fromFallback: false };
  } catch {
    return {
      data: { ...FALLBACK_PROPERTY, id },
      fromFallback: true,
    };
  }
};
