import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  AdminPurchaseProcess,
  AdminSaleProcess,
  PurchaseProcessStatus,
  SaleProcessStatus,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

export const getAdminPurchaseProcessesAction = async (params?: {
  status?: PurchaseProcessStatus;
  agent_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminPurchaseProcess>> => {
  const { data } = await adminApi.getPurchaseProcesses(params as Record<string, unknown>);
  return data as Paginated<AdminPurchaseProcess>;
};

export const updatePurchaseProcessStatusAction = async (
  id: number,
  status: PurchaseProcessStatus,
  notes?: string,
  extra?: Record<string, unknown>
): Promise<void> => {
  await adminApi.updatePurchaseProcessStatus(id, { status, notes, ...extra });
};

export const getAdminSaleProcessesAction = async (params?: {
  status?: SaleProcessStatus;
  agent_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminSaleProcess>> => {
  const { data } = await adminApi.getSaleProcesses(params as Record<string, unknown>);
  return data as Paginated<AdminSaleProcess>;
};

export const updateSaleProcessStatusAction = async (
  id: number,
  status: SaleProcessStatus,
  notes?: string
): Promise<void> => {
  await adminApi.updateSaleProcessStatus(id, { status, notes });
};
