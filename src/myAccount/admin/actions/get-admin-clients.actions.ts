import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  BackendAdminClient,
  BackendAdminClientDetail,
  BackendAdminClientPurchaseProcess,
  BackendAdminClientSaleProcess,
  AdminClient,
  AdminClientDetail,
  AdminClientPurchaseProcess,
  AdminClientSaleProcess,
  PurchaseProcessStatus,
  SaleProcessStatus,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapAdminClient = (b: BackendAdminClient): AdminClient => ({
  id: b.id,
  membershipId: b.membership_id,
  name: b.name,
  email: b.email,
  phone: b.phone,
  avatar: b.avatar,
  city: b.city,
  purchaseProcessesCount: b.purchase_processes_count,
  saleProcessesCount: b.sale_processes_count,
  dateJoined: b.date_joined,
});

const mapClientPurchaseProcess = (b: BackendAdminClientPurchaseProcess): AdminClientPurchaseProcess => ({
  id: b.id,
  status: b.status as PurchaseProcessStatus,
  overallProgress: b.overall_progress,
  property: b.property,
  agent: b.agent,
  documents: b.documents,
  createdAt: b.created_at,
});

const mapClientSaleProcess = (b: BackendAdminClientSaleProcess): AdminClientSaleProcess => ({
  id: b.id,
  status: b.status as SaleProcessStatus,
  property: b.property,
  agent: b.agent,
  createdAt: b.created_at,
});

const mapAdminClientDetail = (b: BackendAdminClientDetail): AdminClientDetail => ({
  id: b.id,
  membershipId: b.membership_id,
  name: b.name,
  email: b.email,
  phone: b.phone,
  avatar: b.avatar,
  city: b.city,
  purchaseProcesses: b.purchase_processes.map(mapClientPurchaseProcess),
  saleProcesses: b.sale_processes.map(mapClientSaleProcess),
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getAdminClientsAction = async (params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminClient>> => {
  try {
    const { data } = await adminApi.getClients(params);
    return { ...data, results: data.results.map(mapAdminClient) };
  } catch (error) {
    console.error("[getAdminClientsAction] Error al obtener clientes:", error);
    throw error;
  }
};

export const getAdminClientDetailAction = async (id: number): Promise<AdminClientDetail> => {
  try {
    const { data } = await adminApi.getClientDetail(id);
    return mapAdminClientDetail(data);
  } catch (error) {
    console.error("[getAdminClientDetailAction] Error al obtener detalle del cliente:", error);
    throw error;
  }
};
