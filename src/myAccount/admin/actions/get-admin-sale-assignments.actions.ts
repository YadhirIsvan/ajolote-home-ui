import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { SaleProcessAssignmentsResponse } from "@/myAccount/admin/types/admin.types";

export const getSaleProcessAssignmentsAction =
  async (): Promise<SaleProcessAssignmentsResponse> => {
    const { data } = await adminApi.getSaleProcessAssignments();
    return data as SaleProcessAssignmentsResponse;
  };

export const assignSaleProcessAgentAction = async (
  saleProcessId: number,
  agentMembershipId: number
): Promise<void> => {
  await adminApi.assignSaleProcessAgent(saleProcessId, agentMembershipId);
};

export const unassignSaleProcessAgentAction = async (
  saleProcessId: number
): Promise<void> => {
  await adminApi.unassignSaleProcessAgent(saleProcessId);
};
