import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserPhoneAction } from "./update-user-phone.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { patch: vi.fn() },
}));

vi.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: vi.fn(
    (v?: string) => !!v && v.startsWith("+") && v.length >= 10
  ),
}));

const mockedPatch = vi.mocked(axiosInstance.patch);

const VALID_PHONE = "+525512345678";

beforeEach(() => vi.clearAllMocks());

describe("updateUserPhoneAction", () => {
  it("phone vacío → success:false, no llama API", async () => {
    const result = await updateUserPhoneAction({ phone: "" });
    expect(result).toEqual({
      success: false,
      message: "Ingresa un teléfono válido.",
    });
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("phone inválido → success:false, no llama API", async () => {
    const result = await updateUserPhoneAction({ phone: "123" });
    expect(result.success).toBe(false);
    expect(mockedPatch).not.toHaveBeenCalled();
  });

  it("phone válido → PATCH /client/profile con { phone }", async () => {
    mockedPatch.mockResolvedValueOnce({ data: {} } as never);
    const result = await updateUserPhoneAction({ phone: VALID_PHONE });
    expect(mockedPatch).toHaveBeenCalledWith("/client/profile", {
      phone: VALID_PHONE,
    });
    expect(result).toEqual({ success: true });
  });

  it("backend responde con error.response.data.error → mensaje propagado", async () => {
    mockedPatch.mockRejectedValueOnce({
      response: { data: { error: "Teléfono ya registrado" } },
    });
    const result = await updateUserPhoneAction({ phone: VALID_PHONE });
    expect(result).toEqual({
      success: false,
      message: "Teléfono ya registrado",
    });
  });

  it("backend responde con error.response.data.detail → mensaje propagado", async () => {
    mockedPatch.mockRejectedValueOnce({
      response: { data: { detail: "Auth required" } },
    });
    const result = await updateUserPhoneAction({ phone: VALID_PHONE });
    expect(result).toEqual({
      success: false,
      message: "Auth required",
    });
  });

  it("error de red sin response → mensaje genérico", async () => {
    mockedPatch.mockRejectedValueOnce(new Error("Network Error"));
    const result = await updateUserPhoneAction({ phone: VALID_PHONE });
    expect(result).toEqual({
      success: false,
      message: "No se pudo guardar el teléfono. Intenta de nuevo.",
    });
  });
});
