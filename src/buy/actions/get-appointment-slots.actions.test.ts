import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAppointmentSlotsAction } from "./get-appointment-slots.actions";
import { buyApi } from "@/buy/api/buy.api";

vi.mock("@/buy/api/buy.api", () => ({
  buyApi: { get: vi.fn() },
  ENDPOINTS: { APPOINTMENT_SLOTS: "/public/appointment/slots" },
}));

const mockedGet = vi.mocked(buyApi.get);

const MOCK_SLOTS = {
  date: "2026-04-01",
  agent: { name: "Carlos Agente" },
  available_slots: ["10:00", "11:00", "15:00"],
  slot_duration_minutes: 30,
};

beforeEach(() => vi.clearAllMocks());

describe("getAppointmentSlotsAction", () => {
  it("respuesta exitosa retorna { success: true, data }", async () => {
    mockedGet.mockResolvedValueOnce({ data: MOCK_SLOTS } as never);

    const result = await getAppointmentSlotsAction(42, "2026-04-01");

    expect(result.success).toBe(true);
    expect(result.data).toEqual(MOCK_SLOTS);
  });

  it("error de API retorna { success: false, message }", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Server Error"));

    const result = await getAppointmentSlotsAction(42, "2026-04-01");

    expect(result.success).toBe(false);
    expect(result.message).toBe("No se pudieron obtener los horarios disponibles.");
  });

  it("la URL incluye property_id y date como query params correctos", async () => {
    mockedGet.mockResolvedValueOnce({ data: MOCK_SLOTS } as never);

    await getAppointmentSlotsAction(99, "2026-05-15");

    const calledUrl: string = mockedGet.mock.calls[0][0] as string;
    expect(calledUrl).toContain("property_id=99");
    expect(calledUrl).toContain("date=2026-05-15");
  });
});
