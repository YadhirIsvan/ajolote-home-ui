import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCitiesAction } from "./get-cities.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { get: vi.fn() },
}));

const mockedGet = vi.mocked(axiosInstance.get);

beforeEach(() => vi.clearAllMocks());

describe("getCitiesAction", () => {
  it("éxito → retorna el array de CityItem", async () => {
    const cities = [
      { id: 1, name: "Orizaba", state: 30 },
      { id: 2, name: "Córdoba", state: 30 },
    ];
    mockedGet.mockResolvedValueOnce({ data: cities } as never);

    const result = await getCitiesAction();

    expect(result).toEqual(cities);
    expect(mockedGet).toHaveBeenCalledWith("/catalogs/cities");
  });

  it("backend devuelve no-array → retorna []", async () => {
    mockedGet.mockResolvedValueOnce({ data: null } as never);

    const result = await getCitiesAction();

    expect(result).toEqual([]);
  });

  it("error de red → silencia y retorna []", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network error"));

    const result = await getCitiesAction();

    expect(result).toEqual([]);
  });
});
