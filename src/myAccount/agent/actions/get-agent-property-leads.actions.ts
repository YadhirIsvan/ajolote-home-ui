import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AgentLead } from "@/myAccount/agent/types/agent.types";

interface BackendLead {
  id: number;
  status: string;
  overall_progress: number;
  client: { name: string; email: string; phone: string };
  created_at: string;
  updated_at: string;
}

interface BackendPaginatedResponse {
  count: number;
  results: BackendLead[];
}

const mapLead = (item: BackendLead): AgentLead => ({
  id: item.id,
  name: item.client.name,
  email: item.client.email,
  phone: item.client.phone,
  stage: item.overall_progress,
  lastContact: item.updated_at,
});

export const getAgentPropertyLeadsAction = async (
  propertyId: number
): Promise<AgentLead[]> => {
  try {
    const { data } = await agentApi.getPropertyLeads(propertyId);
    const raw = data as BackendPaginatedResponse;
    return raw.results.map(mapLead);
  } catch {
    return [];
  }
};
