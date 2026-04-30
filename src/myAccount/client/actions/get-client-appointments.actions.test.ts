import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClientAppointmentsAction,
  cancelClientAppointmentAction,
} from "./get-client-appointments.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: {
    getAppointments: vi.fn(),
    cancelAppointment: vi.fn(),
  },
}));

const mockedGetAppointments = vi.mocked(clientApi.getAppointments);
const mockedCancelAppointment = vi.mocked(clientApi.cancelAppointment);

const MOCK_APPOINTMENT = {
  id: 1,
  property_title: "Casa en Orizaba",
  date: "2026-04-01",
  time: "10:00",
  status: "confirmed",
};

beforeEach(() => vi.clearAllMocks());

// ─── getClientAppointmentsAction ──────────────────────────────────────────────

describe("getClientAppointmentsAction", () => {
  it("éxito → retorna el array de citas directamente", async () => {
    mockedGetAppointments.mockResolvedValueOnce({
      data: [MOCK_APPOINTMENT],
    } as never);

    const result = await getClientAppointmentsAction();

    expect(result).toEqual([MOCK_APPOINTMENT]);
  });

  it("error → lanza un Error", async () => {
    mockedGetAppointments.mockRejectedValueOnce(new Error("Network error"));

    await expect(getClientAppointmentsAction()).rejects.toThrow("Network error");
  });
});

// ─── cancelClientAppointmentAction ───────────────────────────────────────────

describe("cancelClientAppointmentAction", () => {
  it("éxito → retorna el appointment cancelado", async () => {
    const cancelled = { ...MOCK_APPOINTMENT, status: "cancelled" };
    mockedCancelAppointment.mockResolvedValueOnce({ data: cancelled } as never);

    const result = await cancelClientAppointmentAction(1, "No puedo asistir");

    expect(mockedCancelAppointment).toHaveBeenCalledWith(1, "No puedo asistir");
    expect(result).toEqual(cancelled);
  });

  it("error instanceof Error → rethrows con el mensaje original", async () => {
    mockedCancelAppointment.mockRejectedValueOnce(new Error("Forbidden"));

    await expect(cancelClientAppointmentAction(1)).rejects.toThrow("Forbidden");
  });

  it("error no-Error → lanza mensaje genérico", async () => {
    mockedCancelAppointment.mockRejectedValueOnce({ status: 500 });

    await expect(cancelClientAppointmentAction(1)).rejects.toThrow(
      "Error al cancelar la cita"
    );
  });
});
