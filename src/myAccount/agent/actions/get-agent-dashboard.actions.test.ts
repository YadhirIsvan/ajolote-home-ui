import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAgentDashboardAction } from "./get-agent-dashboard.actions";
import { agentApi } from "@/myAccount/agent/api/agent.api";

vi.mock("@/myAccount/agent/api/agent.api");

const mockedGetDashboard = vi.mocked(agentApi.getDashboard);

const BACKEND_DASHBOARD = {
  agent: { id: 1, name: "Carlos Agente", avatar: null, zone: "CDMX Norte", score: "4.8" },
  stats: { active_leads: 12, today_appointments: 3, month_sales: 2 },
};

beforeEach(() => vi.clearAllMocks());

describe("getAgentDashboardAction — mapeo", () => {
  it("mapea stats de snake_case a camelCase", async () => {
    mockedGetDashboard.mockResolvedValueOnce({ data: BACKEND_DASHBOARD } as never);

    const result = await getAgentDashboardAction();

    expect(result).not.toBeNull();
    expect(result!.stats.activeLeads).toBe(12);
    expect(result!.stats.todayAppointments).toBe(3);
    expect(result!.stats.monthSales).toBe(2);
  });

  it("preserva campos del agente sin transformar", async () => {
    mockedGetDashboard.mockResolvedValueOnce({ data: BACKEND_DASHBOARD } as never);

    const result = await getAgentDashboardAction();

    expect(result!.agent.name).toBe("Carlos Agente");
    expect(result!.agent.zone).toBe("CDMX Norte");
    expect(result!.agent.score).toBe("4.8");
    expect(result!.agent.avatar).toBeNull();
  });
});

describe("getAgentDashboardAction — error", () => {
  it("retorna null en caso de error", async () => {
    mockedGetDashboard.mockRejectedValueOnce(new Error("Network error"));
    const result = await getAgentDashboardAction();
    expect(result).toBeNull();
  });
});
