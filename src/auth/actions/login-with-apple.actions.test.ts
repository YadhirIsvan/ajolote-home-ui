import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginWithAppleAction } from "./login-with-apple.actions";
import { authApi } from "@/auth/api/auth.api";
import type { AuthResponse } from "@/auth/types/auth.types";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { loginWithApple: vi.fn() },
}));

const mockedLoginWithApple = vi.mocked(authApi.loginWithApple);

const AUTH_RESPONSE: AuthResponse = {
  refresh_expires_at: 1700000000000,
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
  it("login exitoso retorna { success: true, user } — tokens en cookies httpOnly, no en localStorage", async () => {
    mockedLoginWithApple.mockResolvedValueOnce({ data: AUTH_RESPONSE } as never);

    const result = await loginWithAppleAction("apple-identity-token");

    expect(result.success).toBe(true);
    expect(result.user).toEqual(AUTH_RESPONSE.user);

    // Tokens NO se guardan en localStorage — los maneja el backend como httpOnly cookies
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("error de API retorna { success: false, message } y no escribe localStorage", async () => {
    mockedLoginWithApple.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await loginWithAppleAction("bad-token");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Apple Login no está disponible actualmente");
    expect(localStorage.getItem("access_token")).toBeNull();
  });
});
