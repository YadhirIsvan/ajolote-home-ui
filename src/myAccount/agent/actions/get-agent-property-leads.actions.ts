import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { BackendLead } from "@/myAccount/agent/api/agent.api";
import type { AgentLead } from "@/myAccount/agent/types/agent.types";

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
    return data.results.map(mapLead);
  } catch (error) {
    console.error("[getAgentPropertyLeadsAction] Error al obtener leads del agente:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener los leads del agente"
    );
  }
};
