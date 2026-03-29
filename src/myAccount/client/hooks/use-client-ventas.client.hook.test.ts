import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useClientVentas } from "./use-client-ventas.client.hook";
import { getClientPropertiesSaleAction } from "@/myAccount/client/actions/get-client-properties-sale.actions";
import { getClientPropertySaleDetailAction } from "@/myAccount/client/actions/get-client-property-sale-detail.actions";

vi.mock("@/myAccount/client/actions/get-client-properties-sale.actions");
vi.mock("@/myAccount/client/actions/get-client-property-sale-detail.actions");

const mockedGetSale = vi.mocked(getClientPropertiesSaleAction);
const mockedGetDetail = vi.mocked(getClientPropertySaleDetailAction);

const SALE_LIST = [
  { id: 10, title: "Casa A", status: "activo" },
  { id: 11, title: "Casa B", status: "pendiente" },
];

const SALE_RESULT = {
  list: SALE_LIST,
  summary: { propertiesAmount: 2, totalViews: 100, interestedAmount: 5, totalValue: 3000000 },
};

const DETAIL = { id: 10, title: "Casa A — Detalle", status: "activo" };

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetSale.mockResolvedValue(SALE_RESULT as never);
  mockedGetDetail.mockResolvedValue(DETAIL as never);
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useClientVentas — estado inicial", () => {
  it("selectedPropertyId: null, isFormOpen: false inicialmente", () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.selectedPropertyId).toBeNull();
    expect(result.current.isFormOpen).toBe(false);
  });
});

// ─── ventasList ───────────────────────────────────────────────────────────────

describe("useClientVentas — ventasList", () => {
  it("ventasLoading: true mientras carga, ventasList poblada tras resolver", async () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => expect(result.current.ventasLoading).toBe(false));
    expect(result.current.ventasList).toHaveLength(2);
    expect(result.current.ventasList[0].title).toBe("Casa A");
  });
});

// ─── selectedPropertyId y detailQuery ────────────────────────────────────────

describe("useClientVentas — selección y detail", () => {
  it("setSelectedPropertyId(id) actualiza selectedPropertyId", async () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });

    act(() => result.current.setSelectedPropertyId(10));

    expect(result.current.selectedPropertyId).toBe(10);
  });

  it("selectedProperty: null cuando no hay selección", async () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.ventasLoading).toBe(false));

    expect(result.current.selectedProperty).toBeNull();
    expect(mockedGetDetail).not.toHaveBeenCalled();
  });

  it("con selección: usa detailQuery.data cuando está disponible", async () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.ventasLoading).toBe(false));

    act(() => result.current.setSelectedPropertyId(10));

    await waitFor(() =>
      expect(result.current.selectedProperty?.title).toBe("Casa A — Detalle")
    );
    expect(mockedGetDetail).toHaveBeenCalledWith(10, expect.anything());
  });
});

// ─── isFormOpen ───────────────────────────────────────────────────────────────

describe("useClientVentas — isFormOpen", () => {
  it("setIsFormOpen(true) cambia isFormOpen", () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });
    act(() => result.current.setIsFormOpen(true));
    expect(result.current.isFormOpen).toBe(true);
  });
});

// ─── refetchAll ───────────────────────────────────────────────────────────────

describe("useClientVentas — refetchAll", () => {
  it("con selectedPropertyId: null → solo llama ventasQuery.refetch (detail no llamada antes)", async () => {
    const { result } = renderHook(() => useClientVentas(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.ventasLoading).toBe(false));
    const callsBefore = mockedGetSale.mock.calls.length;

    act(() => result.current.refetchAll());

    await waitFor(() =>
      expect(mockedGetSale.mock.calls.length).toBeGreaterThan(callsBefore)
    );
    // detail no se llamó porque selectedPropertyId es null
    expect(mockedGetDetail).not.toHaveBeenCalled();
  });
});
