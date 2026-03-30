import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFeaturedPropertiesAction } from "./get-featured-properties.actions";
import { homeApi } from "@/home/api/home.api";

vi.mock("@/home/api/home.api", () => ({
  homeApi: { get: vi.fn() },
  ENDPOINTS: { FEATURED_PROPERTIES: "/public/properties" },
}));

const mockedGet = vi.mocked(homeApi.get);

// ─── Factory ────────────────────────────────────────────────────────────────

function makeBackendItem(overrides: Partial<{
  id: number;
  title: string;
  address: string;
  price: string;
  property_type: string;
  property_condition: string;
  bedrooms: number;
  bathrooms: number;
  construction_sqm: string;
  image: string | null;
  is_verified: boolean;
  is_featured: boolean;
  days_listed: number;
  interested: number;
  views: number;
}> = {}) {
  return {
    id: 1,
    title: "Casa en Orizaba",
    address: "Calle Falsa 123",
    price: "1500000",
    property_type: "casa",
    property_condition: "nueva",
    bedrooms: 3,
    bathrooms: 2,
    construction_sqm: "120",
    image: "https://example.com/foto.jpg",
    is_verified: true,
    is_featured: true,
    days_listed: 10,
    interested: 5,
    views: 100,
    ...overrides,
  };
}

function makePaginatedResponse(items: ReturnType<typeof makeBackendItem>[]) {
  return { data: { count: items.length, next: null, previous: null, results: items } };
}

// ─── mapItem: transformación del item del backend ───────────────────────────

describe("mapItem — transformación del item del backend", () => {
  beforeEach(() => {
    mockedGet.mockResolvedValue(makePaginatedResponse([makeBackendItem()]));
  });

  it("image: null aplica fallback a /placeholder.svg", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ image: null })])
    );
    const { data } = await getFeaturedPropertiesAction({});
    expect(data[0].image).toBe("/placeholder.svg");
  });

  it("image con valor se usa tal cual", async () => {
    const url = "https://cdn.example.com/foto.jpg";
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ image: url })])
    );
    const { data } = await getFeaturedPropertiesAction({});
    expect(data[0].image).toBe(url);
  });

  it("construction_sqm vacío produce sqm: 0", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ construction_sqm: "" })])
    );
    const { data } = await getFeaturedPropertiesAction({});
    expect(data[0].sqm).toBe(0);
  });

  it("price como string numérico produce priceNum como number y price formateado en MXN", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ price: "1500000" })])
    );
    const { data } = await getFeaturedPropertiesAction({});
    expect(data[0].priceNum).toBe(1500000);
    expect(data[0].price).toMatch(/1[,.]500[,.]000/); // formato MXN varía por locale
    expect(data[0].price).toContain("$");
  });

  it("is_featured e is_verified se mapean directamente como boolean", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ is_featured: false, is_verified: false })])
    );
    const { data } = await getFeaturedPropertiesAction({});
    expect(data[0].isFeatured).toBe(false);
    expect(data[0].isVerified).toBe(false);
  });
});

// ─── getFeaturedPropertiesAction: construcción de query params ───────────────

describe("getFeaturedPropertiesAction — construcción de query params", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue(makePaginatedResponse([]));
  });

  it("sin filtros opcionales solo incluye featured=true en la URL", async () => {
    await getFeaturedPropertiesAction({});
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("featured=true");
    expect(calledUrl).not.toContain("type=");
    expect(calledUrl).not.toContain("state=");
    expect(calledUrl).not.toContain("zone=");
  });

  it("type: 'casa' se traduce a 'house' en la URL", async () => {
    await getFeaturedPropertiesAction({ type: "casa" });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("type=house");
  });

  it("type: 'all' no añade el param type", async () => {
    await getFeaturedPropertiesAction({ type: "all" });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("type=");
  });

  it("state: 'preventa' se traduce a 'new' en la URL", async () => {
    await getFeaturedPropertiesAction({ state: "preventa" });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("state=new");
  });

  it("state: 'all' no añade el param state", async () => {
    await getFeaturedPropertiesAction({ state: "all" });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).not.toContain("state=");
  });

  it("amenities con dos valores genera dos params separados", async () => {
    await getFeaturedPropertiesAction({ amenities: ["pool", "gym"] });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("amenities=pool");
    expect(calledUrl).toContain("amenities=gym");
  });

  it("limit y offset definidos se añaden como strings en la URL", async () => {
    await getFeaturedPropertiesAction({ limit: 10, offset: 20 });
    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("limit=10");
    expect(calledUrl).toContain("offset=20");
  });
});

// ─── getFeaturedPropertiesAction: respuestas de la API ───────────────────────

describe("getFeaturedPropertiesAction — respuestas de la API", () => {
  it("respuesta 200 exitosa retorna fromFallback: false y data mapeada", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ id: 42, title: "Depa en Córdoba" })])
    );
    const result = await getFeaturedPropertiesAction({});
    expect(result.fromFallback).toBe(false);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(42);
    expect(result.data[0].title).toBe("Depa en Córdoba");
  });

  it("results vacío retorna data: [] y fromFallback: false", async () => {
    mockedGet.mockResolvedValueOnce(makePaginatedResponse([]));
    const result = await getFeaturedPropertiesAction({});
    expect(result.fromFallback).toBe(false);
    expect(result.data).toHaveLength(0);
  });

  it("la API lanza error retorna { data: [], fromFallback: true } sin propagar la excepción", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));
    const result = await getFeaturedPropertiesAction({});
    expect(result.fromFallback).toBe(true);
    expect(result.data).toHaveLength(0);
  });
});
