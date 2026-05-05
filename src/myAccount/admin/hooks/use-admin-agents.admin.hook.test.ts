import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminAgents } from "./use-admin-agents.admin.hook";
import {
  getAdminAgentsAction,
  getAdminAgentSchedulesAction,
  createAdminAgentAction,
  updateAdminAgentAction,
  uploadAdminAgentAvatarAction,
  deleteAdminAgentAction,
  createAdminAgentScheduleAction,
  updateAdminAgentScheduleAction,
  deleteAdminAgentScheduleAction,
} from "@/myAccount/admin/actions/get-admin-agents.actions";

vi.mock("@/myAccount/admin/actions/get-admin-agents.actions");
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedGetAgents = vi.mocked(getAdminAgentsAction);
const mockedGetSchedules = vi.mocked(getAdminAgentSchedulesAction);
const mockedCreate = vi.mocked(createAdminAgentAction);
const mockedUpdate = vi.mocked(updateAdminAgentAction);
const mockedAvatar = vi.mocked(uploadAdminAgentAvatarAction);
const mockedDelete = vi.mocked(deleteAdminAgentAction);
const mockedCreateSchedule = vi.mocked(createAdminAgentScheduleAction);
const mockedUpdateSchedule = vi.mocked(updateAdminAgentScheduleAction);
const mockedDeleteSchedule = vi.mocked(deleteAdminAgentScheduleAction);

const MOCK_AGENTS = [
  { id: 1, name: "Carlos", email: "carlos@x.com", zone: "Norte", score: "4.9" },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderAgents(opts = { selectedAgentId: null as number | null, isSchedulerOpen: false }) {
  return renderHook(() => useAdminAgents(opts), { wrapper: makeWrapper() });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetAgents.mockReturnValue(new Promise(() => {}));
  mockedGetSchedules.mockReturnValue(new Promise(() => {}));
});

// ─── agentsQuery siempre activa ───────────────────────────────────────────────

describe("useAdminAgents — agentsQuery", () => {
  it("llama a getAdminAgentsAction al montar", async () => {
    mockedGetAgents.mockResolvedValueOnce(MOCK_AGENTS as never);

    renderAgents();

    await waitFor(() => expect(mockedGetAgents).toHaveBeenCalledTimes(1));
  });

  it("agentsQuery poblado tras resolver", async () => {
    mockedGetAgents.mockResolvedValueOnce(MOCK_AGENTS as never);

    const { result } = renderAgents();

    await waitFor(() => expect(result.current.agentsQuery.isSuccess).toBe(true));

    expect(result.current.agentsQuery.data).toHaveLength(1);
  });
});

// ─── schedulesQuery condicional ───────────────────────────────────────────────

