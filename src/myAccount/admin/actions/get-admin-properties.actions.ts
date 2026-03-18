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
  try {
    const { data } = await adminApi.getProperties(params);
    return data;
  } catch (error) {
    console.error("[getAdminPropertiesAction] Error al obtener propiedades:", error);
    throw error;
  }
};

export const deleteAdminPropertyAction = async (id: number): Promise<void> => {
  try {
    await adminApi.deleteProperty(id);
  } catch (error) {
    console.error("[deleteAdminPropertyAction] Error al eliminar propiedad:", error);
    throw error;
  }
};

export const toggleAdminPropertyFeaturedAction = async (
  id: number
): Promise<{ is_featured: boolean }> => {
  try {
    const { data } = await adminApi.toggleFeatured(id);
    return data;
  } catch (error) {
    console.error("[toggleAdminPropertyFeaturedAction] Error al alternar destacado:", error);
    throw error;
  }
};

export const getAdminPropertyDetailAction = async (
  id: number
): Promise<AdminPropertyDetail> => {
  try {
    const { data } = await adminApi.getPropertyDetail(id);
    return data;
  } catch (error) {
    console.error("[getAdminPropertyDetailAction] Error al obtener detalle de propiedad:", error);
    throw error;
  }
};

export const createAdminPropertyAction = async (
  payload: PropertyFormPayload
): Promise<AdminPropertyDetail> => {
  try {
    const { data } = await adminApi.createProperty(payload);
    return data;
  } catch (error) {
    console.error("[createAdminPropertyAction] Error al crear propiedad:", error);
    throw error;
  }
};

export const updateAdminPropertyAction = async (
  id: number,
  payload: Partial<PropertyFormPayload>
): Promise<AdminPropertyDetail> => {
  try {
    const { data } = await adminApi.updateProperty(id, payload);
    return data;
  } catch (error) {
    console.error("[updateAdminPropertyAction] Error al actualizar propiedad:", error);
    throw error;
  }
};

export const uploadAdminPropertyImagesAction = async (
  propertyId: number,
  files: File[],
  setCover = false
): Promise<AdminPropertyImage[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    if (setCover) formData.append("is_cover", "true");
    const { data } = await adminApi.uploadPropertyImages(propertyId, formData);
    return data;
  } catch (error) {
    console.error("[uploadAdminPropertyImagesAction] Error al subir imágenes:", error);
    throw error;
  }
};

export const deleteAdminPropertyImageAction = async (
  propertyId: number,
  imageId: number
): Promise<void> => {
  try {
    await adminApi.deletePropertyImage(propertyId, imageId);
  } catch (error) {
    console.error("[deleteAdminPropertyImageAction] Error al eliminar imagen:", error);
    throw error;
  }
};

export const getAdminStatesAction = async (): Promise<CatalogState[]> => {
  try {
    const { data } = await adminApi.getStates();
    return data.results;
  } catch (error) {
    console.error("[getAdminStatesAction] Error al obtener estados:", error);
    throw error;
  }
};

export const getAdminCitiesAction = async (stateId: number): Promise<CatalogCity[]> => {
  try {
    const { data } = await adminApi.getCities(stateId);
    return data.results;
  } catch (error) {
    console.error("[getAdminCitiesAction] Error al obtener ciudades:", error);
    throw error;
  }
};

export const getAdminAmenitiesAction = async (): Promise<CatalogAmenity[]> => {
  try {
    const { data } = await adminApi.getAmenities();
    return data.results;
  } catch (error) {
    console.error("[getAdminAmenitiesAction] Error al obtener amenidades:", error);
    throw error;
  }
};
