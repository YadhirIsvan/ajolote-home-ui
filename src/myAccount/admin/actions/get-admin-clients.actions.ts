import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminClient, AdminClientDetail, Paginated } from "@/myAccount/admin/types/admin.types";

export const getAdminClientsAction = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminClient>> => {
  const { data } = await adminApi.getClients(params as Record<string, unknown>);
  return data as Paginated<AdminClient>;
};

export const getAdminClientDetailAction = async (id: number): Promise<AdminClientDetail> => {
  const { data } = await adminApi.getClientDetail(id);
  return data as AdminClientDetail;
};
