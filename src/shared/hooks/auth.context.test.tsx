import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { AuthProvider, useAuth } from "./auth.context";
import { logoutAction } from "@/shared/actions/logout.actions";
import { meAction } from "@/shared/actions/me.actions";

vi.mock("@/shared/actions/logout.actions");
vi.mock("@/shared/actions/me.actions");

const mockedLogout = vi.mocked(logoutAction);
const mockedMeAction = vi.mocked(meAction);

// ── Cookie helpers ────────────────────────────────────────────────────────────

function setSessionCookie() {
  document.cookie = "session_active=1; path=/";
}

function clearSessionCookie() {
  document.cookie = "session_active=; max-age=0; path=/";
}

// ── Test wrapper ──────────────────────────────────────────────────────────────

function makeWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(AuthProvider, null, children);
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: 1,
  email: "test@test.com",
  first_name: "Ana",
  last_name: "López",
  phone: null,
  memberships: [{ id: 1, tenant_id: 10, tenant_name: "Avakanta", tenant_slug: "avakanta", role: "client" as const }],
};

// ── Lifecycle ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  clearSessionCookie();
  mockedLogout.mockResolvedValue(undefined);
  mockedMeAction.mockResolvedValue(null); // default: no session
});

afterEach(() => {
  clearSessionCookie();
  Object.defineProperty(document, "hidden", {
    value: false,
    configurable: true,
    writable: true,
  });
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("AuthProvider — estado inicial", () => {
  it("isAuthenticated: false cuando NO existe la cookie session_active", () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("isAuthenticated: true de forma síncrona cuando existe session_active cookie", () => {
    setSessionCookie();
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    // Synchronous — read from document.cookie in useState initializer
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("user: null en render inicial antes de que meAction resuelva", () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(result.current.user).toBeNull();
  });

  it("user se popula de forma asíncrona via meAction tras el mount", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.user).not.toBeNull());
    expect(result.current.user).toEqual(MOCK_USER);
  });

  it("role derivado de user.memberships[0].role tras el mount", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.role).toBe("client"));
  });

  it("meAction NO se llama cuando no existe session_active cookie", () => {
    renderHook(() => useAuth(), { wrapper: makeWrapper() });
    expect(mockedMeAction).not.toHaveBeenCalled();
  });

  it("meAction se llama exactamente una vez si la cookie está presente", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });
    renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(mockedMeAction).toHaveBeenCalledTimes(1));
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
  it("llama meAction, actualiza user e isAuthenticated, cierra modal", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    act(() => result.current.openAuthModal());

    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });

    await act(async () => { await result.current.syncAuthState(); });

    expect(mockedMeAction).toHaveBeenCalledTimes(1);
    expect(result.current.user).toEqual(MOCK_USER);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.showAuthModal).toBe(false);
  });

  it("cuando meAction retorna null, isAuthenticated queda false y user es null", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    mockedMeAction.mockResolvedValueOnce(null);

    await act(async () => { await result.current.syncAuthState(); });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});

// ─── handleLogout ─────────────────────────────────────────────────────────────

describe("AuthProvider — handleLogout", () => {
  it("llama logoutAction, limpia estado de auth y elimina selected_tenant_id", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });
    localStorage.setItem("selected_tenant_id", "10");

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    await act(() => result.current.handleLogout());

    expect(mockedLogout).toHaveBeenCalledTimes(1);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("selected_tenant_id")).toBeNull();

    // Los tokens en httpOnly cookies los borra el backend — el frontend no los toca
  });
});

// ─── handleLoginSuccess ───────────────────────────────────────────────────────

describe("AuthProvider — handleLoginSuccess", () => {
  it("llama window.location.reload — la recarga iniciará meAction via el efecto de mount", () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: reloadMock },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });

    act(() => result.current.handleLoginSuccess());

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
  it("tab se vuelve visible y session_active cookie fue eliminada → llama handleLogout", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Otra pestaña eliminó la cookie (logout cruzado)
    clearSessionCookie();

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

  it("tab se oculta (hidden: true) → no cierra sesión aunque falte la cookie", async () => {
    setSessionCookie();
    mockedMeAction.mockResolvedValueOnce({ user: MOCK_USER, refresh_expires_at: 9999 });

    const { result } = renderHook(() => useAuth(), { wrapper: makeWrapper() });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    clearSessionCookie();

    Object.defineProperty(document, "hidden", {
      value: true, // tab hidden → no logout trigger
      configurable: true,
      writable: true,
    });

    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(mockedLogout).not.toHaveBeenCalled();
  });
});
