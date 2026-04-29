import { describe, it, expect, vi, beforeEach } from "vitest";
import { naturalSearchAction } from "./natural-search.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { post: vi.fn() },
  ENDPOINTS: { NATURAL_SEARCH: "/public/properties/search/parse" },
}));

const mockedPost = vi.mocked(buyApi.post);

const MOCK_RESULT = {
  zone: "Orizaba",
  type: "casa",
  state: "nueva",
  price_min: 500000,
  price_max: 2000000,
  amenities: ["1"],
  bedrooms_min: 3,
  bathrooms_min: 2,
  parking_min: null,
  sqm_min: null,
  sqm_max: null,
};

beforeEach(() => vi.clearAllMocks());

describe("naturalSearchAction", () => {
  it("llama al endpoint correcto con { query } en el body", async () => {
    mockedPost.mockResolvedValueOnce({ data: MOCK_RESULT } as never);

    await naturalSearchAction("casa con alberca en Orizaba");

    expect(mockedPost).toHaveBeenCalledWith(
      "/public/properties/search/parse",
      { query: "casa con alberca en Orizaba" }
    );
  });

  it("retorna exactamente response.data sin transformación", async () => {
    mockedPost.mockResolvedValueOnce({ data: MOCK_RESULT } as never);

    const result = await naturalSearchAction("casa grande");

    expect(result).toEqual(MOCK_RESULT);
  });

  it("error de API lanza Error con el mensaje original", async () => {
    mockedPost.mockRejectedValueOnce(new Error("AI service unavailable"));

    await expect(naturalSearchAction("algo")).rejects.toThrow("AI service unavailable");
  });
});
