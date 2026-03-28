import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginWithGoogleAction } from "./login-with-google.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

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

function makeTokens(overrides: Partial<typeof BASE_USER> = {}): AuthTokens {
  return {
    access: "google-access-token",
    refresh: "google-refresh-token",
    user: { ...BASE_USER, ...overrides },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("loginWithGoogleAction", () => {
  it("login exitoso guarda tokens en localStorage y retorna { success: true, user }", async () => {
    const tokens = makeTokens();
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: tokens } as never);

    const result = await loginWithGoogleAction("gtoken-abc");

    expect(result.success).toBe(true);
    expect(result.user).toEqual(tokens.user);
    expect(localStorage.getItem("access_token")).toBe("google-access-token");
    expect(localStorage.getItem("refresh_token")).toBe("google-refresh-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(tokens.user));
  });

  it("usuario con memberships guarda selected_tenant_id del primero", async () => {
    const tokens = makeTokens({ memberships: [MEMBERSHIP] });
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: tokens } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("selected_tenant_id")).toBe("42");
  });

  it("usuario sin memberships NO guarda selected_tenant_id", async () => {
    const tokens = makeTokens({ memberships: [] });
    mockedLoginWithGoogle.mockResolvedValueOnce({ data: tokens } as never);

    await loginWithGoogleAction("gtoken-abc");

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
  });

  it("error de API retorna { success: false, message }", async () => {
    mockedLoginWithGoogle.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await loginWithGoogleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error al iniciar sesión con Google");
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
