import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { BackendAdminPurchaseProcess, BackendAdminSaleProcess } from "@/myAccount/admin/api/admin.api";
import type {
  AdminPurchaseProcess,
  AdminSaleProcess,
  PurchaseProcessStatus,
  SaleProcessStatus,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapAdminPurchaseProcess = (b: BackendAdminPurchaseProcess): AdminPurchaseProcess => ({
  id: b.id,
  status: b.status as PurchaseProcessStatus,
  overallProgress: b.overall_progress,
  client: b.client,
  property: b.property,
  agent: b.agent,
  createdAt: b.created_at,
  updatedAt: b.updated_at,
});

const mapAdminSaleProcess = (b: BackendAdminSaleProcess): AdminSaleProcess => ({
  id: b.id,
  status: b.status as SaleProcessStatus,
  property: b.property,
  client: b.client,
  agent: b.agent,
  createdAt: b.created_at,
  updatedAt: b.updated_at,
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getAdminPurchaseProcessesAction = async (params?: {
  status?: PurchaseProcessStatus;
  agent_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminPurchaseProcess>> => {
  try {
    const { data } = await adminApi.getPurchaseProcesses(params);
    return { ...data, results: data.results.map(mapAdminPurchaseProcess) };
  } catch (error) {
    console.error("[getAdminPurchaseProcessesAction] Error al obtener pipeline de compra:", error);
    throw error;
  }
};

export const updatePurchaseProcessStatusAction = async (
  id: number,
  status: PurchaseProcessStatus,
  notes?: string,
  extra?: Record<string, unknown>
): Promise<void> => {
  try {
    await adminApi.updatePurchaseProcessStatus(id, { status, notes, ...extra });
  } catch (error) {
    console.error("[updatePurchaseProcessStatusAction] Error al actualizar proceso de compra:", error);
    throw error;
  }
};

export const getAdminSaleProcessesAction = async (params?: {
  status?: SaleProcessStatus;
  agent_id?: number;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminSaleProcess>> => {
  try {
    const { data } = await adminApi.getSaleProcesses(params);
    return { ...data, results: data.results.map(mapAdminSaleProcess) };
  } catch (error) {
    console.error("[getAdminSaleProcessesAction] Error al obtener pipeline de venta:", error);
    throw error;
  }
};

export const updateSaleProcessStatusAction = async (
  id: number,
  status: SaleProcessStatus,
  notes?: string
): Promise<void> => {
  try {
    await adminApi.updateSaleProcessStatus(id, { status, notes });
  } catch (error) {
    console.error("[updateSaleProcessStatusAction] Error al actualizar proceso de venta:", error);
    throw error;
  }
};
