import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmailOtpAction } from "./send-email-otp.actions";
import { authApi } from "@/auth/api/auth.api";

vi.mock("@/auth/api/auth.api", () => ({
  authApi: { sendEmailOtp: vi.fn() },
}));

const mockedSendOtp = vi.mocked(authApi.sendEmailOtp);

beforeEach(() => vi.clearAllMocks());

describe("sendEmailOtpAction", () => {
  it("respuesta exitosa con is_new_user: false", async () => {
    mockedSendOtp.mockResolvedValueOnce({
      data: { message: "Código enviado.", is_new_user: false },
    } as never);

    const result = await sendEmailOtpAction("user@example.com");

    expect(result.success).toBe(true);
    expect(result.isNewUser).toBe(false);
    expect(result.message).toBe("Código enviado.");
  });

  it("respuesta exitosa con is_new_user: true", async () => {
    mockedSendOtp.mockResolvedValueOnce({
      data: { message: "Bienvenido.", is_new_user: true },
    } as never);

    const result = await sendEmailOtpAction("nuevo@example.com");

    expect(result.success).toBe(true);
    expect(result.isNewUser).toBe(true);
  });

  it("error sin response (red) retorna mensaje de conexión fallida", async () => {
    mockedSendOtp.mockRejectedValueOnce({ message: "Network Error" });

    const result = await sendEmailOtpAction("user@example.com");

    expect(result.success).toBe(false);
    expect(result.isNewUser).toBe(false);
    expect(result.message).toContain("No se pudo conectar");
  });

  it("error 429 retorna mensaje de demasiados intentos", async () => {
    mockedSendOtp.mockRejectedValueOnce({
      response: { status: 429, data: {} },
    });

    const result = await sendEmailOtpAction("user@example.com");

    expect(result.success).toBe(false);
    expect(result.message).toContain("Demasiados intentos");
  });

  it("error con response.data.error usa ese mensaje del servidor", async () => {
    mockedSendOtp.mockRejectedValueOnce({
      response: { status: 500, data: { error: "Servicio no disponible" } },
    });

    const result = await sendEmailOtpAction("user@example.com");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Servicio no disponible");
  });

  it("error genérico sin mensaje usa fallback por defecto", async () => {
    mockedSendOtp.mockRejectedValueOnce({
      response: { status: 500, data: {} },
    });

    const result = await sendEmailOtpAction("user@example.com");

    expect(result.success).toBe(false);
    expect(result.message).toBe("Error al enviar el código. Intenta de nuevo.");
  });
});
