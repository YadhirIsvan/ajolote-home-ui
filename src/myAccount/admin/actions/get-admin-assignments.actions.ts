import { adminApi } from "@/myAccount/admin/api/admin.api";
import type { AdminAssignmentsResponse } from "@/myAccount/admin/types/admin.types";

export const getAdminAssignmentsAction =
  async (): Promise<AdminAssignmentsResponse> => {
    try {
      const { data } = await adminApi.getAssignments();
      return data;
    } catch (error) {
      console.error("[getAdminAssignmentsAction] Error al obtener asignaciones:", error);
      throw error;
    }
  };

export const createAdminAssignmentAction = async (
  propertyId: number,
  agentMembershipId: number,
  isVisible = true
): Promise<void> => {
  try {
    await adminApi.createAssignment(propertyId, agentMembershipId, isVisible);
  } catch (error) {
    console.error("[createAdminAssignmentAction] Error al crear asignación:", error);
    throw error;
  }
};

export const deleteAdminAssignmentAction = async (id: number): Promise<void> => {
  try {
    await adminApi.deleteAssignment(id);
  } catch (error) {
    console.error("[deleteAdminAssignmentAction] Error al eliminar asignación:", error);
    throw error;
  }
};
