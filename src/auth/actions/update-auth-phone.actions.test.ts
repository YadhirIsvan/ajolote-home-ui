import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateAuthPhoneAction } from "./update-auth-phone.actions";
import { authApi } from "@/auth/api/auth.api";
import { isValidPhoneNumber } from "react-phone-number-input";

vi.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: vi.fn(),
}));
vi.mock("@/auth/api/auth.api", () => ({
  authApi: { updateAuthPhone: vi.fn() },
}));

const mockedIsValid = vi.mocked(isValidPhoneNumber);
const mockedUpdatePhone = vi.mocked(authApi.updateAuthPhone);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateAuthPhoneAction", () => {
  it("phone undefined retorna success:false sin llamar API", async () => {
    const result = await updateAuthPhoneAction(undefined);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Ingresa un teléfono válido.");
    expect(mockedUpdatePhone).not.toHaveBeenCalled();
  });

  it("phone inválido retorna success:false sin llamar API", async () => {
    mockedIsValid.mockReturnValueOnce(false);

    const result = await updateAuthPhoneAction("+52abc");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Ingresa un teléfono válido.");
    expect(mockedUpdatePhone).not.toHaveBeenCalled();
  });

  it("phone E.164 válido llama authApi.updateAuthPhone y retorna success:true", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdatePhone.mockResolvedValueOnce({ data: {} } as never);

    const result = await updateAuthPhoneAction("+525512345678");

    expect(result.success).toBe(true);
    expect(mockedUpdatePhone).toHaveBeenCalledWith("+525512345678");
  });

  it("error 400 del backend propaga el mensaje del response", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdatePhone.mockRejectedValueOnce({
      response: { data: { error: "Teléfono ya registrado" } },
    });

    const result = await updateAuthPhoneAction("+525512345678");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Teléfono ya registrado");
  });

  it("error de red retorna mensaje default", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdatePhone.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateAuthPhoneAction("+525512345678");

    expect(result.success).toBe(false);
    expect(result.message).toBe("No se pudo guardar el teléfono. Intenta de nuevo.");
  });
});
