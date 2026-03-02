import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AgentProperty } from "@/myAccount/agent/types/agent.types";

interface BackendAgentProperty {
  id: number;
  title: string;
  address: string;
  price: string;
  property_type: string;
  status: string;
  image: string | null;
  leads_count: number;
  assigned_at: string;
}

interface BackendPaginatedResponse {
  count: number;
  results: BackendAgentProperty[];
}

const formatPrice = (raw: string): string => {
  const num = parseFloat(raw);
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(num);
};

const mapItem = (item: BackendAgentProperty): AgentProperty => ({
  id: item.id,
  title: item.title,
  location: item.address,
  price: formatPrice(item.price),
  image: item.image ?? "",
  leads: item.leads_count,
  status: item.status,
});

export const getAgentPropertiesAction = async (): Promise<AgentProperty[]> => {
  try {
    const { data } = await agentApi.getProperties();
    const raw = data as BackendPaginatedResponse;
    return raw.results.map(mapItem);
  } catch {
    return [];
  }
};
