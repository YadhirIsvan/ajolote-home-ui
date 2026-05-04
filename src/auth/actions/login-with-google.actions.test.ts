import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginWithGoogleAction } from "./login-with-google.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse, AuthMembership } from "@/auth/types/auth.types";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { loginWithGoogle: vi.fn() },
}));

const mockedLoginWithGoogle = vi.mocked(authApi.loginWithGoogle);

const BASE_USER = {
  id: 1,
  email: "google@example.com",
  first_name: "Carlos",
  last_name: "García",
  phone: null,
  memberships: [] as AuthMembership[],
};

const MEMBERSHIP = {
  id: 5,
  tenant_id: 42,
  tenant_name: "Agencia XYZ",
  tenant_slug: "agencia-xyz",
  role: "agent" as const,
};

function makeAuthResponse(
  overrides: Partial<typeof BASE_USER> = {}
): AuthResponse {
  return {
    refresh_expires_at: 1700000000000,
    user: { ...BASE_USER, ...overrides },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("loginWithGoogleAction", () => {
  it("login exitoso retorna { success: true, user } con los datos del usuario", async () => {
    const authResponse = makeAuthResponse();
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    const result = await loginWithGoogleAction("gtoken-abc");

    expect(result.success).toBe(true);
    expect(result.user).toEqual(authResponse.user);
  });

  it("NO escribe selected_tenant_id en localStorage — responsabilidad del hook", async () => {
    const authResponse = makeAuthResponse({ memberships: [MEMBERSHIP] });
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
  });

  it("NO escribe tokens en localStorage — los maneja el backend como httpOnly cookies", async () => {
    const authResponse = makeAuthResponse();
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("error de API retorna { success: false, message } y no escribe localStorage", async () => {
    mockedLoginWithGoogle.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await loginWithGoogleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error al iniciar sesión con Google");
    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
  });

  it("error con response.data.error usa ese mensaje del servidor", async () => {
    mockedLoginWithGoogle.mockRejectedValueOnce({
      response: { data: { error: "Token de acceso inválido" } },
    });

    const result = await loginWithGoogleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Token de acceso inválido");
  });
});
