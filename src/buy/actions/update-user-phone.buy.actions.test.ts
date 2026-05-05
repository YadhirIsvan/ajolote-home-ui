import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserPhoneAction } from "./update-user-phone.buy.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { patch: vi.fn() },
}));

vi.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: vi.fn((v?: string) => !!v && v.startsWith("+") && v.length >= 10),
}));

const mockedPatch = vi.mocked(axiosInstance.patch);

beforeEach(() => vi.clearAllMocks());

const VALID_PHONE = "+525512345678";

describe("updateUserPhoneAction", () => {
  it("phone vacío → { success: false } sin llamar a la API", async () => {
    const result = await updateUserPhoneAction({ phone: "" });

    expect(result.success).toBe(false);
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("phone inválido (sin +) → { success: false } sin llamar a la API", async () => {
    const result = await updateUserPhoneAction({ phone: "5512345678" });

    expect(result.success).toBe(false);
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("phone válido → llama PATCH y retorna { success: true }", async () => {
    mockedPatch.mockResolvedValueOnce({} as never);

    const result = await updateUserPhoneAction({ phone: VALID_PHONE });

    expect(mockedPatch).toHaveBeenCalledWith("/client/profile", { phone: VALID_PHONE });
    expect(result).toEqual({ success: true });
  });

  it("error con response.data.error → retorna mensaje del backend", async () => {
    mockedPatch.mockRejectedValueOnce({
      response: { data: { error: "Teléfono ya registrado" } },
    });

    const result = await updateUserPhoneAction({ phone: VALID_PHONE });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Teléfono ya registrado");
  });

  it("error con response.data.detail → retorna mensaje detail", async () => {
    mockedPatch.mockRejectedValueOnce({
      response: { data: { detail: "Número inválido en el servidor" } },
    });

    const result = await updateUserPhoneAction({ phone: VALID_PHONE });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Número inválido en el servidor");
  });

  it("error sin response.data → mensaje genérico de fallback", async () => {
    mockedPatch.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateUserPhoneAction({ phone: VALID_PHONE });

    expect(result.success).toBe(false);
    expect(result.message).toContain("No se pudo guardar el teléfono");
  });
});
