import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { createElement } from "react";
import {
  useBuyProperties,
  formatPrice,
} from "./use-buy-properties.buy.hook";
import { getPropertiesAction } from "@/buy/actions/get-properties.actions";
import { getCitiesAction } from "@/shared/actions/get-cities.actions";
import { naturalSearchAction } from "@/buy/actions/natural-search.actions";
import { DEFAULT_BUY_FILTERS, PRICE_RANGE_LIMITS } from "@/buy/constants/buy.constants";

vi.mock("@/buy/actions/get-properties.actions");
vi.mock("@/shared/actions/get-cities.actions");
vi.mock("@/buy/actions/natural-search.actions");
vi.mock("@/shared/hooks/auth.context", () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, user: null })),
}));

const mockedGetProperties = vi.mocked(getPropertiesAction);
const mockedGetCities = vi.mocked(getCitiesAction);
const mockedNaturalSearch = vi.mocked(naturalSearchAction);

// jsdom no implementa IntersectionObserver — stub global
vi.stubGlobal(
  "IntersectionObserver",
  vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() }))
);

function makeWrapper(search = "") {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(
      QueryClientProvider, { client },
      createElement(MemoryRouter, { initialEntries: [`/comprar${search}`] }, children)
    );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockedGetProperties.mockResolvedValue({
    data: [], totalCount: 0, hasMore: false,
  });
  mockedGetCities.mockResolvedValue([]);
});

// ─── formatPrice (función pura exportada) ─────────────────────────────────────

describe("formatPrice", () => {
  it("formatea 1500000 con $ y separadores MXN", () => {
    const result = formatPrice(1500000);
    expect(result).toContain("$");
    expect(result).toMatch(/1[,.]500[,.]000/);
  });

  it("formatea 0 correctamente", () => {
    const result = formatPrice(0);
    expect(result).toContain("$");
    expect(result).toContain("0");
  });
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useBuyProperties — estado inicial", () => {
  it("filters igual a DEFAULT_BUY_FILTERS, isFilterOpen: false, activeFiltersCount: 0", async () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    expect(result.current.filters).toEqual(DEFAULT_BUY_FILTERS);
    expect(result.current.isFilterOpen).toBe(false);
    expect(result.current.activeFiltersCount).toBe(0);
  });
});

// ─── Gestión de filtros ───────────────────────────────────────────────────────

describe("useBuyProperties — filtros", () => {
  it("setZone actualiza filters.zone e incrementa activeFiltersCount", () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    act(() => result.current.setZone("Orizaba"));

    expect(result.current.filters.zone).toBe("Orizaba");
    expect(result.current.activeFiltersCount).toBeGreaterThan(0);
  });

  it("setType actualiza filters.type", () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    act(() => result.current.setType("casa"));

    expect(result.current.filters.type).toBe("casa");
  });

  it("clearFilters resetea a DEFAULT_BUY_FILTERS y activeFiltersCount: 0", () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    act(() => result.current.setZone("Orizaba"));
    act(() => result.current.setType("casa"));
    act(() => result.current.clearFilters());

    expect(result.current.filters).toEqual(DEFAULT_BUY_FILTERS);
    expect(result.current.activeFiltersCount).toBe(0);
  });

  it("toggleAmenity agrega la amenidad; segunda llamada la elimina", () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    act(() => result.current.toggleAmenity("1"));
    expect(result.current.filters.amenities).toContain("1");
    expect(result.current.activeFiltersCount).toBeGreaterThan(0);

    act(() => result.current.toggleAmenity("1"));
    expect(result.current.filters.amenities).not.toContain("1");
  });

  it("activeFiltersCount incrementa al activar priceRange fuera del default", () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    act(() => result.current.setPriceRange([1000000, PRICE_RANGE_LIMITS.max]));

    expect(result.current.activeFiltersCount).toBeGreaterThan(0);
  });
});

// ─── handleNaturalSearch ──────────────────────────────────────────────────────

describe("useBuyProperties — handleNaturalSearch", () => {
  it("query vacío no llama a naturalSearchAction", async () => {
    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    await act(() => result.current.handleNaturalSearch("   "));

    expect(mockedNaturalSearch).not.toHaveBeenCalled();
  });

  it("búsqueda exitosa aplica los filters del resultado y guarda naturalSearchQuery", async () => {
    mockedNaturalSearch.mockResolvedValueOnce({
      zone: "Córdoba",
      type: "departamento",
      state: "nueva",
      price_min: 300000,
      price_max: 1500000,
      amenities: ["1", "2"],
      bedrooms_min: 2,
      bathrooms_min: 1,
      parking_min: 1,
      sqm_min: 60,
      sqm_max: 150,
    });

    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    await act(() => result.current.handleNaturalSearch("depa en Córdoba"));

    expect(result.current.filters.zone).toBe("Córdoba");
    expect(result.current.filters.type).toBe("departamento");
    expect(result.current.filters.priceRange).toEqual([300000, 1500000]);
    expect(result.current.filters.amenities).toEqual(["1", "2"]);
    expect(result.current.naturalSearchQuery).toBe("depa en Córdoba");
    expect(result.current.isNaturalSearching).toBe(false);
  });

  it("búsqueda fallida popula naturalSearchError y isNaturalSearching: false", async () => {
    mockedNaturalSearch.mockRejectedValueOnce(new Error("AI Error"));

    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    await act(() => result.current.handleNaturalSearch("algo imposible"));

    expect(result.current.naturalSearchError).toBeTruthy();
    expect(result.current.isNaturalSearching).toBe(false);
  });

  it("clearNaturalSearch resetea naturalSearchQuery, naturalSearchError y filters", async () => {
    mockedNaturalSearch.mockResolvedValueOnce({
      zone: "Orizaba", type: "casa", state: "all",
      price_min: null, price_max: null, amenities: [],
      bedrooms_min: null, bathrooms_min: null,
      parking_min: null, sqm_min: null, sqm_max: null,
    });

    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    await act(() => result.current.handleNaturalSearch("casa en Orizaba"));
    act(() => result.current.clearNaturalSearch());

    expect(result.current.naturalSearchQuery).toBe("");
    expect(result.current.naturalSearchError).toBeNull();
    expect(result.current.filters).toEqual(DEFAULT_BUY_FILTERS);
  });
});

// ─── filteredProperties con priceRange ───────────────────────────────────────

describe("useBuyProperties — filteredProperties", () => {
  it("filtra propiedades fuera del priceRange configurado", async () => {
    mockedGetProperties.mockResolvedValueOnce({
      data: [
        {
          id: 1, title: "A", address: "", image: "", price: "$500,000",
          priceNum: 500000, beds: 2, baths: 1, sqm: 60,
          type: "casa", state: "nueva", daysListed: 1,
          interested: 0, views: 0, isFeatured: false, isVerified: true,
        },
        {
          id: 2, title: "B", address: "", image: "", price: "$5,000,000",
          priceNum: 5000000, beds: 4, baths: 3, sqm: 200,
          type: "casa", state: "nueva", daysListed: 2,
          interested: 0, views: 0, isFeatured: false, isVerified: true,
        },
      ],
      totalCount: 2, hasMore: false,
    });

    const { result } = renderHook(() => useBuyProperties(), { wrapper: makeWrapper() });

    // Restringir priceRange a [0, 1_000_000] — solo debe pasar la propiedad A
    act(() => result.current.setPriceRange([0, 1000000]));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.filteredProperties.every((p) => p.priceNum <= 1000000)).toBe(true);
  });
});
