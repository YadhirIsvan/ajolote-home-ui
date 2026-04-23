import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateClientProfileAction } from "./update-client-profile.actions";
import { clientApi } from "@/myAccount/client/api/client.api";
import { isValidPhoneNumber } from "react-phone-number-input";

vi.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: vi.fn(),
}));
vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { updateProfile: vi.fn() },
}));

const mockedIsValid = vi.mocked(isValidPhoneNumber);
const mockedUpdate = vi.mocked(clientApi.updateProfile);

beforeEach(() => vi.clearAllMocks());

describe("updateClientProfileAction", () => {
  it("phone vacío retorna success:false sin llamar API", async () => {
    const result = await updateClientProfileAction({ phone: "" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ingresa un teléfono válido.");
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it("phone inválido retorna success:false sin llamar API", async () => {
    mockedIsValid.mockReturnValueOnce(false);
    const result = await updateClientProfileAction({ phone: "+52abc" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Ingresa un teléfono válido.");
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it("phone E.164 válido + opcionales presentes arma payload completo", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdate.mockResolvedValueOnce({ data: {} } as never);

    const result = await updateClientProfileAction({
      phone: "+525512345678",
      first_name: "Ana",
      last_name: "García",
      city: "CDMX",
    });

    expect(result.success).toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith({
      phone: "+525512345678",
      first_name: "Ana",
      last_name: "García",
      city: "CDMX",
    });
  });

  it("opcionales omitidos no se envían en el payload", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdate.mockResolvedValueOnce({ data: {} } as never);

    await updateClientProfileAction({ phone: "+525512345678" });

    expect(mockedUpdate).toHaveBeenCalledWith({ phone: "+525512345678" });
  });

  it("error 400 del backend propaga mensaje de response.data.detail", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdate.mockRejectedValueOnce({
      response: { data: { detail: "Teléfono ya registrado" } },
    });

    const result = await updateClientProfileAction({ phone: "+525512345678" });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Teléfono ya registrado");
  });

  it("error sin response retorna mensaje default", async () => {
    mockedIsValid.mockReturnValueOnce(true);
    mockedUpdate.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateClientProfileAction({ phone: "+525512345678" });
    expect(result.success).toBe(false);
    expect(result.message).toBe(
      "No se pudo guardar el perfil. Intenta de nuevo."
    );
  });
});
