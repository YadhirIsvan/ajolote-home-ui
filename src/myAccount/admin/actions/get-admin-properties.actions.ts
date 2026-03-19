import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  BackendAdminProperty,
  BackendAdminPropertyImage,
  BackendAdminPropertyDetail,
  BackendCatalogState,
  BackendCatalogCity,
  BackendCatalogAmenity,
} from "@/myAccount/admin/api/admin.api";
import type {
  AdminProperty,
  AdminPropertyImage,
  AdminPropertyDetail,
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

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapAdminPropertyImage = (b: BackendAdminPropertyImage): AdminPropertyImage => ({
  id: b.id,
  imageUrl: b.image_url,
  isCover: b.is_cover,
  sortOrder: b.sort_order,
});

const mapAdminProperty = (b: BackendAdminProperty): AdminProperty => ({
  id: b.id,
  title: b.title,
  address: b.address,
  price: b.price,
  currency: b.currency,
  propertyType: b.property_type,
  listingType: b.listing_type,
  status: b.status,
  isFeatured: b.is_featured,
  isVerified: b.is_verified,
  isActive: b.is_active,
  image: b.image,
  agent: b.agent,
  documentsCount: b.documents_count,
  createdAt: b.created_at,
});

const mapAdminPropertyDetail = (b: BackendAdminPropertyDetail): AdminPropertyDetail => ({
  ...mapAdminProperty(b),
  description: b.description,
  propertyCondition: b.property_condition,
  bedrooms: b.bedrooms,
  bathrooms: b.bathrooms,
  parkingSpaces: b.parking_spaces,
  constructionSqm: b.construction_sqm,
  landSqm: b.land_sqm,
  addressStreet: b.address_street,
  addressNumber: b.address_number,
  addressNeighborhood: b.address_neighborhood,
  addressZip: b.address_zip,
  city: b.city ? { id: b.city.id, name: b.city.name, stateId: b.city.state_id } : null,
  zone: b.zone,
  videoId: b.video_id,
  latitude: b.latitude,
  longitude: b.longitude,
  images: (b.images ?? []).map(mapAdminPropertyImage),
  amenities: b.amenities ?? [],
});

const mapCatalogState = (b: BackendCatalogState): CatalogState => ({
  id: b.id,
  name: b.name,
  code: b.code,
  countryId: b.country_id,
});

const mapCatalogCity = (b: BackendCatalogCity): CatalogCity => ({
  id: b.id,
  name: b.name,
  stateId: b.state_id,
});

const mapCatalogAmenity = (b: BackendCatalogAmenity): CatalogAmenity => ({
  id: b.id,
  name: b.name,
  icon: b.icon,
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getAdminPropertiesAction = async (
  params?: GetAdminPropertiesParams
): Promise<Paginated<AdminProperty>> => {
  try {
    const { data } = await adminApi.getProperties(params);
    return { ...data, results: data.results.map(mapAdminProperty) };
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
): Promise<{ isFeatured: boolean }> => {
  try {
    const { data } = await adminApi.toggleFeatured(id);
    return { isFeatured: data.is_featured };
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
    return mapAdminPropertyDetail(data);
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
    return mapAdminPropertyDetail(data);
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
    return mapAdminPropertyDetail(data);
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
    return data.map(mapAdminPropertyImage);
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
    return data.results.map(mapCatalogState);
  } catch (error) {
    console.error("[getAdminStatesAction] Error al obtener estados:", error);
    throw error;
  }
};

export const getAdminCitiesAction = async (stateId: number): Promise<CatalogCity[]> => {
  try {
    const { data } = await adminApi.getCities(stateId);
    return data.results.map(mapCatalogCity);
  } catch (error) {
    console.error("[getAdminCitiesAction] Error al obtener ciudades:", error);
    throw error;
  }
};

export const getAdminAmenitiesAction = async (): Promise<CatalogAmenity[]> => {
  try {
    const { data } = await adminApi.getAmenities();
    return data.results.map(mapCatalogAmenity);
  } catch (error) {
    console.error("[getAdminAmenitiesAction] Error al obtener amenidades:", error);
    throw error;
  }
};
