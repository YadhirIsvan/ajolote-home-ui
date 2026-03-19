import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  BackendAdminAssignmentsResponse,
  BackendAdminAssignmentProperty,
  BackendAdminAssignmentAgent,
  BackendAdminAssignment,
} from "@/myAccount/admin/api/admin.api";
import type {
  AdminAssignmentsResponse,
  AdminAssignmentProperty,
  AdminAssignmentAgent,
  AdminAssignment,
} from "@/myAccount/admin/types/admin.types";

// ─── Mappers ──────────────────────────────────────────────────────────────────

const mapAssignmentProperty = (b: BackendAdminAssignmentProperty): AdminAssignmentProperty => ({
  id: b.id,
  title: b.title,
  propertyType: b.property_type,
});

const mapAssignmentAgent = (b: BackendAdminAssignmentAgent): AdminAssignmentAgent => ({
  id: b.id,
  membershipId: b.membership_id,
  name: b.name,
  isVisible: b.is_visible,
});

const mapAssignment = (b: BackendAdminAssignment): AdminAssignment => ({
  property: mapAssignmentProperty(b.property),
  agents: b.agents.map(mapAssignmentAgent),
});

const mapAssignmentsResponse = (b: BackendAdminAssignmentsResponse): AdminAssignmentsResponse => ({
  unassignedProperties: b.unassigned_properties.map(mapAssignmentProperty),
  assignments: b.assignments.map(mapAssignment),
});

// ─── Actions ──────────────────────────────────────────────────────────────────

export const getAdminAssignmentsAction =
  async (): Promise<AdminAssignmentsResponse> => {
    try {
      const { data } = await adminApi.getAssignments();
      return mapAssignmentsResponse(data);
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
