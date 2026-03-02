import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAssignmentsResponse } from "@/myAccount/admin/types/admin.types";

export const getAdminAssignmentsAction =
  async (): Promise<AdminAssignmentsResponse> => {
    const { data } = await adminApi.getAssignments();
    return data as AdminAssignmentsResponse;
  };

export const createAdminAssignmentAction = async (
  propertyId: number,
  agentMembershipId: number,
  isVisible = true
): Promise<void> => {
  await adminApi.createAssignment(propertyId, agentMembershipId, isVisible);
};

export const deleteAdminAssignmentAction = async (id: number): Promise<void> => {
  await adminApi.deleteAssignment(id);
};
