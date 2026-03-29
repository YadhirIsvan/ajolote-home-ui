import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAgentDashboard } from "./use-agent-dashboard.agent.hook";
import { getAgentDashboardAction } from "@/myAccount/agent/actions/get-agent-dashboard.actions";
import { getAgentPropertiesAction } from "@/myAccount/agent/actions/get-agent-properties.actions";
import { getAgentAppointmentsAction } from "@/myAccount/agent/actions/get-agent-appointments.actions";

vi.mock("@/myAccount/agent/actions/get-agent-dashboard.actions");
vi.mock("@/myAccount/agent/actions/get-agent-properties.actions");
vi.mock("@/myAccount/agent/actions/get-agent-appointments.actions");

const mockedGetDashboard = vi.mocked(getAgentDashboardAction);
const mockedGetProperties = vi.mocked(getAgentPropertiesAction);
const mockedGetAppointments = vi.mocked(getAgentAppointmentsAction);

const MOCK_DASHBOARD = {
  agent: { id: 1, name: "Carlos", avatar: null, zone: "Norte", score: "4.9" },
  stats: { activeLeads: 5, todayAppointments: 2, monthSales: 1 },
};

const MOCK_PROPERTIES = [
  { id: 10, title: "Casa A", location: "CDMX", price: "$1,000,000", image: "", leads: 3, status: "activo", displayStatus: "En venta" },
  { id: 11, title: "Casa B", location: "GDL", price: "$800,000", image: "", leads: 1, status: "activo", displayStatus: "En venta" },
];

const MOCK_APPOINTMENTS = [
  { id: 1, client: "Juan", property: "Casa A", date: "10 abr.", time: "2:30 PM", status: "programada" as const },
  { id: 2, client: "Ana", property: "Casa B", date: "11 abr.", time: "10:00 AM", status: "confirmada" as const },
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
  mockedGetDashboard.mockResolvedValue(MOCK_DASHBOARD as never);
  mockedGetProperties.mockResolvedValue(MOCK_PROPERTIES as never);
  mockedGetAppointments.mockResolvedValue(MOCK_APPOINTMENTS as never);
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useAgentDashboard — estado inicial", () => {
  it("selectedProperty: null, isPropertyModalOpen: false inicialmente", () => {
    mockedGetDashboard.mockReturnValue(new Promise(() => {}));
    mockedGetProperties.mockReturnValue(new Promise(() => {}));
    mockedGetAppointments.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.selectedProperty).toBeNull();
    expect(result.current.isPropertyModalOpen).toBe(false);
  });

  it("defaults: dashboard null, properties [], appointments []", () => {
    mockedGetDashboard.mockReturnValue(new Promise(() => {}));
    mockedGetProperties.mockReturnValue(new Promise(() => {}));
    mockedGetAppointments.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.dashboard).toBeNull();
    expect(result.current.properties).toEqual([]);
    expect(result.current.appointments).toEqual([]);
  });
});

// ─── Datos tras resolver ──────────────────────────────────────────────────────

describe("useAgentDashboard — datos tras resolver", () => {
  it("dashboard, properties y appointments poblados tras resolver", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.propertiesLoading).toBe(false));

    expect(result.current.dashboard?.agent.name).toBe("Carlos");
    expect(result.current.properties).toHaveLength(2);
    expect(result.current.appointments).toHaveLength(2);
  });
});

// ─── handlePropertyClick ─────────────────────────────────────────────────────

describe("useAgentDashboard — handlePropertyClick", () => {
  it("establece selectedProperty y abre el modal", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.propertiesLoading).toBe(false));

    act(() => result.current.handlePropertyClick(MOCK_PROPERTIES[0] as never));

    expect(result.current.selectedProperty?.id).toBe(10);
    expect(result.current.isPropertyModalOpen).toBe(true);
  });

  it("setIsPropertyModalOpen(false) cierra el modal", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.propertiesLoading).toBe(false));

    act(() => result.current.handlePropertyClick(MOCK_PROPERTIES[0] as never));
    act(() => result.current.setIsPropertyModalOpen(false));

    expect(result.current.isPropertyModalOpen).toBe(false);
  });
});

// ─── handleStatusChange ───────────────────────────────────────────────────────

describe("useAgentDashboard — handleStatusChange", () => {
  it("actualiza el status de la cita con el id dado", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.appointmentsLoading).toBe(false));

    act(() => result.current.handleStatusChange(1, "completada"));

    const updated = result.current.appointments.find((a) => a.id === 1);
    expect(updated?.status).toBe("completada");
  });

  it("solo actualiza la cita afectada, sin tocar las demás", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.appointmentsLoading).toBe(false));

    act(() => result.current.handleStatusChange(1, "cancelada"));

    const other = result.current.appointments.find((a) => a.id === 2);
    expect(other?.status).toBe("confirmada");
  });

  it("localAppointments tiene prioridad sobre appointmentsQuery.data", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.appointmentsLoading).toBe(false));

    act(() => result.current.handleStatusChange(1, "en_progreso"));

    // appointments viene de localAppointments, no del mock
    expect(result.current.appointments.find((a) => a.id === 1)?.status).toBe("en_progreso");
  });
});

// ─── refetchAll ───────────────────────────────────────────────────────────────

describe("useAgentDashboard — refetchAll", () => {
  it("dispara refetch de las tres queries", async () => {
    const { result } = renderHook(() => useAgentDashboard(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.propertiesLoading).toBe(false));
    const callsBefore = mockedGetProperties.mock.calls.length;

    act(() => result.current.refetchAll());

    await waitFor(() =>
      expect(mockedGetProperties.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });
});
