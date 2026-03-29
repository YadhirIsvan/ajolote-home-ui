import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientSavedPropertiesAction } from "./get-client-saved-properties.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getSavedProperties: vi.fn() },
}));

const mockedGetSavedProperties = vi.mocked(clientApi.getSavedProperties);

function makeBackendEntry(overrides: Record<string, unknown> = {}) {
  return {
    id: 50,
    saved_at: "2026-03-28T10:00:00Z",
    property: {
      id: 500,
      title: "Casa en Córdoba",
      address: "Calle 5 de Mayo 22",
      price: "1,200,000",
      property_type: "casa",
      bedrooms: 3,
      bathrooms: 2,
      construction_sqm: "120.00",
      image: "https://example.com/img.jpg",
      is_verified: true,
    },
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("getClientSavedPropertiesAction", () => {
  it("mapea snake_case → camelCase: propertyType, isVerified, constructionSqm, savedAt", async () => {
    mockedGetSavedProperties.mockResolvedValueOnce({
      data: { results: [makeBackendEntry()] },
    } as never);

    const [item] = await getClientSavedPropertiesAction();

    expect(item.propertyType).toBe("casa");
    expect(item.isVerified).toBe(true);
    expect(item.constructionSqm).toBe("120.00");
    expect(item.savedAt).toBe("2026-03-28T10:00:00Z");
    expect(item.propertyId).toBe(500);
  });

  it("formato con wrapper { results: [...] } → mapeado correctamente", async () => {
    mockedGetSavedProperties.mockResolvedValueOnce({
      data: { results: [makeBackendEntry(), makeBackendEntry({ id: 51 })] },
    } as never);

    const result = await getClientSavedPropertiesAction();

    expect(result).toHaveLength(2);
  });

  it("formato flat array [...] (sin wrapper) → mapeado correctamente", async () => {
    mockedGetSavedProperties.mockResolvedValueOnce({
      data: [makeBackendEntry(), makeBackendEntry({ id: 51 })],
    } as never);

    const result = await getClientSavedPropertiesAction();

    expect(result).toHaveLength(2);
    expect(result[0].propertyType).toBe("casa");
  });

  it("property.image: null → image: null preservado", async () => {
    mockedGetSavedProperties.mockResolvedValueOnce({
      data: {
        results: [
          makeBackendEntry({
            property: {
              id: 1, title: "Sin foto", address: "A", price: "0",
              property_type: "casa", bedrooms: 1, bathrooms: 1,
              construction_sqm: null, image: null, is_verified: false,
            },
          }),
        ],
      },
    } as never);

    const [item] = await getClientSavedPropertiesAction();

    expect(item.image).toBeNull();
  });

  it("error → silencia y retorna []", async () => {
    mockedGetSavedProperties.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await getClientSavedPropertiesAction();

    expect(result).toEqual([]);
  });
});
