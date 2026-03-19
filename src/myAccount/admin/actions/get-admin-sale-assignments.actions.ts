import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  BackendSaleProcessAssignmentsResponse,
  BackendSaleProcessAssignmentEntry,
} from "@/myAccount/admin/api/admin.api";
import type {
  SaleProcessAssignmentsResponse,
  SaleProcessAssignmentEntry,
} from "@/myAccount/admin/types/admin.types";

// ─── Mapper ───────────────────────────────────────────────────────────────────

const mapSaleProcessEntry = (b: BackendSaleProcessAssignmentEntry): SaleProcessAssignmentEntry => ({
  saleProcessId: b.sale_process_id,
  property: {
    id: b.property.id,
    title: b.property.title,
    propertyType: b.property.property_type,
    image: b.property.image,
    price: b.property.price,
    address: b.property.address,
  },
  status: b.status,
  agent: b.agent ? { membershipId: b.agent.membership_id, name: b.agent.name } : null,
});

const mapSaleProcessAssignmentsResponse = (
  b: BackendSaleProcessAssignmentsResponse
): SaleProcessAssignmentsResponse => ({
  unassigned: b.unassigned.map(mapSaleProcessEntry),
  assigned: b.assigned.map(mapSaleProcessEntry),
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getSaleProcessAssignmentsAction =
  async (): Promise<SaleProcessAssignmentsResponse> => {
    try {
      const { data } = await adminApi.getSaleProcessAssignments();
      return mapSaleProcessAssignmentsResponse(data);
    } catch (error) {
      console.error("[getSaleProcessAssignmentsAction] Error al obtener asignaciones de venta:", error);
      throw error;
    }
  };

export const assignSaleProcessAgentAction = async (
  saleProcessId: number,
  agentMembershipId: number
): Promise<void> => {
  try {
    await adminApi.assignSaleProcessAgent(saleProcessId, agentMembershipId);
  } catch (error) {
    console.error("[assignSaleProcessAgentAction] Error al asignar agente:", error);
    throw error;
  }
};

export const unassignSaleProcessAgentAction = async (
  saleProcessId: number
): Promise<void> => {
  try {
    await adminApi.unassignSaleProcessAgent(saleProcessId);
  } catch (error) {
    console.error("[unassignSaleProcessAgentAction] Error al desasignar agente:", error);
    throw error;
  }
};
