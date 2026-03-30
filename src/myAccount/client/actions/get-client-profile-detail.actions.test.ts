import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClientProfileDetailAction,
  updateClientProfileFieldAction,
} from "./get-client-profile-detail.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: {
    getClientProfile: vi.fn(),
    updateClientProfile: vi.fn(),
  },
}));

const mockedGetClientProfile = vi.mocked(clientApi.getClientProfile);
const mockedUpdateClientProfile = vi.mocked(clientApi.updateClientProfile);

const BACKEND_PROFILE = {
  occupation: "Ingeniero",
  residence_location: "Orizaba",
  desired_credit_type: "hipotecario",
  desired_property_type: "casa",
};

beforeEach(() => vi.clearAllMocks());

// ─── getClientProfileDetailAction ────────────────────────────────────────────

describe("getClientProfileDetailAction", () => {
  it("éxito → mapea los 4 campos correctamente", async () => {
    mockedGetClientProfile.mockResolvedValueOnce({
      data: BACKEND_PROFILE,
    } as never);

    const result = await getClientProfileDetailAction();

    expect(result).toEqual({
      occupation: "Ingeniero",
      residence_location: "Orizaba",
      desired_credit_type: "hipotecario",
      desired_property_type: "casa",
    });
  });

  it("campos ausentes → default a ''", async () => {
    mockedGetClientProfile.mockResolvedValueOnce({ data: {} } as never);

    const result = await getClientProfileDetailAction();

    expect(result).toEqual({
      occupation: "",
      residence_location: "",
      desired_credit_type: "",
      desired_property_type: "",
    });
  });

  it("error instanceof Error → rethrows con mensaje original", async () => {
    mockedGetClientProfile.mockRejectedValueOnce(new Error("Not found"));

    await expect(getClientProfileDetailAction()).rejects.toThrow("Not found");
  });

  it("error no-Error → mensaje genérico", async () => {
    mockedGetClientProfile.mockRejectedValueOnce({ code: 404 });

    await expect(getClientProfileDetailAction()).rejects.toThrow(
      "Error al obtener el perfil del cliente"
    );
  });
});

// ─── updateClientProfileFieldAction ──────────────────────────────────────────

describe("updateClientProfileFieldAction", () => {
  it("envía { [field]: value } al API y retorna el resultado mapeado", async () => {
    const updated = { ...BACKEND_PROFILE, occupation: "Arquitecto" };
    mockedUpdateClientProfile.mockResolvedValueOnce({ data: updated } as never);

    const result = await updateClientProfileFieldAction(
      "occupation",
      "Arquitecto"
    );

    expect(mockedUpdateClientProfile).toHaveBeenCalledWith({
      occupation: "Arquitecto",
    });
    expect(result.occupation).toBe("Arquitecto");
  });

  it("error → lanza con mensaje", async () => {
    mockedUpdateClientProfile.mockRejectedValueOnce(new Error("Validation error"));

    await expect(
      updateClientProfileFieldAction("occupation", "x")
    ).rejects.toThrow("Validation error");
  });
});
