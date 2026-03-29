import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminAgentsAction,
  getAdminAgentSchedulesAction,
  createAdminAgentAction,
  updateAdminAgentAction,
  deleteAdminAgentAction,
  uploadAdminAgentAvatarAction,
} from "./get-admin-agents.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_AGENT = {
  id: 1,
  membership_id: "MEM-001",
  name: "Carlos Agente",
  email: "carlos@example.com",
  phone: "555-0001",
  avatar: null,
  zone: "Norte",
  bio: "Agente senior",
  score: "4.9",
  properties_count: 10,
  sales_count: 5,
  leads_count: 20,
  active_leads: 8,
};

const BACKEND_SCHEDULE = {
  id: 100,
  name: "Horario base",
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
  start_time: "09:00",
  end_time: "18:00",
  has_lunch_break: true,
  lunch_start: "13:00",
  lunch_end: "14:00",
  valid_from: null,
  valid_until: null,
  is_active: true,
  priority: 1,
  breaks: [],
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminAgentsAction ─────────────────────────────────────────────────────

describe("getAdminAgentsAction — mapeo", () => {
  it("mapea snake_case a camelCase correctamente", async () => {
    mockedApi.getAgents.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_AGENT] },
    } as never);

    const result = await getAdminAgentsAction();

    expect(result.count).toBe(1);
    const agent = result.results[0];
    expect(agent.membershipId).toBe("MEM-001");
    expect(agent.propertiesCount).toBe(10);
    expect(agent.salesCount).toBe(5);
    expect(agent.leadsCount).toBe(20);
    expect(agent.activeLeads).toBe(8);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getAgents.mockRejectedValueOnce(new Error("Network error"));
    await expect(getAdminAgentsAction()).rejects.toThrow();
  });
});

// ─── getAdminAgentSchedulesAction ────────────────────────────────────────────

describe("getAdminAgentSchedulesAction — mapeo", () => {
  it("mapea BackendAgentSchedule a AgentSchedule correctamente", async () => {
    mockedApi.getAgentSchedules.mockResolvedValueOnce({
      data: [BACKEND_SCHEDULE],
    } as never);

    const result = await getAdminAgentSchedulesAction(1);

    expect(result).toHaveLength(1);
    expect(result[0].startTime).toBe("09:00");
    expect(result[0].endTime).toBe("18:00");
    expect(result[0].hasLunchBreak).toBe(true);
    expect(result[0].lunchStart).toBe("13:00");
    expect(result[0].isActive).toBe(true);
    expect(result[0].breaks).toEqual([]);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getAgentSchedules.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminAgentSchedulesAction(1)).rejects.toThrow();
  });
});

// ─── createAdminAgentAction ───────────────────────────────────────────────────

describe("createAdminAgentAction", () => {
  it("retorna el agente mapeado", async () => {
    mockedApi.createAgent.mockResolvedValueOnce({ data: BACKEND_AGENT } as never);

    const payload = {
      email: "nuevo@example.com",
      first_name: "Ana",
      last_name: "Gómez",
      phone: "555-0002",
      zone: "Sur",
      bio: "",
    };
    const result = await createAdminAgentAction(payload);
    expect(result.name).toBe("Carlos Agente");
    expect(result.membershipId).toBe("MEM-001");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.createAgent.mockRejectedValueOnce(new Error("err"));
    await expect(createAdminAgentAction({ email: "", first_name: "", last_name: "", phone: "", zone: "", bio: "" })).rejects.toThrow();
  });
});

// ─── updateAdminAgentAction ───────────────────────────────────────────────────

describe("updateAdminAgentAction", () => {
  it("retorna el agente actualizado mapeado", async () => {
    mockedApi.updateAgent.mockResolvedValueOnce({ data: BACKEND_AGENT } as never);

    const result = await updateAdminAgentAction(1, { zone: "Centro" });
    expect(result.id).toBe(1);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.updateAgent.mockRejectedValueOnce(new Error("err"));
    await expect(updateAdminAgentAction(1, {})).rejects.toThrow();
  });
});

// ─── deleteAdminAgentAction ───────────────────────────────────────────────────

describe("deleteAdminAgentAction", () => {
  it("resuelve sin retornar valor en éxito", async () => {
    mockedApi.deleteAgent.mockResolvedValueOnce(undefined as never);
    await expect(deleteAdminAgentAction(1)).resolves.toBeUndefined();
    expect(mockedApi.deleteAgent).toHaveBeenCalledWith(1);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.deleteAgent.mockRejectedValueOnce(new Error("err"));
    await expect(deleteAdminAgentAction(1)).rejects.toThrow();
  });
});

// ─── uploadAdminAgentAvatarAction ─────────────────────────────────────────────

describe("uploadAdminAgentAvatarAction", () => {
  it("construye FormData con el campo 'avatar' y retorna agente mapeado", async () => {
    const appendSpy = vi.fn();
    class FormDataMock { append = appendSpy; }
    vi.stubGlobal("FormData", FormDataMock);

    mockedApi.updateAgentAvatar.mockResolvedValueOnce({ data: BACKEND_AGENT } as never);

    const file = new File(["content"], "avatar.jpg", { type: "image/jpeg" });
    const result = await uploadAdminAgentAvatarAction(1, file);

    expect(appendSpy).toHaveBeenCalledWith("avatar", file);
    expect(result.id).toBe(1);

    vi.unstubAllGlobals();
  });
});
