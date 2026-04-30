import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAgentAppointmentsAction } from "./get-agent-appointments.actions";
import { agentApi } from "@/myAccount/agent/api/agent.api";

vi.mock("@/myAccount/agent/api/agent.api");

const mockedGetAppointments = vi.mocked(agentApi.getAppointments);

const BACKEND_APPOINTMENT = {
  id: 1,
  matricula: "MAT-001",
  scheduled_date: "2026-04-10",
  scheduled_time: "14:30:00",
  duration_minutes: 60,
  status: "programada" as const,
  client_name: "Juan Pérez",
  client_phone: "555-1234",
  property: { id: 10, title: "Casa en el bosque" },
};

beforeEach(() => vi.clearAllMocks());

describe("getAgentAppointmentsAction — mapeo", () => {
  it("mapea campos de BackendAppointment a AgentAppointment", async () => {
    mockedGetAppointments.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_APPOINTMENT] },
    } as never);

    const result = await getAgentAppointmentsAction();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].client).toBe("Juan Pérez");
    expect(result[0].property).toBe("Casa en el bosque");
    expect(result[0].status).toBe("programada");
    expect(result[0].matricula).toBe("MAT-001");
    expect(result[0].durationMinutes).toBe(60);
    expect(result[0].clientPhone).toBe("555-1234");
  });

  it("convierte hora 14:30 → '2:30 PM'", async () => {
    mockedGetAppointments.mockResolvedValueOnce({
      data: { count: 1, results: [{ ...BACKEND_APPOINTMENT, scheduled_time: "14:30:00" }] },
    } as never);

    const [apt] = await getAgentAppointmentsAction();
    expect(apt.time).toBe("2:30 PM");
  });

  it("convierte hora 00:05 → '12:05 AM'", async () => {
    mockedGetAppointments.mockResolvedValueOnce({
      data: { count: 1, results: [{ ...BACKEND_APPOINTMENT, scheduled_time: "00:05:00" }] },
    } as never);

    const [apt] = await getAgentAppointmentsAction();
    expect(apt.time).toBe("12:05 AM");
  });

  it("convierte hora 12:00 → '12:00 PM'", async () => {
    mockedGetAppointments.mockResolvedValueOnce({
      data: { count: 1, results: [{ ...BACKEND_APPOINTMENT, scheduled_time: "12:00:00" }] },
    } as never);

    const [apt] = await getAgentAppointmentsAction();
    expect(apt.time).toBe("12:00 PM");
  });
});

describe("getAgentAppointmentsAction — error", () => {
  it("lanza un Error en caso de error", async () => {
    mockedGetAppointments.mockRejectedValueOnce(new Error("Network error"));
    await expect(getAgentAppointmentsAction()).rejects.toThrow("Network error");
  });
});
