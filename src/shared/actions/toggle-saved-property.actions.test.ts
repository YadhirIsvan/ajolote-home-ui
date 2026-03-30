import { describe, it, expect, vi, beforeEach } from "vitest";
import { toggleSavedPropertyAction } from "./toggle-saved-property.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: {
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedDelete = vi.mocked(axiosInstance.delete);
const mockedPost = vi.mocked(axiosInstance.post);

beforeEach(() => vi.clearAllMocks());

describe("toggleSavedPropertyAction", () => {
  it("currentlySaved: true → llama DELETE → { success: true, isSaved: false }", async () => {
    mockedDelete.mockResolvedValueOnce({} as never);

    const result = await toggleSavedPropertyAction(42, true);

    expect(mockedDelete).toHaveBeenCalledWith("/client/saved-properties/42");
    expect(result).toEqual({ success: true, isSaved: false });
  });

  it("currentlySaved: false → llama POST con property_id → { success: true, isSaved: true }", async () => {
    mockedPost.mockResolvedValueOnce({} as never);

    const result = await toggleSavedPropertyAction(42, false);

    expect(mockedPost).toHaveBeenCalledWith("/client/saved-properties", {
      property_id: 42,
    });
    expect(result).toEqual({ success: true, isSaved: true });
  });

  it("currentlySaved: true → no llama POST", async () => {
    mockedDelete.mockResolvedValueOnce({} as never);

    await toggleSavedPropertyAction(42, true);

    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("currentlySaved: false → no llama DELETE", async () => {
    mockedPost.mockResolvedValueOnce({} as never);

    await toggleSavedPropertyAction(42, false);

    expect(mockedDelete).not.toHaveBeenCalled();
  });

  it("error → silencia y retorna { success: false, isSaved: currentlySaved }", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Network Error"));

    const result = await toggleSavedPropertyAction(7, false);

    expect(result).toEqual({ success: false, isSaved: false });
  });
});
