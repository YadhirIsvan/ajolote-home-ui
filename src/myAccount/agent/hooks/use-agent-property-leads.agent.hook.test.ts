import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAgentPropertyLeads } from "./use-agent-property-leads.agent.hook";
import { getAgentPropertyLeadsAction } from "@/myAccount/agent/actions/get-agent-property-leads.actions";
import type { AgentLead } from "@/myAccount/agent/types/agent.types";

vi.mock("@/myAccount/agent/actions/get-agent-property-leads.actions");

const mockedGetLeads = vi.mocked(getAgentPropertyLeadsAction);

const MOCK_LEADS: AgentLead[] = [
  { id: 1, name: "Juan García", email: "juan@x.com", phone: "+525512345678", stage: 1 },
  { id: 2, name: "Ana López",   email: "ana@x.com",  phone: "+525598765432", stage: 2 },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Estado inicial / query disabled ─────────────────────────────────────────

describe("useAgentPropertyLeads — query deshabilitada", () => {
  it("propertyId undefined → no llama a la action", () => {
    mockedGetLeads.mockReturnValue(new Promise(() => {}));

    renderHook(() => useAgentPropertyLeads(undefined, true), {
      wrapper: makeWrapper(),
    });

    expect(mockedGetLeads).not.toHaveBeenCalled();
  });

  it("enabled false → no llama a la action aunque propertyId sea válido", () => {
    mockedGetLeads.mockReturnValue(new Promise(() => {}));

    renderHook(() => useAgentPropertyLeads(7, false), {
      wrapper: makeWrapper(),
    });

    expect(mockedGetLeads).not.toHaveBeenCalled();
  });

  it("estado inicial → leads [] y leadsLoading true si hay query pendiente", () => {
    mockedGetLeads.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAgentPropertyLeads(7, true), {
      wrapper: makeWrapper(),
    });

    expect(result.current.leads).toEqual([]);
    expect(result.current.leadsLoading).toBe(true);
  });
});

// ─── Datos tras resolver ──────────────────────────────────────────────────────

describe("useAgentPropertyLeads — datos tras resolver", () => {
  it("leads se popula con los datos del backend", async () => {
    mockedGetLeads.mockResolvedValueOnce(MOCK_LEADS);

    const { result } = renderHook(() => useAgentPropertyLeads(7, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.leadsLoading).toBe(false));

    expect(result.current.leads).toHaveLength(2);
    expect(result.current.leads[0].name).toBe("Juan García");
  });

  it("llama a la action con el propertyId correcto", async () => {
    mockedGetLeads.mockResolvedValueOnce([]);

    renderHook(() => useAgentPropertyLeads(42, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(mockedGetLeads).toHaveBeenCalledWith(42));
  });
});

// ─── handleLeadStageUpdate ────────────────────────────────────────────────────

describe("useAgentPropertyLeads — handleLeadStageUpdate", () => {
  it("actualiza el stage del lead localmente sin esperar refetch", async () => {
    mockedGetLeads.mockResolvedValueOnce(MOCK_LEADS);

    const { result } = renderHook(() => useAgentPropertyLeads(7, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.leadsLoading).toBe(false));

    act(() => result.current.handleLeadStageUpdate(1, 5));

    const updated = result.current.leads.find((l) => l.id === 1);
    expect(updated?.stage).toBe(5);
  });

  it("solo afecta al lead con el id indicado", async () => {
    mockedGetLeads.mockResolvedValueOnce(MOCK_LEADS);

    const { result } = renderHook(() => useAgentPropertyLeads(7, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.leadsLoading).toBe(false));

    act(() => result.current.handleLeadStageUpdate(1, 5));

    const other = result.current.leads.find((l) => l.id === 2);
    expect(other?.stage).toBe(2);
  });

  it("override local tiene prioridad sobre los datos del backend", async () => {
    mockedGetLeads.mockResolvedValue(MOCK_LEADS);

    const { result } = renderHook(() => useAgentPropertyLeads(7, true), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.leadsLoading).toBe(false));

    act(() => result.current.handleLeadStageUpdate(1, 9));

    expect(result.current.leads.find((l) => l.id === 1)?.stage).toBe(9);
  });
});
