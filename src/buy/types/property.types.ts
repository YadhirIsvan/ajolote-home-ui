export interface BuyPropertyListItem {
  id: number;
  image: string;
  price: string;
  priceNum: number;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqm: number;
  type: string;
  state: string;
}

export interface PropertyDetailData {
  id: number;
  images: string[];
  price: string;
  title: string;
  address: string;
  beds: number;
  baths: number;
  sqm: number;
  verified: boolean;
  status: string;
  description: string;
  video_id?: string;
  video_img?: string;
  coordinates: { lat: number; lng: number };
  "nearby-places"?: { icon: string; label: string }[];
  agent: { name: string; photo: string; phone: number; email: string };
}

export interface GetPropertiesParams {
  zone?: string;
  type?: string;
  state?: string;
  amenities?: string[];
  limit?: number;
  offset?: number;
}

export interface BuyFilters {
  zone: string;
  priceRange: [number, number];
  type: string;
  amenities: string[];
  state: string;
}

export const DEFAULT_BUY_FILTERS: BuyFilters = {
  zone: "Todas las zonas",
  priceRange: [0, 20000000],
  type: "all",
  amenities: [],
  state: "all",
};

export const BUY_ZONES = [
  "Todas las zonas",
  "Orizaba",
  "Córdoba",
  "Fortín",
  "Peñuela",
  "Amatlán",
  "Río Blanco",
  "Nogales",
] as const;

export const PROPERTY_TYPES = [
  { value: "all", label: "Todos" },
  { value: "casa", label: "Casa" },
  { value: "departamento", label: "Departamento" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local Comercial" },
] as const;

export const PROPERTY_STATES = [
  { value: "all", label: "Todos" },
  { value: "nueva", label: "Nueva" },
  { value: "preventa", label: "Preventa" },
  { value: "usada", label: "Usada" },
] as const;

export const AMENITY_OPTIONS = [
  { id: "pool", label: "Alberca" },
  { id: "security", label: "Seguridad 24/7" },
  { id: "garden", label: "Jardín" },
  { id: "parking", label: "Estacionamiento" },
  { id: "gym", label: "Gimnasio" },
] as const;

export const PRICE_RANGE_LIMITS = {
  min: 0,
  max: 20_000_000,
  step: 100_000,
} as const;

export const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
] as const;
