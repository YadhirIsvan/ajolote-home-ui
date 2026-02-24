import { agentApi } from "@/myAccount/agent/api/agent.api";
import type { AgentProperty } from "@/myAccount/agent/types/agent.types";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const DEFAULT_PROPERTIES: AgentProperty[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    location: "Polanco, CDMX",
    price: "$12,500,000",
    image: property1,
    leads: 5,
    status: "Activa",
  },
  {
    id: "2",
    title: "Departamento en Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$4,800,000",
    image: property2,
    leads: 3,
    status: "Activa",
  },
  {
    id: "3",
    title: "Penthouse en Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$18,900,000",
    image: property3,
    leads: 8,
    status: "En negociación",
  },
];

export const getAgentPropertiesAction = async (): Promise<AgentProperty[]> => {
  try {
    const { data } = await agentApi.getProperties();
    return Array.isArray(data) ? (data as AgentProperty[]) : DEFAULT_PROPERTIES;
  } catch {
    return DEFAULT_PROPERTIES;
  }
};
