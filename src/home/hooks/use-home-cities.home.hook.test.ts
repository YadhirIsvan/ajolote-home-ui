import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useHomeCities } from "./use-home-cities.home.hook";
import { getCitiesAction } from "@/shared/actions/get-cities.actions";

vi.mock("@/shared/actions/get-cities.actions");

const mockedAction = vi.mocked(getCitiesAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

const MOCK_CITIES = [
  { id: 1, name: "Orizaba", state: 30 },
  { id: 2, name: "Córdoba", state: 30 },
  { id: 3, name: "Fortín", state: 30 },
];

// ─── Estado de carga ─────────────────────────────────────────────────────────

describe("useHomeCities — estado de carga", () => {
  it("isLoading: true mientras la acción está en vuelo", () => {
    mockedAction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useHomeCities(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("isLoading: false después de que la acción resuelve", async () => {
    mockedAction.mockResolvedValueOnce(MOCK_CITIES);
    const { result } = renderHook(() => useHomeCities(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});

// ─── Datos ───────────────────────────────────────────────────────────────────

describe("useHomeCities — datos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cities recibe el array de ciudades que devuelve la acción", async () => {
    mockedAction.mockResolvedValueOnce(MOCK_CITIES);
    const { result } = renderHook(() => useHomeCities(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cities).toHaveLength(3);
    expect(result.current.cities[0].name).toBe("Orizaba");
    expect(result.current.cities[2].name).toBe("Fortín");
  });

  it("cities: [] como valor por defecto antes de resolver", () => {
    mockedAction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useHomeCities(), {
      wrapper: makeWrapper(),
    });
    expect(result.current.cities).toEqual([]);
  });

  it("cities: [] cuando la acción devuelve array vacío (fallback de la acción)", async () => {
    mockedAction.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useHomeCities(), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cities).toEqual([]);
  });
});
