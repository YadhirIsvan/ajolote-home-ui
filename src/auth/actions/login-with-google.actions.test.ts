import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginWithGoogleAction } from "./login-with-google.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse } from "@/auth/types/auth.types";

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
  memberships: [],
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
  it("login exitoso retorna { success: true, user } — tokens en cookies httpOnly, no en localStorage", async () => {
    const authResponse = makeAuthResponse();
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    const result = await loginWithGoogleAction("gtoken-abc");

    expect(result.success).toBe(true);
    expect(result.user).toEqual(authResponse.user);

    // Tokens NO se guardan en localStorage — los maneja el backend como httpOnly cookies
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("usuario con memberships guarda selected_tenant_id del primero", async () => {
    const authResponse = makeAuthResponse({ memberships: [MEMBERSHIP] });
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("selected_tenant_id")).toBe("42");
  });

  it("usuario sin memberships NO guarda selected_tenant_id", async () => {
    const authResponse = makeAuthResponse({ memberships: [] });
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: authResponse } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
  });

  it("error de API retorna { success: false, message } y no escribe localStorage", async () => {
    mockedLoginWithGoogle.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await loginWithGoogleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error al iniciar sesión con Google");
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
