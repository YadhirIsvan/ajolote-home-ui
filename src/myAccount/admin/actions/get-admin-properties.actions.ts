import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminProperty, Paginated } from "@/myAccount/admin/types/admin.types";

export interface GetAdminPropertiesParams {
  search?: string;
  status?: string;
  listing_type?: string;
  property_type?: string;
  agent_id?: number;
  limit?: number;
  offset?: number;
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
