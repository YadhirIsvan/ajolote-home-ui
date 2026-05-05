import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminHistorial } from "./use-admin-historial.admin.hook";
import { getAdminHistoryAction } from "@/myAccount/admin/actions/get-admin-history.actions";

vi.mock("@/myAccount/admin/actions/get-admin-history.actions");

const mockedGetHistory = vi.mocked(getAdminHistoryAction);

const MOCK_HISTORY = {
  results: [
    { id: 1, property: "Casa A", client: "Juan", action: "Venta cerrada", date: "2024-03-01" },
    { id: 2, property: "Depto B", client: "Ana",  action: "Cita realizada", date: "2024-03-05" },
  ],
  count: 2,
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

describe("useAdminHistorial — estado inicial", () => {
  it("results vacío mientras carga", () => {
    mockedGetHistory.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAdminHistorial(), { wrapper: makeWrapper() });

    expect(result.current.results).toEqual([]);
  });
});

describe("useAdminHistorial — datos tras resolver", () => {
  it("results se popula con los datos del backend", async () => {
    mockedGetHistory.mockResolvedValueOnce(MOCK_HISTORY as never);

    const { result } = renderHook(() => useAdminHistorial(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.historyQuery.isSuccess).toBe(true));

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].id).toBe(1);
  });

  it("llama a la action con limit 100", async () => {
    mockedGetHistory.mockResolvedValueOnce(MOCK_HISTORY as never);

    renderHook(() => useAdminHistorial(), { wrapper: makeWrapper() });

    await waitFor(() => expect(mockedGetHistory).toHaveBeenCalledWith({ limit: 100 }));
  });

  it("respuesta sin 'results' → fallback a []", async () => {
    mockedGetHistory.mockResolvedValueOnce({} as never);

    const { result } = renderHook(() => useAdminHistorial(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.historyQuery.isSuccess).toBe(true));

    expect(result.current.results).toEqual([]);
  });
});
