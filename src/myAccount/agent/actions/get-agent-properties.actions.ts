import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { BackendAgentProperty } from "@/myAccount/agent/api/agent.api";
import type { AgentProperty } from "@/myAccount/agent/types/agent.types";

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
  displayStatus: item.display_status,
});

export const getAgentPropertiesAction = async (): Promise<AgentProperty[]> => {
  try {
    const { data } = await agentApi.getProperties();
    return data.results.map(mapItem);
  } catch (error) {
    console.error("[getAgentPropertiesAction] Error al obtener propiedades del agente:", error);
    return [];
  }
};
