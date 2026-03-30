import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAdminAppointmentsAction,
  createAdminAppointmentAction,
  updateAdminAppointmentStatusAction,
} from "./get-admin-appointments.actions";
import { adminApi } from "@/myAccount/admin/api/admin.api";

vi.mock("@/myAccount/admin/api/admin.api");

const mockedApi = vi.mocked(adminApi);

const BACKEND_APPOINTMENT = {
  id: 1,
  matricula: "MAT-100",
  scheduled_date: "2026-04-15",
  scheduled_time: "10:00:00",
  duration_minutes: 60,
  status: "programada",
  appointment_type: "visit",
  client_name: "Juan",
  client_email: "juan@example.com",
  client_phone: "555-1111",
  property: { id: 5, title: "Casa Norte" },
  agent: { id: 2, name: "Pedro Agente" },
};

beforeEach(() => vi.clearAllMocks());

// ─── getAdminAppointmentsAction ───────────────────────────────────────────────

describe("getAdminAppointmentsAction — mapeo", () => {
  it("mapea BackendAdminAppointment a AdminAppointment correctamente", async () => {
    mockedApi.getAppointments.mockResolvedValueOnce({
      data: { count: 1, results: [BACKEND_APPOINTMENT] },
    } as never);

    const result = await getAdminAppointmentsAction();

    expect(result.count).toBe(1);
    const apt = result.results[0];
    expect(apt.scheduledDate).toBe("2026-04-15");
    expect(apt.scheduledTime).toBe("10:00:00");
    expect(apt.durationMinutes).toBe(60);
    expect(apt.clientName).toBe("Juan");
    expect(apt.clientEmail).toBe("juan@example.com");
    expect(apt.clientPhone).toBe("555-1111");
    expect(apt.property).toEqual({ id: 5, title: "Casa Norte" });
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.getAppointments.mockRejectedValueOnce(new Error("err"));
    await expect(getAdminAppointmentsAction()).rejects.toThrow();
  });
});

// ─── createAdminAppointmentAction ─────────────────────────────────────────────

describe("createAdminAppointmentAction", () => {
  it("retorna cita mapeada", async () => {
    mockedApi.createAppointment.mockResolvedValueOnce({
      data: BACKEND_APPOINTMENT,
    } as never);

    const payload = {
      property_id: 5,
      agent_membership_id: 2,
      scheduled_date: "2026-04-15",
      scheduled_time: "10:00",
    };
    const result = await createAdminAppointmentAction(payload);
    expect(result.id).toBe(1);
    expect(result.matricula).toBe("MAT-100");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.createAppointment.mockRejectedValueOnce(new Error("err"));
    await expect(
      createAdminAppointmentAction({ property_id: 1, agent_membership_id: 1, scheduled_date: "", scheduled_time: "" })
    ).rejects.toThrow();
  });
});

// ─── updateAdminAppointmentStatusAction ───────────────────────────────────────

describe("updateAdminAppointmentStatusAction", () => {
  it("retorna cita actualizada mapeada", async () => {
    mockedApi.updateAppointment.mockResolvedValueOnce({
      data: { ...BACKEND_APPOINTMENT, status: "confirmada" },
    } as never);

    const result = await updateAdminAppointmentStatusAction(1, { status: "confirmada" });
    expect(result.status).toBe("confirmada");
  });

  it("lanza el error en caso de fallo", async () => {
    mockedApi.updateAppointment.mockRejectedValueOnce(new Error("err"));
    await expect(
      updateAdminAppointmentStatusAction(1, { status: "cancelada" })
    ).rejects.toThrow();
  });
});
