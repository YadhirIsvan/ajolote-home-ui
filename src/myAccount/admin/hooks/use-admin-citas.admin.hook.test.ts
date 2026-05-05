import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminCitas } from "./use-admin-citas.admin.hook";
import {
  getAdminAppointmentsAction,
  createAdminAppointmentAction,
  updateAdminAppointmentStatusAction,
} from "@/myAccount/admin/actions/get-admin-appointments.actions";
import { getAdminClientsAction } from "@/myAccount/admin/actions/get-admin-clients.actions";
import { getAdminPropertiesAction } from "@/myAccount/admin/actions/get-admin-properties.actions";

vi.mock("@/myAccount/admin/actions/get-admin-appointments.actions");
vi.mock("@/myAccount/admin/actions/get-admin-clients.actions");
vi.mock("@/myAccount/admin/actions/get-admin-properties.actions");
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedGetAppointments = vi.mocked(getAdminAppointmentsAction);
const mockedGetClients = vi.mocked(getAdminClientsAction);
const mockedGetProperties = vi.mocked(getAdminPropertiesAction);
const mockedUpdateStatus = vi.mocked(updateAdminAppointmentStatusAction);
const mockedCreate = vi.mocked(createAdminAppointmentAction);

const MOCK_APPOINTMENTS = [
  { id: 1, client: "Juan", property: "Casa A", date: "2024-05-10", status: "programada" },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderCitas(clientSearch = "") {
  return renderHook(() => useAdminCitas({ clientSearch }), { wrapper: makeWrapper() });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetAppointments.mockReturnValue(new Promise(() => {}));
  mockedGetProperties.mockReturnValue(new Promise(() => {}));
  mockedGetClients.mockReturnValue(new Promise(() => {}));
});

// ─── queries siempre activas ──────────────────────────────────────────────────

describe("useAdminCitas — queries siempre activas", () => {
  it("llama a getAdminAppointmentsAction con limit 500", async () => {
    mockedGetAppointments.mockResolvedValueOnce(MOCK_APPOINTMENTS as never);

    renderCitas();

    await waitFor(() =>
      expect(mockedGetAppointments).toHaveBeenCalledWith({ limit: 500 })
    );
  });

  it("llama a getAdminPropertiesAction con limit 200", async () => {
    mockedGetProperties.mockResolvedValueOnce([] as never);

    renderCitas();

    await waitFor(() =>
      expect(mockedGetProperties).toHaveBeenCalledWith({ limit: 200 })
    );
  });
});

// ─── clientsQuery condicional ─────────────────────────────────────────────────

describe("useAdminCitas — clientsQuery condicional", () => {
  it("search vacío → no llama a getAdminClientsAction", () => {
    renderCitas("");

    expect(mockedGetClients).not.toHaveBeenCalled();
  });

  it("search de 1 char → no llama a getAdminClientsAction (mínimo 2)", () => {
    renderCitas("j");

    expect(mockedGetClients).not.toHaveBeenCalled();
  });

  it("search de 2+ chars → llama a getAdminClientsAction con el search", async () => {
    mockedGetClients.mockResolvedValueOnce({ results: [], count: 0 } as never);

    renderCitas("ju");

    await waitFor(() =>
      expect(mockedGetClients).toHaveBeenCalledWith(
        expect.objectContaining({ search: "ju", limit: 20 })
      )
    );
  });
});

// ─── updateStatusMutation ─────────────────────────────────────────────────────

describe("useAdminCitas — updateStatusMutation", () => {
  it("éxito → invalida 'admin-appointments' y 'admin-kanban'", async () => {
    mockedGetAppointments.mockResolvedValue(MOCK_APPOINTMENTS as never);
    mockedGetProperties.mockResolvedValue([] as never);
    mockedUpdateStatus.mockResolvedValueOnce(undefined as never);

    const { result } = renderCitas();

    await waitFor(() => expect(result.current.appointmentsQuery.isSuccess).toBe(true));
    const callsBefore = mockedGetAppointments.mock.calls.length;

    act(() => {
      result.current.updateStatusMutation.mutate({ id: 1, status: "confirmada" });
    });

    await waitFor(() => expect(result.current.updateStatusMutation.isSuccess).toBe(true));
    expect(mockedGetAppointments.mock.calls.length).toBeGreaterThan(callsBefore);
  });
});

// ─── createMutation ───────────────────────────────────────────────────────────

describe("useAdminCitas — createMutation", () => {
  it("llama a createAdminAppointmentAction con el payload correcto", async () => {
    mockedGetAppointments.mockResolvedValue(MOCK_APPOINTMENTS as never);
    mockedGetProperties.mockResolvedValue([] as never);
    mockedCreate.mockResolvedValueOnce(undefined as never);

    const { result } = renderCitas();
    const payload = { property_id: 1, client_id: 2, date: "2024-06-01", time: "10:00" };

    act(() => { result.current.createMutation.mutate(payload as never); });

    await waitFor(() => expect(mockedCreate).toHaveBeenCalledWith(payload));
  });
});
