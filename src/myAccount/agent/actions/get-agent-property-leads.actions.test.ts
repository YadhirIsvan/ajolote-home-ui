import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAgentPropertyLeadsAction } from "./get-agent-property-leads.actions";
import { agentApi } from "@/myAccount/agent/api/agent.api";

vi.mock("@/myAccount/agent/api/agent.api");

const mockedGetLeads = vi.mocked(agentApi.getPropertyLeads);

const BACKEND_LEAD = {
  id: 20,
  status: "activo",
  overall_progress: 60,
  client: { name: "María López", email: "maria@example.com", phone: "555-9876" },
  created_at: "2026-02-01T00:00:00Z",
  updated_at: "2026-03-10T00:00:00Z",
};

beforeEach(() => vi.clearAllMocks());

describe("getAgentPropertyLeadsAction — mapeo", () => {
  it("mapea BackendLead a AgentLead correctamente", async () => {
    mockedGetLeads.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_LEAD] },
    } as never);

    const result = await getAgentPropertyLeadsAction(10);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(20);
    expect(result[0].name).toBe("María López");
    expect(result[0].email).toBe("maria@example.com");
    expect(result[0].phone).toBe("555-9876");
    expect(result[0].stage).toBe(60);
    expect(result[0].lastContact).toBe("2026-03-10T00:00:00Z");
  });

  it("llama a getPropertyLeads con el propertyId correcto", async () => {
    mockedGetLeads.mockResolvedValueOnce({
      data: { count: 0, results: [] },
    } as never);

    await getAgentPropertyLeadsAction(42);

    expect(mockedGetLeads).toHaveBeenCalledWith(42);
  });
});

describe("getAgentPropertyLeadsAction — error", () => {
  it("retorna [] en caso de error", async () => {
    mockedGetLeads.mockRejectedValueOnce(new Error("Network error"));
    const result = await getAgentPropertyLeadsAction(10);
    expect(result).toEqual([]);
  });
});
