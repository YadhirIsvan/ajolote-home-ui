import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { uploadClientPropertyFilesAction } from "./upload-client-property-files.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { uploadPropertyFiles: vi.fn() },
}));

const mockedUpload = vi.mocked(clientApi.uploadPropertyFiles);

// Mock global FormData para poder inspeccionar los datos adjuntos
const appendSpy = vi.fn();
class FormDataMock {
  append = appendSpy;
}

beforeEach(() => {
  vi.clearAllMocks();
  appendSpy.mockClear();
  vi.stubGlobal("FormData", FormDataMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeFile(name: string): File {
  return new File(["content"], name, { type: "application/pdf" });
}

describe("uploadClientPropertyFilesAction", () => {
  it("llama uploadPropertyFiles una vez por archivo cuando se pasan múltiples", async () => {
    mockedUpload.mockResolvedValue(undefined as never);

    const files = [makeFile("a.pdf"), makeFile("b.pdf"), makeFile("c.pdf")];
    await uploadClientPropertyFilesAction(7, files);

    expect(mockedUpload).toHaveBeenCalledTimes(3);
  });

  it("usa el processId correcto en cada llamada", async () => {
    mockedUpload.mockResolvedValue(undefined as never);

    await uploadClientPropertyFilesAction(42, [makeFile("doc.pdf")]);

    expect(mockedUpload).toHaveBeenCalledWith(42, expect.any(FormDataMock));
  });

  it("agrega 'name' sin extensión al FormData", async () => {
    mockedUpload.mockResolvedValue(undefined as never);

    await uploadClientPropertyFilesAction(1, [makeFile("contrato.pdf")]);

    // appendSpy called with ("file", File) and ("name", "contrato")
    const nameCalls = appendSpy.mock.calls.filter(
      ([key]: [string]) => key === "name"
    );
    expect(nameCalls[0][1]).toBe("contrato");
  });

  it("éxito → resuelve void", async () => {
    mockedUpload.mockResolvedValue(undefined as never);

    await expect(
      uploadClientPropertyFilesAction(1, [makeFile("doc.pdf")])
    ).resolves.toBeUndefined();
  });

  it("error → lanza con el mensaje del Error", async () => {
    mockedUpload.mockRejectedValueOnce(new Error("File too large"));

    await expect(
      uploadClientPropertyFilesAction(1, [makeFile("big.pdf")])
    ).rejects.toThrow("File too large");
  });
});
