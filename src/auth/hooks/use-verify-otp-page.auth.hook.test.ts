import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useVerifyOtpPage } from "./use-verify-otp-page.auth.hook";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";

vi.mock("@/auth/actions/verify-otp.actions");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { email: "test@example.com" } }),
}));

const mockedAction = vi.mocked(verifyOtpAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderPage() {
  return renderHook(() => useVerifyOtpPage(), { wrapper: makeWrapper() });
}

const FORM_EVENT = { preventDefault: vi.fn() } as unknown as React.FormEvent;

beforeEach(() => {
  vi.clearAllMocks();
  mockNavigate.mockReset();
});

// ─── Estado inicial ─────────────────────────────────────────────��─────────────

describe("useVerifyOtpPage — estado inicial", () => {
  it("lee email de location.state, token vacío, sin error, sin success", () => {
    const { result } = renderPage();
    expect(result.current.email).toBe("test@example.com");
    expect(result.current.token).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.success).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});

// ─── handleBack ───────────────────────────��───────────────────────────────────

describe("useVerifyOtpPage — handleBack", () => {
  it("llama navigate(-1)", () => {
    const { result } = renderPage();
    act(() => result.current.handleBack());
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

// ─── handleSubmit — validaciones ──────���───────────────────────��───────────────

describe("useVerifyOtpPage — handleSubmit validaciones", () => {
  it("token vacío popula error y NO llama la acción", async () => {
    const { result } = renderPage();
    await act(() => result.current.handleSubmit(FORM_EVENT));
    expect(result.current.error).toBe("El código debe tener al menos 4 dígitos.");
    expect(mockedAction).not.toHaveBeenCalled();
  });

  it("token con 3 chars popula error y NO llama la acción", async () => {
    const { result } = renderPage();
    act(() => result.current.setToken("123"));
    await act(() => result.current.handleSubmit(FORM_EVENT));
    expect(result.current.error).toBe("El código debe tener al menos 4 dígitos.");
    expect(mockedAction).not.toHaveBeenCalled();
  });

  it("token con 4+ chars llama verifyOtpAction con email de location.state", async () => {
    mockedAction.mockResolvedValueOnce({ success: true, message: "ok" });
    vi.useFakeTimers();
    const { result } = renderPage();
    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleSubmit(FORM_EVENT));
    expect(mockedAction).toHaveBeenCalledWith("test@example.com", "1234", undefined);
    vi.useRealTimers();
  });
});

// ─── handleSubmit — flujos de API ────────────────────────────────────────────

describe("useVerifyOtpPage — handleSubmit flujos de API", () => {
  it("verify exitoso → success: true y navega a /mi-cuenta después de 1 segundo", async () => {
    vi.useFakeTimers();
    mockedAction.mockResolvedValueOnce({ success: true, message: "ok" });
    const { result } = renderPage();

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleSubmit(FORM_EVENT));

    expect(result.current.success).toBe(true);
    expect(mockNavigate).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(mockNavigate).toHaveBeenCalledWith("/mi-cuenta");
    vi.useRealTimers();
  });

  it("verify fallido popula error con mensaje de la acción y success queda false", async () => {
    mockedAction.mockResolvedValueOnce({ success: false, message: "Código expirado" });
    const { result } = renderPage();

    act(() => result.current.setToken("0000"));
    await act(() => result.current.handleSubmit(FORM_EVENT));

    expect(result.current.error).toBe("Código expirado");
    expect(result.current.success).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

// ─── setToken ─────────────���──────────────────────────────────────────────────

describe("useVerifyOtpPage — setToken", () => {
  it("actualiza el estado del token", () => {
    const { result } = renderPage();
    act(() => result.current.setToken("9876"));
    expect(result.current.token).toBe("9876");
  });
});
