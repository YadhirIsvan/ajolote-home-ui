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
  days_listed: number;
  interested: number;
  views: number;
  is_featured: boolean;
  is_verified: boolean;
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
  land_sqm?: number;
  verified: boolean;
  status: string;
  description: string;
  video_id?: string;
  video_img?: string;
  coordinates: { lat: number; lng: number };
  "nearby-places"?: { icon: string; label: string }[];
  amenities?: { id: number; name: string; icon: string }[];
  agent: { name: string; photo: string; phone: string; email: string } | null;
}

export interface AppointmentData {
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
}

export interface AppointmentResponse {
  id: number;
  matricula: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  property: { id: number; title: string };
  agent: { name: string };
}

export interface AppointmentSlotsResponse {
  date: string;
  agent: { name: string };
  available_slots: string[];
  slot_duration_minutes: number;
}

export type AppointmentSlot = string;

export interface GetPropertiesParams {
  zone?: string;
  type?: string;
  state?: string;
  amenities?: string[];
  price_min?: number;
  price_max?: number;
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

// IDs numéricos reales del catálogo del backend (/catalogs/amenities)
export const AMENITY_OPTIONS = [
  { id: "1", label: "Alberca" },
  { id: "2", label: "Gimnasio" },
  { id: "3", label: "Seguridad 24/7" },
  { id: "5", label: "Estacionamiento" },
  { id: "6", label: "Jardín" },
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
