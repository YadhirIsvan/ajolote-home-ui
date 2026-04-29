import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useAuthModal } from "./use-auth-modal.auth.hook";
import { sendEmailOtpAction } from "@/auth/actions/send-email-otp.actions";
import { verifyOtpAction } from "@/auth/actions/verify-otp.actions";
import { loginWithAppleAction } from "@/auth/actions/login-with-apple.actions";
import { updateAuthProfileAction } from "@/auth/actions/update-auth-phone.actions";

vi.mock("@/auth/actions/send-email-otp.actions");
vi.mock("@/auth/actions/verify-otp.actions");
vi.mock("@/auth/actions/login-with-google.actions");
vi.mock("@/auth/actions/login-with-apple.actions");
vi.mock("@/auth/actions/update-auth-phone.actions");
vi.mock("react-phone-number-input", () => ({
  isValidPhoneNumber: vi.fn((v?: string) => !!v && v.startsWith("+") && v.length >= 10),
}));

const mockedSendOtp = vi.mocked(sendEmailOtpAction);
const mockedVerifyOtp = vi.mocked(verifyOtpAction);
const mockedApple = vi.mocked(loginWithAppleAction);
const mockedUpdateProfile = vi.mocked(updateAuthProfileAction);

const VALID_PHONE_E164 = "+525512345678";

const MEMBERSHIP = {
  id: 1,
  tenant_id: 99,
  tenant_name: "Test Corp",
  tenant_slug: "test-corp",
  role: "client" as const,
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderModal(onLoginSuccess = vi.fn(), onClose = vi.fn()) {
  return renderHook(() => useAuthModal({ onLoginSuccess, onClose }), {
    wrapper: makeWrapper(),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useAuthModal — estado inicial", () => {
  it("step: 'options', email: '', error: ''", () => {
    const { result } = renderModal();
    expect(result.current.step).toBe("options");
    expect(result.current.email).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.authMethod).toBe("otp");
    expect(result.current.profileVariant).toBe("full");
    expect(result.current.isPhoneValid).toBe(false);
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

  it("verify exitoso con user.phone lleno → step 'success' y onLoginSuccess", async () => {
    vi.useFakeTimers();
    mockedVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: {
        refresh_expires_at: 0,
        user: {
          id: 1,
          email: "u@x.com",
          first_name: "",
          last_name: "",
          phone: "+525512345678",
          memberships: [],
        },
      },
    });
    const onLoginSuccess = vi.fn();
    const { result } = renderModal(onLoginSuccess);

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleTokenVerify());

    expect(result.current.step).toBe("success");
    vi.runAllTimers();
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("verify exitoso con memberships guarda selected_tenant_id en localStorage", async () => {
    vi.useFakeTimers();
    mockedVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: {
        refresh_expires_at: 0,
        user: {
          id: 1,
          email: "u@x.com",
          first_name: "",
          last_name: "",
          phone: "+525512345678",
          memberships: [MEMBERSHIP],
        },
      },
    });
    const { result } = renderModal();

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleTokenVerify());

    expect(localStorage.getItem("selected_tenant_id")).toBe("99");
    vi.useRealTimers();
  });

  it("verify exitoso sin memberships NO escribe selected_tenant_id", async () => {
    vi.useFakeTimers();
    mockedVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: {
        refresh_expires_at: 0,
        user: {
          id: 1,
          email: "u@x.com",
          first_name: "",
          last_name: "",
          phone: "+525512345678",
          memberships: [],
        },
      },
    });
    const { result } = renderModal();

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleTokenVerify());

    expect(localStorage.getItem("selected_tenant_id")).toBeNull();
    vi.useRealTimers();
  });

  it("verify exitoso sin phone → step 'profile' variante full, authMethod otp", async () => {
    mockedVerifyOtp.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: {
        refresh_expires_at: 0,
        user: {
          id: 1,
          email: "u@x.com",
          first_name: "",
          last_name: "",
          phone: null,
          memberships: [],
        },
      },
    });
    const onLoginSuccess = vi.fn();
    const { result } = renderModal(onLoginSuccess);

    act(() => result.current.setToken("1234"));
    await act(() => result.current.handleTokenVerify());

    expect(result.current.step).toBe("profile");
    expect(result.current.authMethod).toBe("otp");
    expect(result.current.profileVariant).toBe("full");
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });

  it("verify fallido popula error con mensaje de la acción", async () => {
    mockedVerifyOtp.mockResolvedValueOnce({ success: false, message: "Código expirado" });
    const { result } = renderModal();
    act(() => result.current.setToken("9999"));
    await act(() => result.current.handleTokenVerify());
    expect(result.current.error).toBe("Código expirado");
  });
});

