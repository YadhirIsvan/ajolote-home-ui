import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginWithAppleAction } from "./login-with-apple.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthTokens } from "@/auth/types/auth.types";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { loginWithApple: vi.fn() },
}));

const mockedLoginWithApple = vi.mocked(authApi.loginWithApple);

const TOKENS: AuthTokens = {
  access: "apple-access-token",
  refresh: "apple-refresh-token",
  user: {
    id: 2,
    email: "apple@example.com",
    first_name: "Laura",
    last_name: "Martínez",
    phone: null,
    memberships: [],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("loginWithAppleAction", () => {
  it("login exitoso guarda tokens en localStorage y retorna { success: true, user }", async () => {
    mockedLoginWithApple.mockResolvedValueOnce({ data: TOKENS } as never);

    const result = await loginWithAppleAction("apple-identity-token");

    expect(result.success).toBe(true);
    expect(result.user).toEqual(TOKENS.user);
    expect(localStorage.getItem("access_token")).toBe("apple-access-token");
    expect(localStorage.getItem("refresh_token")).toBe("apple-refresh-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(TOKENS.user));
  });

  it("error de API retorna { success: false, message } y no escribe localStorage", async () => {
    mockedLoginWithApple.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await loginWithAppleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Apple Login no está disponible actualmente");
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
