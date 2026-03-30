import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminPropertiesAction,
  deleteAdminPropertyAction,
  toggleAdminPropertyFeaturedAction,
  getAdminPropertyDetailAction,
  uploadAdminPropertyImagesAction,
  getAdminStatesAction,
  getAdminCitiesAction,
  getAdminAmenitiesAction,
} from "./get-admin-properties.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_PROPERTY = {
  id: 10,
  title: "Casa Premium",
  address: "Calle 5, CDMX",
  price: "3000000.00",
  currency: "MXN",
  property_type: "casa",
  listing_type: "venta",
  status: "activo",
  is_featured: true,
  is_verified: false,
  is_active: true,
  image: "https://cdn.example.com/img.jpg",
  agent: { id: 1, name: "Pedro" },
  documents_count: 3,
  created_at: "2026-01-01T00:00:00Z",
};

const BACKEND_PROPERTY_DETAIL = {
  ...BACKEND_PROPERTY,
  description: "Hermosa casa",
  property_condition: "nuevo",
  bedrooms: 3,
  bathrooms: 2,
  parking_spaces: 1,
  construction_sqm: "120.00",
  land_sqm: "200.00",
  address_street: "Calle 5",
  address_number: "10",
  address_neighborhood: "Col. Centro",
  address_zip: "06000",
  city: { id: 1, name: "CDMX", state_id: 9 },
  zone: "Centro",
  video_id: "",
  latitude: null,
  longitude: null,
  images: [{ id: 50, image_url: "https://cdn.example.com/img.jpg", is_cover: true, sort_order: 0 }],
  amenities: [],
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminPropertiesAction ─────────────────────────────────────────────────

describe("getAdminPropertiesAction — mapeo", () => {
  it("mapea snake_case a camelCase correctamente", async () => {
    mockedApi.getProperties.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_PROPERTY] },
    } as never);

    const result = await getAdminPropertiesAction();

    const prop = result.results[0];
    expect(prop.propertyType).toBe("casa");
    expect(prop.listingType).toBe("venta");
    expect(prop.isFeatured).toBe(true);
    expect(prop.isVerified).toBe(false);
    expect(prop.isActive).toBe(true);
    expect(prop.documentsCount).toBe(3);
    expect(prop.createdAt).toBe("2026-01-01T00:00:00Z");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getProperties.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminPropertiesAction()).rejects.toThrow();
  });
});

// ─── deleteAdminPropertyAction ────────────────────────────────────────────────

describe("deleteAdminPropertyAction", () => {
  it("llama a la API con el id correcto", async () => {
    mockedApi.deleteProperty.mockResolvedValueOnce(undefined as never);
    await deleteAdminPropertyAction(10);
    expect(mockedApi.deleteProperty).toHaveBeenCalledWith(10);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.deleteProperty.mockRejectedValueOnce(new Error("err"));
    await expect(deleteAdminPropertyAction(1)).rejects.toThrow();
  });
});

// ─── toggleAdminPropertyFeaturedAction ───────────────────────────────────────

describe("toggleAdminPropertyFeaturedAction", () => {
  it("retorna { isFeatured } mapeado", async () => {
    mockedApi.toggleFeatured.mockResolvedValueOnce({
      data: { is_featured: false },
    } as never);

    const result = await toggleAdminPropertyFeaturedAction(10);
    expect(result.isFeatured).toBe(false);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.toggleFeatured.mockRejectedValueOnce(new Error("err"));
    await expect(toggleAdminPropertyFeaturedAction(1)).rejects.toThrow();
  });
});

// ─── getAdminPropertyDetailAction ────────────────────────────────────────────

describe("getAdminPropertyDetailAction — mapeo detalle", () => {
  it("mapea campos extendidos: bedrooms, constructionSqm, city.stateId", async () => {
    mockedApi.getPropertyDetail.mockResolvedValueOnce({
      data: BACKEND_PROPERTY_DETAIL,
    } as never);

    const result = await getAdminPropertyDetailAction(10);

    expect(result.bedrooms).toBe(3);
    expect(result.constructionSqm).toBe("120.00");
    expect(result.city?.stateId).toBe(9);
    expect(result.images).toHaveLength(1);
    expect(result.images[0].isCover).toBe(true);
  });

  it("city null cuando backend no envía city", async () => {
    mockedApi.getPropertyDetail.mockResolvedValueOnce({
      data: { ...BACKEND_PROPERTY_DETAIL, city: null },
    } as never);

    const result = await getAdminPropertyDetailAction(10);
    expect(result.city).toBeNull();
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getPropertyDetail.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminPropertyDetailAction(1)).rejects.toThrow();
  });
});

// ─── uploadAdminPropertyImagesAction ─────────────────────────────────────────

describe("uploadAdminPropertyImagesAction", () => {
  it("agrega cada archivo con clave 'images' al FormData", async () => {
    const appendSpy = vi.fn();
    class FormDataMock { append = appendSpy; }
    vi.stubGlobal("FormData", FormDataMock);

    mockedApi.uploadPropertyImages.mockResolvedValueOnce({
      data: [{ id: 50, image_url: "url", is_cover: false, sort_order: 0 }],
    } as never);

    const files = [
      new File(["a"], "a.jpg"),
      new File(["b"], "b.jpg"),
    ];
    const result = await uploadAdminPropertyImagesAction(10, files);

    const imageCalls = appendSpy.mock.calls.filter(([key]) => key === "images");
    expect(imageCalls).toHaveLength(2);
    expect(result).toHaveLength(1);

    vi.unstubAllGlobals();
  });

  it("agrega is_cover cuando setCover es true", async () => {
    const appendSpy = vi.fn();
    class FormDataMock { append = appendSpy; }
    vi.stubGlobal("FormData", FormDataMock);

    mockedApi.uploadPropertyImages.mockResolvedValueOnce({
      data: [],
    } as never);

    await uploadAdminPropertyImagesAction(10, [new File(["c"], "c.jpg")], true);

    const coverCalls = appendSpy.mock.calls.filter(([key]) => key === "is_cover");
    expect(coverCalls).toHaveLength(1);

    vi.unstubAllGlobals();
  });
});

// ─── Catalog actions ──────────────────────────────────────────────────────────

describe("getAdminStatesAction", () => {
  it("mapea countryId desde country_id (array)", async () => {
    mockedApi.getStates.mockResolvedValueOnce({
      data: [{ id: 1, name: "CDMX", code: "DF", country_id: 1 }],
    } as never);

    const result = await getAdminStatesAction();
    expect(result[0].countryId).toBe(1);
    expect(result[0].code).toBe("DF");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getStates.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminStatesAction()).rejects.toThrow();
  });
});

describe("getAdminCitiesAction", () => {
  it("mapea stateId correctamente", async () => {
    mockedApi.getCities.mockResolvedValueOnce({
      data: [{ id: 10, name: "Puebla", state_id: 3 }],
    } as never);

    const result = await getAdminCitiesAction(3);
    expect(result[0].stateId).toBe(3);
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getCities.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminCitiesAction(1)).rejects.toThrow();
  });
});

describe("getAdminAmenitiesAction", () => {
  it("mapea amenidades con icon", async () => {
    mockedApi.getAmenities.mockResolvedValueOnce({
      data: [{ id: 1, name: "Alberca", icon: "pool" }],
    } as never);

    const result = await getAdminAmenitiesAction();
    expect(result[0].name).toBe("Alberca");
    expect(result[0].icon).toBe("pool");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getAmenities.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminAmenitiesAction()).rejects.toThrow();
  });
});
