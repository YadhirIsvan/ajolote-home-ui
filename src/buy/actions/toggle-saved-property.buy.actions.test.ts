import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleSavedPropertyAction } from "./toggle-saved-property.buy.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedPost = vi.mocked(axiosInstance.post);
const mockedDelete = vi.mocked(axiosInstance.delete);

beforeEach(() => vi.clearAllMocks());

describe("toggleSavedPropertyAction", () => {
  it("no guardada → hace POST y devuelve { success: true, isSaved: true }", async () => {
    mockedPost.mockResolvedValueOnce({} as never);

    const result = await toggleSavedPropertyAction(5, false);

    expect(mockedPost).toHaveBeenCalledWith("/client/saved-properties", { property_id: 5 });
    expect(result).toEqual({ success: true, isSaved: true });
  });

  it("ya guardada → hace DELETE y devuelve { success: true, isSaved: false }", async () => {
    mockedDelete.mockResolvedValueOnce({} as never);

    const result = await toggleSavedPropertyAction(5, true);

    expect(mockedDelete).toHaveBeenCalledWith("/client/saved-properties/5");
    expect(result).toEqual({ success: true, isSaved: false });
  });

  it("error al guardar → { success: false, isSaved: false } (mantiene estado anterior)", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await toggleSavedPropertyAction(5, false);

    expect(result).toEqual({ success: false, isSaved: false });
  });

  it("error al eliminar → { success: false, isSaved: true } (mantiene estado anterior)", async () => {
    mockedDelete.mockRejectedValueOnce(new Error("Network error"));

    const result = await toggleSavedPropertyAction(5, true);

    expect(result).toEqual({ success: false, isSaved: true });
  });
});
