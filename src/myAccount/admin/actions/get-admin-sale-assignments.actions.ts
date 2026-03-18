import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { SaleProcessAssignmentsResponse } from "@/myAccount/admin/types/admin.types";

export const getSaleProcessAssignmentsAction =
  async (): Promise<SaleProcessAssignmentsResponse> => {
    try {
      const { data } = await adminApi.getSaleProcessAssignments();
      return data;
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
