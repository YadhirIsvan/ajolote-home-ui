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
  const { data } = await adminApi.getSellerLeads(params as Record<string, unknown>);
  return data as Paginated<AdminSellerLead>;
};

export const updateAdminSellerLeadAction = async (
  id: number,
  data: { status?: SellerLeadStatus; assigned_agent_membership_id?: number; notes?: string }
): Promise<void> => {
  await adminApi.updateSellerLead(id, data as Record<string, unknown>);
};

export const convertAdminSellerLeadAction = async (
  id: number,
  agentMembershipId: number,
  notes?: string
): Promise<{ property_id: number; sale_process_id: number; message: string }> => {
  const { data } = await adminApi.convertSellerLead(id, {
    agent_membership_id: agentMembershipId,
    notes,
  });
  return data as { property_id: number; sale_process_id: number; message: string };
};
