import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  AdminProperty,
  AdminPropertyDetail,
  AdminPropertyImage,
  CatalogState,
  CatalogCity,
  CatalogAmenity,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

export interface GetAdminPropertiesParams {
  search?: string;
  status?: string;
  listing_type?: string;
  property_type?: string;
  agent_id?: number;
  limit?: number;
  offset?: number;
}

export interface PropertyFormPayload {
  title: string;
  description: string;
  listing_type: string;
  status: string;
  property_type: string;
  property_condition: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  construction_sqm: string;
  land_sqm: string;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_zip: string;
  city: number | null;
  zone: string;
  video_id: string;
  latitude: string | null;
  longitude: string | null;
  is_featured: boolean;
  amenity_ids: number[];
}

export const getAdminPropertiesAction = async (
  params?: GetAdminPropertiesParams
): Promise<Paginated<AdminProperty>> => {
  const { data } = await adminApi.getProperties(params as Record<string, unknown>);
  return data as Paginated<AdminProperty>;
};

export const deleteAdminPropertyAction = async (id: number): Promise<void> => {
  await adminApi.deleteProperty(id);
};

export const toggleAdminPropertyFeaturedAction = async (
  id: number
): Promise<{ is_featured: boolean }> => {
  const { data } = await adminApi.toggleFeatured(id);
  return data as { is_featured: boolean };
};

export const getAdminPropertyDetailAction = async (
  id: number
): Promise<AdminPropertyDetail> => {
  const { data } = await adminApi.getPropertyDetail(id);
  return data as AdminPropertyDetail;
};

export const createAdminPropertyAction = async (
  payload: PropertyFormPayload
): Promise<AdminPropertyDetail> => {
  const { data } = await adminApi.createProperty(payload as Record<string, unknown>);
  return data as AdminPropertyDetail;
};

export const updateAdminPropertyAction = async (
  id: number,
  payload: Partial<PropertyFormPayload>
): Promise<AdminPropertyDetail> => {
  const { data } = await adminApi.updateProperty(id, payload as Record<string, unknown>);
  return data as AdminPropertyDetail;
};

export const uploadAdminPropertyImagesAction = async (
  propertyId: number,
  files: File[],
  setCover = false
): Promise<AdminPropertyImage[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  if (setCover) formData.append("is_cover", "true");
  const { data } = await adminApi.uploadPropertyImages(propertyId, formData);
  return data as AdminPropertyImage[];
};

export const deleteAdminPropertyImageAction = async (
  propertyId: number,
  imageId: number
): Promise<void> => {
  await adminApi.deletePropertyImage(propertyId, imageId);
};

export const getAdminStatesAction = async (): Promise<CatalogState[]> => {
  const { data } = await adminApi.getStates();
  return (data as { results?: CatalogState[] }).results ?? (data as CatalogState[]);
};

export const getAdminCitiesAction = async (stateId: number): Promise<CatalogCity[]> => {
  const { data } = await adminApi.getCities(stateId);
  return (data as { results?: CatalogCity[] }).results ?? (data as CatalogCity[]);
};

export const getAdminAmenitiesAction = async (): Promise<CatalogAmenity[]> => {
  const { data } = await adminApi.getAmenities();
  return (data as { results?: CatalogAmenity[] }).results ?? (data as CatalogAmenity[]);
};
