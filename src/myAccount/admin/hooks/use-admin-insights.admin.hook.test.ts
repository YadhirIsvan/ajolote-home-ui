import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAdminInsights } from "./use-admin-insights.admin.hook";
import { getAdminInsightsAction } from "@/myAccount/admin/actions/get-admin-insights.actions";

vi.mock("@/myAccount/admin/actions/get-admin-insights.actions");

const mockedGetInsights = vi.mocked(getAdminInsightsAction);

const MOCK_INSIGHTS = {
  totalRevenue: 5_000_000,
  totalSales: 12,
  avgDaysToSell: 45,
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useAdminInsights — estado inicial", () => {
  it("period por defecto es 'year'", () => {
    mockedGetInsights.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    expect(result.current.period).toBe("year");
  });

  it("insights undefined mientras carga", () => {
    mockedGetInsights.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    expect(result.current.insights).toBeUndefined();
  });
});

// ─── Datos tras resolver ──────────────────────────────────────────────────────

describe("useAdminInsights — datos tras resolver", () => {
  it("insights se popula con los datos de la action", async () => {
    mockedGetInsights.mockResolvedValueOnce(MOCK_INSIGHTS as never);

    const { result } = renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.insightsQuery.isSuccess).toBe(true));

    expect(result.current.insights).toEqual(MOCK_INSIGHTS);
  });

  it("llama a la action con el período por defecto 'year'", async () => {
    mockedGetInsights.mockResolvedValueOnce(MOCK_INSIGHTS as never);

    renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    await waitFor(() => expect(mockedGetInsights).toHaveBeenCalledWith("year"));
  });
});

// ─── setPeriod ────────────────────────────────────────────────────────────────

describe("useAdminInsights — setPeriod", () => {
  it("cambiar period a 'month' relanza la query con el nuevo período", async () => {
    mockedGetInsights.mockResolvedValue(MOCK_INSIGHTS as never);

    const { result } = renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.insightsQuery.isSuccess).toBe(true));

    act(() => result.current.setPeriod("month"));

    await waitFor(() =>
      expect(mockedGetInsights).toHaveBeenCalledWith("month")
    );

    expect(result.current.period).toBe("month");
  });

  it("setPeriod actualiza el state local", () => {
    mockedGetInsights.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useAdminInsights(), { wrapper: makeWrapper() });

    act(() => result.current.setPeriod("quarter"));

    expect(result.current.period).toBe("quarter");
  });
});
