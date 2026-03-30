import { describe, it, expect, vi, beforeEach } from "vitest";
import { scheduleAppointmentAction } from "./schedule-appointment.actions";
import { buyApi } from "@/buy/api/buy.api";
import type { AppointmentData } from "@/buy/types/property.types";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { post: vi.fn() },
  ENDPOINTS: {
    SCHEDULE_APPOINTMENT: (id: number) => `/public/properties/${id}/appointment`,
  },
}));

const mockedPost = vi.mocked(buyApi.post);

const BASE_APPOINTMENT_DATA: AppointmentData = {
  date: "2026-04-10",
  time: "10:00 AM",
  name: "Ana García",
  phone: "555-1234",
  email: "ana@example.com",
};

const MOCK_RESPONSE = {
  id: 7,
  matricula: "APT-2026-007",
  scheduled_date: "2026-04-10",
  scheduled_time: "10:00:00",
  duration_minutes: 30,
  status: "confirmed",
  property: { id: 42, title: "Casa Test" },
  agent: { name: "Carlos Agente" },
};

beforeEach(() => vi.clearAllMocks());

// ─── convertTo24h (vía el payload enviado a la API) ───────────────────────────

describe("scheduleAppointmentAction — convertTo24h en payload", () => {
  beforeEach(() => {
    mockedPost.mockResolvedValue({ data: MOCK_RESPONSE } as never);
  });

  it("'10:30 AM' → time: '10:30' en el payload", async () => {
    await scheduleAppointmentAction(42, { ...BASE_APPOINTMENT_DATA, time: "10:30 AM" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.time).toBe("10:30");
  });

  it("'12:00 PM' → time: '12:00' (PM + 12 no suma 12)", async () => {
    await scheduleAppointmentAction(42, { ...BASE_APPOINTMENT_DATA, time: "12:00 PM" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.time).toBe("12:00");
  });

  it("'1:30 PM' → time: '13:30'", async () => {
    await scheduleAppointmentAction(42, { ...BASE_APPOINTMENT_DATA, time: "1:30 PM" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.time).toBe("13:30");
  });

  it("'12:00 AM' → time: '00:00' (AM + 12 → 0)", async () => {
    await scheduleAppointmentAction(42, { ...BASE_APPOINTMENT_DATA, time: "12:00 AM" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.time).toBe("00:00");
  });

  it("ya en formato 24h '14:30' → time: '14:30' sin modificación", async () => {
    await scheduleAppointmentAction(42, { ...BASE_APPOINTMENT_DATA, time: "14:30" });
    const payload = mockedPost.mock.calls[0][1] as Record<string, unknown>;
    expect(payload.time).toBe("14:30");
  });
});

// ─── Respuestas ───────────────────────────────────────────────────────────────

describe("scheduleAppointmentAction — respuestas", () => {
  it("éxito retorna success: true y message construido con scheduled_date, time y matricula", async () => {
    mockedPost.mockResolvedValueOnce({ data: MOCK_RESPONSE } as never);

    const result = await scheduleAppointmentAction(42, BASE_APPOINTMENT_DATA);

    expect(result.success).toBe(true);
    expect(result.message).toContain("2026-04-10");
    expect(result.message).toContain("10:00"); // scheduled_time.slice(0, 5)
    expect(result.message).toContain("APT-2026-007");
    expect(result.data).toEqual(MOCK_RESPONSE);
  });

  it("error retorna { success: false, message: 'No se pudo agendar...' }", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Conflict"));

    const result = await scheduleAppointmentAction(42, BASE_APPOINTMENT_DATA);

    expect(result.success).toBe(false);
    expect(result.message).toBe("No se pudo agendar la cita. Intenta de nuevo.");
  });
});
