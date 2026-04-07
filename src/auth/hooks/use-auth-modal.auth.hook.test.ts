import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthModal } from "./use-auth-modal.auth.hook";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";
import { loginWithAppleAction } from "@/auth/actions/login-with-apple.actions";

vi.mock("@/auth/actions/send-email-otp.actions");
vi.mock("@/auth/actions/verify-otp.actions");
vi.mock("@/auth/actions/login-with-google.actions");
vi.mock("@/auth/actions/login-with-apple.actions");

const mockedSendOtp = vi.mocked(sendEmailOtpAction);
const mockedVerifyOtp = vi.mocked(verifyOtpAction);
const mockedApple = vi.mocked(loginWithAppleAction);

function renderModal(onLoginSuccess = vi.fn(), onClose = vi.fn()) {
  return renderHook(() => useAuthModal({ onLoginSuccess, onClose }));
}

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useAuthModal — estado inicial", () => {
  it("step: 'options', email: '', error: ''", () => {
    const { result } = renderModal();
    expect(result.current.step).toBe("options");
    expect(result.current.email).toBe("");
    expect(result.current.error).toBe("");
  });

  it("goToEmailStep cambia step a 'email'", () => {
    const { result } = renderModal();
    act(() => result.current.goToEmailStep());
    expect(result.current.step).toBe("email");
  });
});

// ─── handleEmailSubmit ────────────────────────────────────────────────────────

describe("useAuthModal — handleEmailSubmit", () => {
  it("email inválido popula error y step no cambia", async () => {
    const { result } = renderModal();
    act(() => result.current.setEmail("no-es-email"));
    await act(() => result.current.handleEmailSubmit());
    expect(result.current.error).toBeTruthy();
    expect(result.current.step).toBe("options");
  });

  it("email vacío popula error", async () => {
    const { result } = renderModal();
    await act(() => result.current.handleEmailSubmit());
    expect(result.current.error).toBeTruthy();
  });

  it("submit exitoso cambia step a 'verify'", async () => {
    mockedSendOtp.mockResolvedValueOnce({ success: true, message: "ok" });
    const { result } = renderModal();
    act(() => result.current.setEmail("user@example.com"));
    await act(() => result.current.handleEmailSubmit());
    expect(result.current.step).toBe("verify");
  });

  it("submit fallido popula error con el mensaje de la acción", async () => {
    mockedSendOtp.mockResolvedValueOnce({ success: false, message: "Demasiados intentos" });
    const { result } = renderModal();
    act(() => result.current.setEmail("user@example.com"));
    await act(() => result.current.handleEmailSubmit());
    expect(result.current.error).toBe("Demasiados intentos");
    expect(result.current.step).toBe("options");
  });
});

// ─── handleTokenVerify ────────────────────────────────────────────────────────

describe("useAuthModal — handleTokenVerify", () => {
  it("token con menos de 4 chars popula error", async () => {
    const { result } = renderModal();
    act(() => result.current.setToken("12"));
    await act(() => result.current.handleTokenVerify());
    expect(result.current.error).toBeTruthy();
  });

  it("verify exitoso cambia step a 'success' y llama onLoginSuccess", async () => {
    vi.useFakeTimers();
    mockedVerifyOtp.mockResolvedValueOnce({ success: true, message: "ok" });
    const onLoginSuccess = vi.fn();
    const { result } = renderModal(onLoginSuccess);

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleTokenVerify());

    expect(result.current.step).toBe("success");
    vi.runAllTimers();
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("verify fallido popula error con mensaje de la acción", async () => {
    mockedVerifyOtp.mockResolvedValueOnce({ success: false, message: "Código expirado" });
    const { result } = renderModal();
    act(() => result.current.setToken("9999"));
    await act(() => result.current.handleTokenVerify());
    expect(result.current.error).toBe("Código expirado");
  });
});

// ─── handleBack ──────────────────────────────────────────────────────────────

describe("useAuthModal — handleBack", () => {
  it("desde 'email' vuelve a 'options'", () => {
    const { result } = renderModal();
    act(() => result.current.goToEmailStep());
    act(() => result.current.handleBack());
    expect(result.current.step).toBe("options");
  });

  it("desde 'verify' vuelve a 'email' y limpia token", async () => {
    mockedSendOtp.mockResolvedValueOnce({ success: true, message: "ok" });
    const { result } = renderModal();
    act(() => result.current.setEmail("u@x.com"));
    await act(() => result.current.handleEmailSubmit());
    act(() => result.current.setToken("1234"));
    act(() => result.current.handleBack());

    expect(result.current.step).toBe("email");
    expect(result.current.token).toBe("");
  });
});

// ─── handleOpenChange ─────────────────────────────────────────────────────────

describe("useAuthModal — handleOpenChange", () => {
  it("handleOpenChange(false) resetea todo el estado y llama onClose", async () => {
    mockedSendOtp.mockResolvedValueOnce({ success: true, message: "ok" });
    const onClose = vi.fn();
    const { result } = renderModal(vi.fn(), onClose);

    act(() => result.current.setEmail("u@x.com"));
    await act(() => result.current.handleEmailSubmit());
    // En step 'verify', con email seteado
    act(() => result.current.handleOpenChange(false));

    expect(result.current.step).toBe("options");
    expect(result.current.email).toBe("");
    expect(result.current.token).toBe("");
    expect(result.current.error).toBe("");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─── handleAppleLogin ─────────────────────────────────────────────────────────

describe("useAuthModal — handleAppleLogin", () => {
  it("Apple login exitoso llama onLoginSuccess", async () => {
    mockedApple.mockResolvedValueOnce({ success: true });
    const onLoginSuccess = vi.fn();
    const { result } = renderModal(onLoginSuccess);

    await act(() => result.current.handleAppleLogin());

    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
  });

  it("Apple login fallido popula error", async () => {
    mockedApple.mockResolvedValueOnce({ success: false, message: "Apple Login no está disponible actualmente" });
    const { result } = renderModal();

    await act(() => result.current.handleAppleLogin());

    expect(result.current.error).toBe("Apple Login no está disponible actualmente");
  });
});