// ─── handleProfileSubmit (teléfono obligatorio) ─────────────────────────────

describe("useAuthModal — handleProfileSubmit", () => {
  it("phone vacío popula error y NO llama APIs", async () => {
    const { result } = renderModal();
    await act(() => result.current.handleProfileSubmit());
    expect(result.current.error).toBe("Ingresa un teléfono válido para continuar.");
    expect(mockedUpdateProfile).not.toHaveBeenCalled();
    expect(mockedVerifyOtp).not.toHaveBeenCalled();
  });

  it("phone inválido popula error y NO llama APIs", async () => {
    const { result } = renderModal();
    act(() => result.current.setPhone("123"));
    await act(() => result.current.handleProfileSubmit());
    expect(result.current.error).toBe("Ingresa un teléfono válido para continuar.");
    expect(mockedUpdateProfile).not.toHaveBeenCalled();
  });

  it("phone válido llama updateAuthProfileAction con phone + campos opcionales trimmeados", async () => {
    vi.useFakeTimers();
    mockedUpdateProfile.mockResolvedValueOnce({ success: true });
    const onLoginSuccess = vi.fn();
    const { result } = renderModal(onLoginSuccess);

    act(() => {
      result.current.setEmail("u@x.com");
      result.current.setToken("1234");
      result.current.setPhone(VALID_PHONE_E164);
      result.current.setFirstName("Juan");
    });

    await act(() => result.current.handleProfileSubmit());

    expect(mockedUpdateProfile).toHaveBeenCalledWith({
      phone: VALID_PHONE_E164,
      first_name: "Juan",
    });
    expect(result.current.step).toBe("success");
    vi.runAllTimers();
    expect(onLoginSuccess).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("phone válido pero updateAuthProfileAction falla → error, step queda en profile", async () => {
    mockedUpdateProfile.mockResolvedValueOnce({
      success: false,
      message: "Phone inválido en backend",
    });
    const { result } = renderModal();

    act(() => {
      result.current.setPhone(VALID_PHONE_E164);
    });

    await act(() => result.current.handleProfileSubmit());

    expect(result.current.error).toBe("Phone inválido en backend");
  });

  it("isPhoneValid es false con phone vacío, true con phone E.164 válido", () => {
    const { result } = renderModal();
    expect(result.current.isPhoneValid).toBe(false);
    act(() => result.current.setPhone(VALID_PHONE_E164));
    expect(result.current.isPhoneValid).toBe(true);
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
    act(() => result.current.handleOpenChange(false));

    expect(result.current.step).toBe("options");
    expect(result.current.email).toBe("");
    expect(result.current.token).toBe("");
    expect(result.current.error).toBe("");
    expect(result.current.authMethod).toBe("otp");
    expect(result.current.profileVariant).toBe("full");
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

  it("Apple login exitoso con memberships guarda selected_tenant_id", async () => {
    mockedApple.mockResolvedValueOnce({ success: true, user: { id: 1, email: "a@b.com", first_name: "", last_name: "", phone: null, memberships: [MEMBERSHIP] } });
    const { result } = renderModal();

    await act(() => result.current.handleAppleLogin());

    expect(localStorage.getItem("selected_tenant_id")).toBe("99");
  });

  it("Apple login fallido popula error", async () => {
    mockedApple.mockResolvedValueOnce({ success: false, message: "Apple Login no está disponible actualmente" });
    const { result } = renderModal();

    await act(() => result.current.handleAppleLogin());

    expect(result.current.error).toBe("Apple Login no está disponible actualmente");
  });
});
