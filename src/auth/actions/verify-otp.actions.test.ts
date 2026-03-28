import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyOtpAction } from "./verify-otp.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

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

function makeTokens(overrides: Partial<typeof BASE_USER> = {}): AuthTokens {
  return {
    access: "access-token-abc",
    refresh: "refresh-token-xyz",
    user: { ...BASE_USER, ...overrides },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("verifyOtpAction", () => {
  it("respuesta exitosa guarda tokens en localStorage y retorna { success: true, data }", async () => {
    const tokens = makeTokens();
    mockedVerifyOtp.mockResolvedValueOnce({ data: tokens } as never);

    const result = await verifyOtpAction("user@example.com", "1234");

    expect(result.success).toBe(true);
    expect(result.data).toEqual(tokens);
    expect(localStorage.getItem("access_token")).toBe("access-token-abc");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-token-xyz");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(tokens.user));
  });

  it("usuario con memberships guarda selected_tenant_id del primero", async () => {
    const tokens = makeTokens({ memberships: [MEMBERSHIP] });
    mockedVerifyOtp.mockResolvedValueOnce({ data: tokens } as never);

    await verifyOtpAction("user@example.com", "1234");

    expect(localStorage.getItem("selected_tenant_id")).toBe("99");
  });

  it("usuario sin memberships NO guarda selected_tenant_id", async () => {
    const tokens = makeTokens({ memberships: [] });
    mockedVerifyOtp.mockResolvedValueOnce({ data: tokens } as never);

    await verifyOtpAction("user@example.com", "1234");

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
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
