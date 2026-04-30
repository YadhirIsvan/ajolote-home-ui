import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientPropertyFilesAction } from "./get-client-property-files.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getPropertyFiles: vi.fn() },
}));

const mockedGetPropertyFiles = vi.mocked(clientApi.getPropertyFiles);

beforeEach(() => vi.clearAllMocks());

describe("getClientPropertyFilesAction", () => {
  it("éxito con documents array → retorna el array directamente", async () => {
    const docs = [{ id: 1, name: "contrato.pdf" }, { id: 2, name: "id.jpg" }];
    mockedGetPropertyFiles.mockResolvedValueOnce({
      data: { documents: docs },
    } as never);

    const result = await getClientPropertyFilesAction(42);

    expect(mockedGetPropertyFiles).toHaveBeenCalledWith(42);
    expect(result).toEqual(docs);
  });

  it("documents no es array → retorna []", async () => {
    mockedGetPropertyFiles.mockResolvedValueOnce({
      data: { documents: "not-an-array" },
    } as never);

    const result = await getClientPropertyFilesAction(42);

    expect(result).toEqual([]);
  });

  it("error → lanza un Error", async () => {
    mockedGetPropertyFiles.mockRejectedValueOnce(new Error("Not found"));

    await expect(getClientPropertyFilesAction(42)).rejects.toThrow("Not found");
  });
});
