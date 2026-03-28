import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkSavedPropertyAction } from "./check-saved-property.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { get: vi.fn() },
}));

const mockedGet = vi.mocked(axiosInstance.get);

beforeEach(() => vi.clearAllMocks());

describe("checkSavedPropertyAction", () => {
  it("is_saved: true → { isSaved: true }", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: true } } as never);

    const result = await checkSavedPropertyAction(42);

    expect(result).toEqual({ isSaved: true });
  });

  it("is_saved: false → { isSaved: false }", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: false } } as never);

    const result = await checkSavedPropertyAction(42);

    expect(result).toEqual({ isSaved: false });
  });

  it("llama con URL que incluye el propertyId correcto", async () => {
    mockedGet.mockResolvedValueOnce({ data: { is_saved: false } } as never);

    await checkSavedPropertyAction(99);

    expect(mockedGet).toHaveBeenCalledWith(
      "/client/saved-properties/check?property_id=99"
    );
  });

  it("error → silencia y retorna { isSaved: false }", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await checkSavedPropertyAction(42);

    expect(result).toEqual({ isSaved: false });
  });
});
