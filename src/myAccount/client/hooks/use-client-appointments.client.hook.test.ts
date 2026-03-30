import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientAppointments } from "./use-client-appointments.client.hook";
import {
  getClientAppointmentsAction,
  cancelClientAppointmentAction,
} from "@/myAccount/client/actions/get-client-appointments.actions";

vi.mock("@/myAccount/client/actions/get-client-appointments.actions");

const mockedGet = vi.mocked(getClientAppointmentsAction);
const mockedCancel = vi.mocked(cancelClientAppointmentAction);

const MOCK_APPOINTMENTS = [
  { id: 1, property_title: "Casa A", date: "2026-04-01", status: "confirmed" },
  { id: 2, property_title: "Casa B", date: "2026-04-05", status: "pending" },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useClientAppointments — estado y datos", () => {
  it("isLoading: true mientras la query está en vuelo", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientAppointments(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("appointments: [] por defecto antes de resolver", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useClientAppointments(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.appointments).toEqual([]);
  });

  it("appointments poblado correctamente tras resolver", async () => {
    mockedGet.mockResolvedValueOnce(MOCK_APPOINTMENTS as never);
    const { result } = renderHook(() => useClientAppointments(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.appointments).toHaveLength(2);
    expect(result.current.appointments[0].property_title).toBe("Casa A");
  });
});

describe("useClientAppointments — cancelAppointment", () => {
  it("cancelAppointment llama a la action con id y reason", async () => {
    mockedGet.mockResolvedValue(MOCK_APPOINTMENTS as never);
    mockedCancel.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useClientAppointments(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.cancelAppointment({ id: 1, reason: "Cambio de planes" }));

    await waitFor(() =>
      expect(mockedCancel).toHaveBeenCalledWith(1, "Cambio de planes")
    );
  });

  it("tras éxito invalida query provocando re-fetch", async () => {
    mockedGet.mockResolvedValue(MOCK_APPOINTMENTS as never);
    mockedCancel.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useClientAppointments(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = mockedGet.mock.calls.length;

    act(() => result.current.cancelAppointment({ id: 1 }));

    await waitFor(() =>
      expect(mockedGet.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });
});
