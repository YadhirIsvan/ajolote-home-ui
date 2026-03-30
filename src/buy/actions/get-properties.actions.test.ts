import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPropertiesAction } from "./get-properties.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { get: vi.fn() },
  ENDPOINTS: { PROPERTIES: "/public/properties" },
}));

const mockedGet = vi.mocked(buyApi.get);

function makeBackendItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: "Casa Test",
    address: "Calle 1",
    price: "1200000",
    property_type: "casa",
    property_condition: "nueva",
    bedrooms: 3,
    bathrooms: 2,
    construction_sqm: "120",
    image: "https://cdn.test/img.jpg",
    is_verified: true,
    is_featured: false,
    days_listed: 5,
    interested: 3,
    views: 50,
    ...overrides,
  };
}

function makePaginatedResponse(
  items: ReturnType<typeof makeBackendItem>[],
  opts: { count?: number; next?: string | null } = {}
) {
  return {
    data: {
      count: opts.count ?? items.length,
      next: opts.next !== undefined ? opts.next : null,
      previous: null,
      results: items,
    },
  };
}

beforeEach(() => vi.clearAllMocks());

// ─── mapItem: transformación ──────────────────────────────────────────────────

describe("getPropertiesAction — mapItem", () => {
  it("image: null aplica fallback a /placeholder.svg", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ image: null })]) as never
    );
    const { data } = await getPropertiesAction({});
    expect(data[0].image).toBe("/placeholder.svg");
  });

  it("construction_sqm vacío produce sqm: 0", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ construction_sqm: "" })]) as never
    );
    const { data } = await getPropertiesAction({});
    expect(data[0].sqm).toBe(0);
  });

  it("price string produce priceNum como number y price formateado en MXN", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem({ price: "1200000" })]) as never
    );
    const { data } = await getPropertiesAction({});
    expect(data[0].priceNum).toBe(1200000);
    expect(data[0].price).toContain("$");
    expect(data[0].price).toMatch(/1[,.]200[,.]000/);
  });
});

// ─── Query params ─────────────────────────────────────────────────────────────

describe("getPropertiesAction — query params", () => {
  beforeEach(() => {
    mockedGet.mockResolvedValue(makePaginatedResponse([]) as never);
  });

  it("sin filtros la URL no añade params opcionales", async () => {
    await getPropertiesAction({});
    const url = mockedGet.mock.calls[0][0] as string;
    expect(url).not.toContain("type=");
    expect(url).not.toContain("state=");
    expect(url).not.toContain("zone=");
  });

  it("type: 'casa' → type=house en la URL", async () => {
    await getPropertiesAction({ type: "casa" });
    expect(mockedGet.mock.calls[0][0]).toContain("type=house");
  });

  it("state: 'preventa' → state=new en la URL", async () => {
    await getPropertiesAction({ state: "preventa" });
    expect(mockedGet.mock.calls[0][0]).toContain("state=new");
  });

  it("amenities: ['1','2'] genera dos params separados", async () => {
    await getPropertiesAction({ amenities: ["1", "2"] });
    const url = mockedGet.mock.calls[0][0] as string;
    expect(url).toContain("amenities=1");
    expect(url).toContain("amenities=2");
  });

  it("price_min, price_max, bedrooms_min, sqm_min, sqm_max se añaden a la URL", async () => {
    await getPropertiesAction({
      price_min: 500000,
      price_max: 3000000,
      bedrooms_min: 2,
      sqm_min: 80,
      sqm_max: 200,
    });
    const url = mockedGet.mock.calls[0][0] as string;
    expect(url).toContain("price_min=500000");
    expect(url).toContain("price_max=3000000");
    expect(url).toContain("bedrooms_min=2");
    expect(url).toContain("sqm_min=80");
    expect(url).toContain("sqm_max=200");
  });
});

// ─── Respuestas ───────────────────────────────────────────────────────────────

describe("getPropertiesAction — respuestas de la API", () => {
  it("éxito retorna fromFallback: false, totalCount y hasMore: true cuando next !== null", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse(
        [makeBackendItem(), makeBackendItem({ id: 2 })],
        { count: 50, next: "/public/properties?offset=20" }
      ) as never
    );

    const result = await getPropertiesAction({ limit: 20 });

    expect(result.fromFallback).toBe(false);
    expect(result.totalCount).toBe(50);
    expect(result.hasMore).toBe(true);
    expect(result.data).toHaveLength(2);
  });

  it("next: null retorna hasMore: false", async () => {
    mockedGet.mockResolvedValueOnce(
      makePaginatedResponse([makeBackendItem()], { count: 1, next: null }) as never
    );

    const { hasMore } = await getPropertiesAction({});

    expect(hasMore).toBe(false);
  });

  it("error retorna { data: [], totalCount: 0, hasMore: false, fromFallback: true }", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Server Error"));

    const result = await getPropertiesAction({});

    expect(result.fromFallback).toBe(true);
    expect(result.data).toHaveLength(0);
    expect(result.totalCount).toBe(0);
    expect(result.hasMore).toBe(false);
  });
});
