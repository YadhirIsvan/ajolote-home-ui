import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPropertyDetailAction } from "./get-property-detail.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { get: vi.fn() },
  ENDPOINTS: {
    PROPERTY_DETAIL: (id: number) => `/public/properties/${id}`,
  },
}));

const mockedGet = vi.mocked(buyApi.get);

function makeBackendDetail(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: "Casa en Orizaba",
    description: "Descripción de la casa.",
    price: "2500000",
    currency: "MXN",
    property_type: "casa",
    property_condition: "nueva",
    status: "available",
    bedrooms: 4,
    bathrooms: 3,
    parking_spaces: 2,
    construction_sqm: "180",
    land_sqm: "250",
    address: "Calle Principal 100",
    zone: "Orizaba",
    latitude: "18.8534",
    longitude: "-97.0974",
    is_verified: true,
    views: 120,
    days_listed: 15,
    interested: 8,
    images: [
      { id: 2, image_url: "img2.jpg", is_cover: false, sort_order: 2 },
      { id: 1, image_url: "img1.jpg", is_cover: true, sort_order: 1 },
      { id: 3, image_url: "img3.jpg", is_cover: false, sort_order: 3 },
    ],
    amenities: [{ id: 1, name: "Alberca", icon: "pool" }],
    nearby_places: [
      { name: "Walmart", place_type: "supermarket", distance_km: "1.234" },
    ],
    agent: { name: "Carlos A.", photo: "/photo.jpg", phone: "555-9999", email: "c@a.com" },
    coordinates: { lat: 18.8534, lng: -97.0974 },
    similar_properties: [
      {
        id: 10,
        title: "Depa Similar",
        address: "Calle 2",
        price: "800000",
        image: "depa.jpg",
        bedrooms: 2,
        bathrooms: 1,
        construction_sqm: "70",
      },
    ],
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

// ─── mapSimilarProperty ───────────────────────────────────────────────────────

describe("getPropertyDetailAction — mapSimilarProperty", () => {
  it("similar property con image: null usa /placeholder.svg", async () => {
    const detail = makeBackendDetail({
      similar_properties: [
        {
          id: 11, title: "Sin foto", address: "X", price: "500000",
          image: null, bedrooms: 1, bathrooms: 1, construction_sqm: "50",
        },
      ],
    });
    mockedGet.mockResolvedValueOnce({ data: detail } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.similarProperties[0].image).toBe("/placeholder.svg");
  });

  it("similar property con construction_sqm: null produce sqm: 0", async () => {
    const detail = makeBackendDetail({
      similar_properties: [
        {
          id: 12, title: "Terreno", address: "Y", price: "300000",
          image: null, bedrooms: 0, bathrooms: 0, construction_sqm: null,
        },
      ],
    });
    mockedGet.mockResolvedValueOnce({ data: detail } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.similarProperties[0].sqm).toBe(0);
  });
});

// ─── mapDetail ────────────────────────────────────────────────────────────────

describe("getPropertyDetailAction — mapDetail", () => {
  it("land_sqm con valor produce landSqm como number", async () => {
    mockedGet.mockResolvedValueOnce({ data: makeBackendDetail({ land_sqm: "250" }) } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.landSqm).toBe(250);
  });

  it("land_sqm vacío produce landSqm: undefined", async () => {
    mockedGet.mockResolvedValueOnce({ data: makeBackendDetail({ land_sqm: "" }) } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.landSqm).toBeUndefined();
  });

  it("images se ordenan por sort_order antes de extraer image_url", async () => {
    mockedGet.mockResolvedValueOnce({ data: makeBackendDetail() } as never);

    const { data } = await getPropertyDetailAction(1);
    // El backend devuelve [sort_order:2, sort_order:1, sort_order:3]
    // Después de sort → [img1.jpg, img2.jpg, img3.jpg]
    expect(data.images).toEqual(["img1.jpg", "img2.jpg", "img3.jpg"]);
  });

  it("nearby_places produce label formateado como 'Nombre - X.X km'", async () => {
    mockedGet.mockResolvedValueOnce({ data: makeBackendDetail() } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.nearbyPlaces![0].label).toBe("Walmart - 1.2 km");
    expect(data.nearbyPlaces![0].icon).toBe("supermarket");
  });

  it("agent: null en backend produce agent: null en resultado", async () => {
    mockedGet.mockResolvedValueOnce({
      data: makeBackendDetail({ agent: null }),
    } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.agent).toBeNull();
  });

  it("coordinates presente en backend se usa directamente", async () => {
    const coords = { lat: 19.4326, lng: -99.1332 };
    mockedGet.mockResolvedValueOnce({
      data: makeBackendDetail({ coordinates: coords }),
    } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.coordinates).toEqual(coords);
  });

  it("coordinates falsy se calcula desde latitude/longitude", async () => {
    mockedGet.mockResolvedValueOnce({
      data: makeBackendDetail({
        coordinates: null,
        latitude: "18.8534",
        longitude: "-97.0974",
      }),
    } as never);

    const { data } = await getPropertyDetailAction(1);
    expect(data.coordinates.lat).toBeCloseTo(18.8534);
    expect(data.coordinates.lng).toBeCloseTo(-97.0974);
  });
});

// ─── getPropertyDetailAction — respuestas ─────────────────────────────────────

describe("getPropertyDetailAction — respuestas", () => {
  it("éxito retorna fromFallback: false con datos mapeados", async () => {
    mockedGet.mockResolvedValueOnce({ data: makeBackendDetail({ id: 42 }) } as never);

    const result = await getPropertyDetailAction(42);

    expect(result.fromFallback).toBe(false);
    expect(result.data.id).toBe(42);
  });

  it("error retorna fromFallback: true, id correcto y title de 'no encontrada'", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Not Found"));

    const result = await getPropertyDetailAction(99);

    expect(result.fromFallback).toBe(true);
    expect(result.data.id).toBe(99);
    expect(result.data.title).toBe("Propiedad no encontrada");
    expect(result.data.images).toEqual([]);
  });
});
