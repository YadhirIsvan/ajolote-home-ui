import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminClient, AdminClientDetail, Paginated } from "@/myAccount/admin/types/admin.types";

export const getAdminClientsAction = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminClient>> => {
  try {
    const { data } = await adminApi.getClients(params);
    return data;
  } catch (error) {
    console.error("[getAdminClientsAction] Error al obtener clientes:", error);
    throw error;
  }
};

export const getAdminClientDetailAction = async (id: number): Promise<AdminClientDetail> => {
  try {
    const { data } = await adminApi.getClientDetail(id);
    return data;
  } catch (error) {
    console.error("[getAdminClientDetailAction] Error al obtener detalle del cliente:", error);
    throw error;
  }
};
