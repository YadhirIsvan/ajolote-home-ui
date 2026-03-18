export interface PropertyListItem {
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
  daysListed: number;
  interested: number;
  views: number;
  isFeatured: boolean;
  isVerified: boolean;
}

export interface GetFeaturedPropertiesParams {
  zone?: string;
  type?: string;
  state?: string;
  amenities?: string[];
  limit?: number;
  offset?: number;
}

export const HOME_ZONES = [
  "Orizaba",
  "Córdoba",
  "Fortín",
  "Peñuela",
  "Amatlán",
  "Río Blanco",
  "Nogales",
] as const;

export type HomeZone = (typeof HOME_ZONES)[number];
