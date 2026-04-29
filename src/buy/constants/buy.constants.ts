import type { BuyFilters, PriceOrdering } from "@/buy/types/property.types";

export const DEFAULT_BUY_FILTERS: BuyFilters = {
  zone: "Todas las zonas",
  priceRange: [500000, 20000000],
  type: "all",
  amenities: [],
  state: "all",
  ordering: "" as PriceOrdering,
  bedroomsMin: null,
  bathroomsMin: null,
  parkingMin: null,
  sqmMin: null,
  sqmMax: null,
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
  { id: "1", label: "Alberca" },
  { id: "2", label: "Gimnasio" },
  { id: "3", label: "Seguridad 24/7" },
  { id: "5", label: "Estacionamiento" },
  { id: "6", label: "Jardín" },
] as const;

export const PRICE_RANGE_LIMITS = {
  min: 500_000,
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
