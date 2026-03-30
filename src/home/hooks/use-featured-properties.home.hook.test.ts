import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useFeaturedProperties } from "./use-featured-properties.home.hook";
import { getFeaturedPropertiesAction } from "@/home/actions/get-featured-properties.actions";
import type { GetFeaturedPropertiesParams } from "@/home/types/property.types";

vi.mock("@/home/actions/get-featured-properties.actions");

const mockedAction = vi.mocked(getFeaturedPropertiesAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

const EMPTY_PARAMS: GetFeaturedPropertiesParams = {};

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Casa A",
    address: "Calle 1",
    image: "/img/a.jpg",
    price: "$1,500,000",
    priceNum: 1500000,
    beds: 3,
    baths: 2,
    sqm: 120,
    type: "house",
    state: "new",
    daysListed: 5,
    interested: 10,
    views: 200,
    isFeatured: true,
    isVerified: true,
  },
  {
    id: 2,
    title: "Depa B",
    address: "Calle 2",
    image: "/img/b.jpg",
    price: "$800,000",
    priceNum: 800000,
    beds: 2,
    baths: 1,
    sqm: 70,
    type: "apartment",
    state: "used",
    daysListed: 12,
    interested: 4,
    views: 95,
    isFeatured: true,
    isVerified: false,
  },
];

// ─── Estado de carga ─────────────────────────────────────────────────────────

describe("useFeaturedProperties — estado de carga", () => {
  it("isLoading: true mientras la acción está en vuelo", () => {
    mockedAction.mockReturnValue(new Promise(() => {})); // promesa que nunca resuelve
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
  });

  it("isLoading: false después de que la acción resuelve", async () => {
    mockedAction.mockResolvedValueOnce({ data: MOCK_PROPERTIES, fromFallback: false });
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});

// ─── Datos ───────────────────────────────────────────────────────────────────

describe("useFeaturedProperties — datos", () => {
  beforeEach(() => vi.clearAllMocks());

  it("properties recibe el array mapeado que devuelve la acción", async () => {
    mockedAction.mockResolvedValueOnce({ data: MOCK_PROPERTIES, fromFallback: false });
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.properties).toHaveLength(2);
    expect(result.current.properties[0].id).toBe(1);
    expect(result.current.properties[1].id).toBe(2);
  });

  it("properties: [] como valor por defecto antes de resolver", () => {
    mockedAction.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    expect(result.current.properties).toEqual([]);
  });

  it("isFromFallback: false cuando la acción responde exitosamente", async () => {
    mockedAction.mockResolvedValueOnce({ data: MOCK_PROPERTIES, fromFallback: false });
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isFromFallback).toBe(false);
  });

  it("isFromFallback: true cuando la acción devuelve fromFallback: true", async () => {
    mockedAction.mockResolvedValueOnce({ data: [], fromFallback: true });
    const { result } = renderHook(() => useFeaturedProperties(EMPTY_PARAMS), {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isFromFallback).toBe(true);
    expect(result.current.properties).toEqual([]);
  });
});

// ─── Reactividad ─────────────────────────────────────────────────────────────

describe("useFeaturedProperties — reactividad", () => {
  beforeEach(() => vi.clearAllMocks());

  it("re-ejecuta la query cuando params cambia", async () => {
    mockedAction.mockResolvedValue({ data: [], fromFallback: false });

    const { rerender } = renderHook(
      ({ params }: { params: GetFeaturedPropertiesParams }) =>
        useFeaturedProperties(params),
      {
        wrapper: makeWrapper(),
        initialProps: { params: { type: "casa" } },
      }
    );

    await waitFor(() => expect(mockedAction).toHaveBeenCalledTimes(1));
    expect(mockedAction).toHaveBeenCalledWith({ type: "casa" });

    rerender({ params: { type: "departamento" } });

    await waitFor(() => expect(mockedAction).toHaveBeenCalledTimes(2));
    expect(mockedAction).toHaveBeenCalledWith({ type: "departamento" });
  });
});
