import { adminApi } from "@/myAccount/admin/api/admin.api";
import type {
  AdminSellerLead,
  SellerLeadStatus,
  Paginated,
} from "@/myAccount/admin/types/admin.types";

export const getAdminSellerLeadsAction = async (params?: {
  status?: SellerLeadStatus;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Paginated<AdminSellerLead>> => {
  try {
    const { data } = await adminApi.getSellerLeads(params);
    return data;
  } catch (error) {
    console.error("[getAdminSellerLeadsAction] Error al obtener seller leads:", error);
    throw error;
  }
};

export const updateAdminSellerLeadAction = async (
  id: number,
  payload: { status?: SellerLeadStatus; assigned_agent_membership_id?: number; notes?: string }
): Promise<void> => {
  try {
    await adminApi.updateSellerLead(id, payload);
  } catch (error) {
    console.error("[updateAdminSellerLeadAction] Error al actualizar seller lead:", error);
    throw error;
  }
};

export const convertAdminSellerLeadAction = async (
  id: number,
  agentMembershipId: number,
  notes?: string
): Promise<{ property_id: number; sale_process_id: number; message: string }> => {
  try {
    const { data } = await adminApi.convertSellerLead(id, {
      agent_membership_id: agentMembershipId,
      notes,
    });
    return data;
  } catch (error) {
    console.error("[convertAdminSellerLeadAction] Error al convertir seller lead:", error);
    throw error;
  }
};
