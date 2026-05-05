import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkSavedPropertyAction } from "./check-saved-property.buy.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { get: vi.fn() },
}));

const mockedGet = vi.mocked(axiosInstance.get);

beforeEach(() => vi.clearAllMocks());

describe("checkSavedPropertyAction (buy)", () => {
  it("is_saved: true → { isSaved: true }", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: true } } as never);

    expect(await checkSavedPropertyAction(42)).toEqual({ isSaved: true });
  });

  it("is_saved: false → { isSaved: false }", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: false } } as never);

    expect(await checkSavedPropertyAction(42)).toEqual({ isSaved: false });
  });

  it("llama con el propertyId correcto en la URL", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: false } } as never);

    await checkSavedPropertyAction(99);

    expect(mockedGet).toHaveBeenCalledWith(
      "/client/saved-properties/check?property_id=99"
    );
  });

  it("error → silencia y retorna { isSaved: false }", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network error"));

    expect(await checkSavedPropertyAction(42)).toEqual({ isSaved: false });
  });
});
