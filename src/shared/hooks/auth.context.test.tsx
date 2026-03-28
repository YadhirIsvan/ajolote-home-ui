import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { AuthProvider, useAuth } from "./auth.context";
import { logoutAction } from "@/shared/actions/logout.actions";

vi.mock("@/shared/actions/logout.actions");

const mockedLogout = vi.mocked(logoutAction);

function makeWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(AuthProvider, null, children);
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockedLogout.mockResolvedValue(undefined);
});

afterEach(() => {
  localStorage.clear();
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("AuthProvider — estado inicial", () => {
  it("isAuthenticated: false cuando no hay access_token", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("isAuthenticated: true cuando existe access_token en localStorage", () => {
    localStorage.setItem("access_token", "some-token");
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("user parseado desde localStorage si existe la clave 'user'", () => {
    const mockUser = { id: 1, email: "test@test.com", memberships: [] };
    localStorage.setItem("user", JSON.stringify(mockUser));
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.user).toEqual(mockUser);
  });

  it("user: null cuando no existe la clave 'user' en localStorage", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.user).toBeNull();
  });

  it("role derivado de user.memberships[0].role", () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      memberships: [{ role: "client" }],
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.role).toBe("client");
  });
});

// ─── openAuthModal / closeAuthModal ──────────────────────────────────────────

describe("AuthProvider — modal", () => {
  it("openAuthModal() → showAuthModal: true", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    act(() => result.current.openAuthModal());
    expect(result.current.showAuthModal).toBe(true);
  });

  it("closeAuthModal() después de abrir → showAuthModal: false", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    act(() => result.current.openAuthModal());
    act(() => result.current.closeAuthModal());
    expect(result.current.showAuthModal).toBe(false);
  });
});

// ─── syncAuthState ────────────────────────────────────────────────────────────

describe("AuthProvider — syncAuthState", () => {
  it("actualiza user desde localStorage, isAuthenticated: true y cierra modal", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });

    act(() => result.current.openAuthModal());

    const newUser = { id: 2, email: "new@test.com", memberships: [] };
    localStorage.setItem("user", JSON.stringify(newUser));

    act(() => result.current.syncAuthState());

    expect(result.current.user).toEqual(newUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.showAuthModal).toBe(false);
  });
});

// ─── handleLogout ─────────────────────────────────────────────────────────────

describe("AuthProvider — handleLogout", () => {
  it("llama logoutAction, limpia las 4 claves de localStorage, isAuthenticated: false", async () => {
    localStorage.setItem("access_token", "tok");
    localStorage.setItem("refresh_token", "ref");
    localStorage.setItem("user", '{"id":1}');
    localStorage.setItem("selected_tenant_id", "1");

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });

    await act(() => result.current.handleLogout());

    expect(mockedLogout).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

// ─── handleLoginSuccess ───────────────────────────────────────────────────────

describe("AuthProvider — handleLoginSuccess", () => {
  it("sincroniza user desde localStorage y llama window.location.reload", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadMock },
      writable: true,
      configurable: true,
    });

    const newUser = { id: 3, email: "login@test.com", memberships: [] };
    localStorage.setItem("user", JSON.stringify(newUser));

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });

    act(() => result.current.handleLoginSuccess());

    expect(result.current.user).toEqual(newUser);
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});

// ─── useAuth fuera de provider ────────────────────────────────────────────────

describe("useAuth", () => {
  it("lanza error cuando se usa fuera de AuthProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider"
    );

    consoleSpy.mockRestore();
  });
});

// ─── Visibilitychange listener ────────────────────────────────────────────────

describe("AuthProvider — visibilitychange", () => {
  it("tab se vuelve visible y access_token fue eliminado → llama handleLogout", async () => {
    localStorage.setItem("access_token", "tok");

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Simula que otra pestaña eliminó el token
    localStorage.removeItem("access_token");

    Object.defineProperty(document, "hidden", {
      value: false,
      configurable: true,
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
    expect(mockedLogout).toHaveBeenCalledTimes(1);
  });

  it("tab se oculta (hidden: true) → no cierra sesión aunque falte el token", () => {
    localStorage.setItem("access_token", "tok");
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });

    localStorage.removeItem("access_token");

    Object.defineProperty(document, "hidden", {
      value: true,
      configurable: true,
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
