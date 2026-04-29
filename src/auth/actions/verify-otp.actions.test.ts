import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyOtpAction } from "./verify-otp.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse } from "@/auth/types/auth.types";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { verifyOtp: vi.fn() },
}));

const mockedVerifyOtp = vi.mocked(authApi.verifyOtp);

const BASE_USER = {
  id: 1,
  email: "user@example.com",
  first_name: "Ana",
  last_name: "López",
  phone: null,
  memberships: [],
};

const MEMBERSHIP = {
  id: 10,
  tenant_id: 99,
  tenant_name: "Inmobiliaria Test",
  tenant_slug: "inmo-test",
  role: "client" as const,
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

describe("verifyOtpAction", () => {
  it("respuesta exitosa retorna { success: true, data } con los datos del usuario", async () => {
    const authResponse = makeAuthResponse();
    mockedVerifyOtp.mockResolvedValueOnce({ data: authResponse } as never);

    const result = await verifyOtpAction("user@example.com", "1234");

    expect(result.success).toBe(true);
    expect(result.data).toEqual(authResponse);
  });

  it("NO escribe selected_tenant_id en localStorage — responsabilidad del hook", async () => {
    const authResponse = makeAuthResponse({ memberships: [MEMBERSHIP] });
    mockedVerifyOtp.mockResolvedValueOnce({ data: authResponse } as never);

    await verifyOtpAction("user@example.com", "1234");

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
  });

  it("NO escribe tokens en localStorage — los maneja el backend como httpOnly cookies", async () => {
    const authResponse = makeAuthResponse();
    mockedVerifyOtp.mockResolvedValueOnce({ data: authResponse } as never);

    await verifyOtpAction("user@example.com", "1234");

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("error con response.data.error retorna ese mensaje y success: false", async () => {
    mockedVerifyOtp.mockRejectedValueOnce({
      response: { data: { error: "Código expirado" } },
    });

    const result = await verifyOtpAction("user@example.com", "0000");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Código expirado");
  });

  it("error con response.data.detail retorna ese mensaje", async () => {
    mockedVerifyOtp.mockRejectedValueOnce({
      response: { data: { detail: "Token inválido" } },
    });

    const result = await verifyOtpAction("user@example.com", "0000");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Token inválido");
  });

  it("error sin response data retorna mensaje por defecto", async () => {
    mockedVerifyOtp.mockRejectedValueOnce({ response: { data: {} } });

    const result = await verifyOtpAction("user@example.com", "0000");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Código inválido o expirado. Intenta de nuevo.");
  });
});
