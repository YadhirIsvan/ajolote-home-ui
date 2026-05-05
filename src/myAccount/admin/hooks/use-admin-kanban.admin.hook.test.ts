import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminKanban } from "./use-admin-kanban.admin.hook";
import {
  getAdminPurchaseProcessesAction,
  updatePurchaseProcessStatusAction,
} from "@/myAccount/admin/actions/get-admin-kanban.actions";

vi.mock("@/myAccount/admin/actions/get-admin-kanban.actions");
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockedGetProcesses = vi.mocked(getAdminPurchaseProcessesAction);
const mockedUpdate = vi.mocked(updatePurchaseProcessStatusAction);

const MOCK_PROCESSES = [
  { id: 1, status: "revision", property: "Casa A", client: "Juan" },
  { id: 2, status: "negociacion", property: "Depto B", client: "Ana" },
];

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

// ─── processesQuery ───────────────────────────────────────────────────────────

describe("useAdminKanban — processesQuery", () => {
  it("llama a la action con limit 200", async () => {
    mockedGetProcesses.mockResolvedValueOnce(MOCK_PROCESSES as never);

    renderHook(() => useAdminKanban(), { wrapper: makeWrapper() });

    await waitFor(() =>
      expect(mockedGetProcesses).toHaveBeenCalledWith({ limit: 200 })
    );
  });

  it("processesQuery.data poblado tras resolver", async () => {
    mockedGetProcesses.mockResolvedValueOnce(MOCK_PROCESSES as never);

    const { result } = renderHook(() => useAdminKanban(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.processesQuery.isSuccess).toBe(true));

    expect(result.current.processesQuery.data).toHaveLength(2);
  });
});

// ─── moveMutation ─────────────────────────────────────────────────────────────

describe("useAdminKanban — moveMutation", () => {
  it("éxito → invalida la query 'admin-kanban'", async () => {
    mockedGetProcesses.mockResolvedValue(MOCK_PROCESSES as never);
    mockedUpdate.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useAdminKanban(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.processesQuery.isSuccess).toBe(true));
    const callsBefore = mockedGetProcesses.mock.calls.length;

    act(() => {
      result.current.moveMutation.mutate({ rawId: 1, status: "negociacion" });
    });

    await waitFor(() => expect(result.current.moveMutation.isSuccess).toBe(true));
    expect(mockedGetProcesses.mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it("llama a updatePurchaseProcessStatusAction con rawId y status", async () => {
    mockedGetProcesses.mockResolvedValue(MOCK_PROCESSES as never);
    mockedUpdate.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useAdminKanban(), { wrapper: makeWrapper() });

    act(() => {
      result.current.moveMutation.mutate({ rawId: 5, status: "cierre" });
    });

    await waitFor(() => expect(mockedUpdate).toHaveBeenCalled());
    expect(mockedUpdate).toHaveBeenCalledWith(5, "cierre", undefined, undefined);
  });
});