describe("useAdminAgents — schedulesQuery condicional", () => {
  it("isSchedulerOpen false → no llama a getAdminAgentSchedulesAction", () => {
    renderAgents({ selectedAgentId: 1, isSchedulerOpen: false });

    expect(mockedGetSchedules).not.toHaveBeenCalled();
  });

  it("selectedAgentId null → no llama a getAdminAgentSchedulesAction", () => {
    renderAgents({ selectedAgentId: null, isSchedulerOpen: true });

    expect(mockedGetSchedules).not.toHaveBeenCalled();
  });

  it("isSchedulerOpen true + selectedAgentId → llama a getAdminAgentSchedulesAction", async () => {
    mockedGetAgents.mockResolvedValueOnce(MOCK_AGENTS as never);
    mockedGetSchedules.mockResolvedValueOnce([] as never);

    renderHook(
      () => useAdminAgents({ selectedAgentId: 1, isSchedulerOpen: true }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(mockedGetSchedules).toHaveBeenCalledWith(1));
  });
});

// ─── mutations ────────────────────────────────────────────────────────────────

describe("useAdminAgents — createAgentMutation", () => {
  it("éxito → invalida 'admin-agents'", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedCreate.mockResolvedValueOnce(undefined as never);

    const { result } = renderAgents();
    await waitFor(() => expect(result.current.agentsQuery.isSuccess).toBe(true));
    const callsBefore = mockedGetAgents.mock.calls.length;

    act(() => { result.current.createAgentMutation.mutate({ name: "Luis", email: "luis@x.com" } as never); });

    await waitFor(() => expect(result.current.createAgentMutation.isSuccess).toBe(true));
    expect(mockedGetAgents.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});

describe("useAdminAgents — updateAgentMutation", () => {
  it("llama a updateAdminAgentAction con id y payload", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedUpdate.mockResolvedValueOnce(undefined as never);

    const { result } = renderAgents();

    act(() => {
      result.current.updateAgentMutation.mutate({ id: 1, payload: { name: "Carlos Updated" } });
    });

    await waitFor(() => expect(mockedUpdate).toHaveBeenCalledWith(1, { name: "Carlos Updated" }));
  });
});

describe("useAdminAgents — deleteAgentMutation", () => {
  it("éxito → invalida 'admin-agents'", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedDelete.mockResolvedValueOnce(undefined as never);

    const { result } = renderAgents();
    await waitFor(() => expect(result.current.agentsQuery.isSuccess).toBe(true));
    const callsBefore = mockedGetAgents.mock.calls.length;

    act(() => { result.current.deleteAgentMutation.mutate(1); });

    await waitFor(() => expect(result.current.deleteAgentMutation.isSuccess).toBe(true));
    expect(mockedGetAgents.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});

describe("useAdminAgents — avatarMutation", () => {
  it("llama a uploadAdminAgentAvatarAction con id y file", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedAvatar.mockResolvedValueOnce(undefined as never);

    const { result } = renderAgents();
    const file = new File(["img"], "avatar.jpg", { type: "image/jpeg" });

    act(() => { result.current.avatarMutation.mutate({ id: 1, file }); });

    await waitFor(() => expect(mockedAvatar).toHaveBeenCalledWith(1, file));
  });
});

describe("useAdminAgents — schedule mutations", () => {
  it("createScheduleMutation llama a createAdminAgentScheduleAction", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedGetSchedules.mockResolvedValue([] as never);
    mockedCreateSchedule.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(
      () => useAdminAgents({ selectedAgentId: 1, isSchedulerOpen: true }),
      { wrapper: makeWrapper() }
    );

    act(() => {
      result.current.createScheduleMutation.mutate({ agentId: 1, payload: { day: "lunes", start: "09:00", end: "18:00" } as never });
    });

    await waitFor(() => expect(mockedCreateSchedule).toHaveBeenCalledWith(1, expect.objectContaining({ day: "lunes" })));
  });

  it("deleteScheduleMutation llama a deleteAdminAgentScheduleAction", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedGetSchedules.mockResolvedValue([] as never);
    mockedDeleteSchedule.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(
      () => useAdminAgents({ selectedAgentId: 1, isSchedulerOpen: true }),
      { wrapper: makeWrapper() }
    );

    act(() => {
      result.current.deleteScheduleMutation.mutate({ agentId: 1, scheduleId: 5 });
    });

    await waitFor(() => expect(mockedDeleteSchedule).toHaveBeenCalledWith(1, 5));
  });

  it("updateScheduleMutation llama a updateAdminAgentScheduleAction", async () => {
    mockedGetAgents.mockResolvedValue(MOCK_AGENTS as never);
    mockedGetSchedules.mockResolvedValue([] as never);
    mockedUpdateSchedule.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(
      () => useAdminAgents({ selectedAgentId: 1, isSchedulerOpen: true }),
      { wrapper: makeWrapper() }
    );

    act(() => {
      result.current.updateScheduleMutation.mutate({ agentId: 1, scheduleId: 5, payload: { start: "10:00" } as never });
    });

    await waitFor(() => expect(mockedUpdateSchedule).toHaveBeenCalledWith(1, 5, expect.objectContaining({ start: "10:00" })));
  });
});
