import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerAction } from "./register.actions";
import { authApi } from "@/auth/api/auth.api";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { register: vi.fn() },
}));

const mockedRegister = vi.mocked(authApi.register);

const VALID_REQUEST = {
  email: "test@example.com",
  first_name: "Juan",
  last_name: "Pérez",
};

beforeEach(() => vi.clearAllMocks());

describe("registerAction", () => {
  it("respuesta exitosa retorna { success: true, message, email }", async () => {
    mockedRegister.mockResolvedValueOnce({
      data: { message: "Cuenta creada.", email: "test@example.com" },
    } as never);

    const result = await registerAction(VALID_REQUEST);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Cuenta creada.");
    expect(result.email).toBe("test@example.com");
  });

  it("error 400 con 'ya existe' retorna { success: false, userExists: true }", async () => {
    mockedRegister.mockRejectedValueOnce({
      response: { status: 400, data: { error: "El usuario ya existe" } },
    });

    const result = await registerAction(VALID_REQUEST);

    expect(result.success).toBe(false);
    expect(result.userExists).toBe(true);
    expect(result.message).toContain("ya existe");
  });

  it("error 400 con 'already exists' retorna { success: false, userExists: true }", async () => {
    mockedRegister.mockRejectedValueOnce({
      response: { status: 400, data: { error: "User already exists" } },
    });

    const result = await registerAction(VALID_REQUEST);

    expect(result.success).toBe(false);
    expect(result.userExists).toBe(true);
  });

  it("error 400 genérico retorna { success: false } con mensaje del servidor", async () => {
    mockedRegister.mockRejectedValueOnce({
      response: { status: 400, data: { error: "El teléfono es inválido" } },
    });

    const result = await registerAction(VALID_REQUEST);

    expect(result.success).toBe(false);
    expect(result.userExists).toBeUndefined();
    expect(result.message).toBe("El teléfono es inválido");
  });

  it("error sin response (red/CORS) retorna { success: false } con mensaje genérico", async () => {
    mockedRegister.mockRejectedValueOnce({ message: "Network Error" });

    const result = await registerAction(VALID_REQUEST);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error al crear la cuenta. Intenta de nuevo.");
  });
});
