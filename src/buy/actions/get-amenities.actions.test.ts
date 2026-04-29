import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAmenitiesAction } from "./get-amenities.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { get: vi.fn() },
  ENDPOINTS: {},
}));

const mockedGet = vi.mocked(buyApi.get);

beforeEach(() => vi.clearAllMocks());

describe("getAmenitiesAction", () => {
  it("respuesta exitosa array retorna el array tal cual", async () => {
    const amenities = [
      { id: 1, name: "Alberca", icon: "pool" },
      { id: 2, name: "Gimnasio", icon: "gym" },
    ];
    mockedGet.mockResolvedValueOnce({ data: amenities } as never);

    const result = await getAmenitiesAction();

    expect(result).toEqual(amenities);
    expect(result).toHaveLength(2);
  });

  it("respuesta exitosa pero no es array retorna []", async () => {
    mockedGet.mockResolvedValueOnce({ data: { id: 1 } } as never);

    const result = await getAmenitiesAction();

    expect(result).toEqual([]);
  });

  it("error de API lanza Error con mensaje descriptivo", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    await expect(getAmenitiesAction()).rejects.toThrow("Network Error");
  });
});
