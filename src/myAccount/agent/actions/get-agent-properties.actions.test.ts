import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAgentPropertiesAction } from "./get-agent-properties.actions";
import { agentApi } from "@/myAccount/agent/api/agent.api";

vi.mock("@/myAccount/agent/api/agent.api");

const mockedGetProperties = vi.mocked(agentApi.getProperties);

const BACKEND_PROPERTY = {
  id: 5,
  title: "Departamento Centro",
  address: "Av. Insurgentes 100, CDMX",
  price: "1500000",
  property_type: "departamento",
  status: "activo",
  display_status: "En venta",
  image: "https://cdn.example.com/img.jpg",
  leads_count: 7,
  assigned_at: "2026-01-15T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

describe("getAgentPropertiesAction — mapeo", () => {
  it("mapea campos de BackendAgentProperty a AgentProperty", async () => {
    mockedGetProperties.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_PROPERTY] },
    } as never);

    const result = await getAgentPropertiesAction();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(5);
    expect(result[0].title).toBe("Departamento Centro");
    expect(result[0].location).toBe("Av. Insurgentes 100, CDMX");
    expect(result[0].leads).toBe(7);
    expect(result[0].status).toBe("activo");
    expect(result[0].displayStatus).toBe("En venta");
    expect(result[0].image).toBe("https://cdn.example.com/img.jpg");
  });

  it("price se formatea como MXN (ej: '1500000' → contiene '1,500,000')", async () => {
    mockedGetProperties.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_PROPERTY] },
    } as never);

    const [prop] = await getAgentPropertiesAction();
    expect(prop.price).toContain("1,500,000");
  });

  it("image null → string vacío", async () => {
    mockedGetProperties.mockResolvedValueOnce({
      data: { count: 1, results: [{ ...BACKEND_PROPERTY, image: null }] },
    } as never);

    const [prop] = await getAgentPropertiesAction();
    expect(prop.image).toBe("");
  });
});

describe("getAgentPropertiesAction — error", () => {
  it("lanza un Error en caso de error", async () => {
    mockedGetProperties.mockRejectedValueOnce(new Error("Network error"));
    await expect(getAgentPropertiesAction()).rejects.toThrow("Network error");
  });
});
