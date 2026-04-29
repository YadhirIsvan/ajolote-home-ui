import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useRegisterPage } from "./use-register-page.auth.hook";
import { registerAction } from "@/auth/actions/register.actions";

vi.mock("@/auth/actions/register.actions");
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

const mockedAction = vi.mocked(registerAction);

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

function renderPage() {
  return renderHook(() => useRegisterPage(), { wrapper: makeWrapper() });
}

const VALID_FORM_EVENT = { preventDefault: vi.fn() } as unknown as React.FormEvent;

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial ───────────────────────────────────────────────────────────

describe("useRegisterPage — estado inicial", () => {
  it("form vacío, sin error, sin userExists", () => {
    const { result } = renderPage();
    expect(result.current.form).toEqual({ email: "", firstName: "", lastName: "", phone: "" });
    expect(result.current.error).toBe("");
    expect(result.current.userExists).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });
});

// ─── handleChange ─────────────────────────────────────────────────────────────

describe("useRegisterPage — handleChange", () => {
  it("actualiza el campo correcto del formulario", () => {
    const { result } = renderPage();
    act(() => {
      result.current.handleChange({
        target: { name: "email", value: "test@example.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.form.email).toBe("test@example.com");
  });

  it("limpia error y userExists al cambiar cualquier campo", () => {
    const { result } = renderPage();

    // Primero simula un estado con error
    act(() => {
      result.current.handleChange({ target: { name: "firstName", value: "" } } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleChange({
        target: { name: "firstName", value: "Juan" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe("");
    expect(result.current.userExists).toBe(false);
  });
});

// ─── handleSubmit — validaciones ──────────────────────────────────────────────

describe("useRegisterPage — handleSubmit validaciones", () => {
  it("sin firstName popula error y NO llama la acción", async () => {
    const { result } = renderPage();
    act(() => {
      result.current.handleChange({ target: { name: "email", value: "a@b.com" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: "lastName", value: "García" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(result.current.error).toBe("Nombre, apellido y correo son obligatorios.");
    expect(mockedAction).not.toHaveBeenCalled();
  });

  it("sin email popula error y NO llama la acción", async () => {
    const { result } = renderPage();
    act(() => {
      result.current.handleChange({ target: { name: "firstName", value: "Juan" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: "lastName", value: "García" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(result.current.error).toBeTruthy();
    expect(mockedAction).not.toHaveBeenCalled();
  });
});

// ─── handleSubmit — flujos de API ─────────────────────────────────────────────

describe("useRegisterPage — handleSubmit flujos de API", () => {
  function fillForm(result: ReturnType<typeof renderPage>["result"]) {
    act(() => {
      result.current.handleChange({ target: { name: "firstName", value: "Juan" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: "lastName", value: "García" } } as React.ChangeEvent<HTMLInputElement>);
      result.current.handleChange({ target: { name: "email", value: "juan@example.com" } } as React.ChangeEvent<HTMLInputElement>);
    });
  }

  it("registro exitoso llama registerAction con first_name/last_name convertidos a snake_case", async () => {
    mockedAction.mockResolvedValueOnce({ success: true, message: "Cuenta creada.", email: "juan@example.com" });
    const { result } = renderPage();
    fillForm(result);

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(mockedAction).toHaveBeenCalledWith({
      email: "juan@example.com",
      first_name: "Juan",
      last_name: "García",
    });
  });

  it("registro con phone incluye el campo en el payload", async () => {
    mockedAction.mockResolvedValueOnce({ success: true, message: "ok", email: "juan@example.com" });
    const { result } = renderPage();
    fillForm(result);
    act(() => {
      result.current.handleChange({ target: { name: "phone", value: "+525512345678" } } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(mockedAction).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "+525512345678" })
    );
  });

  it("userExists:true activa flag y popula error con el mensaje del servidor", async () => {
    mockedAction.mockResolvedValueOnce({
      success: false,
      userExists: true,
      message: "El usuario ya existe. Inicia sesión.",
    });
    const { result } = renderPage();
    fillForm(result);

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(result.current.userExists).toBe(true);
    expect(result.current.error).toBe("El usuario ya existe. Inicia sesión.");
  });

  it("error genérico popula error sin activar userExists", async () => {
    mockedAction.mockResolvedValueOnce({
      success: false,
      message: "Error al crear la cuenta.",
    });
    const { result } = renderPage();
    fillForm(result);

    await act(() => result.current.handleSubmit(VALID_FORM_EVENT));

    expect(result.current.error).toBe("Error al crear la cuenta.");
    expect(result.current.userExists).toBe(false);
  });
});
