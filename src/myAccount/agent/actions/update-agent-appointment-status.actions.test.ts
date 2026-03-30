import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateAgentAppointmentStatusAction } from "./update-agent-appointment-status.actions";
import { agentApi } from "@/myAccount/agent/api/agent.api";

vi.mock("@/myAccount/agent/api/agent.api");

const mockedUpdate = vi.mocked(agentApi.updateAppointmentStatus);

beforeEach(() => vi.clearAllMocks());

describe("updateAgentAppointmentStatusAction — éxito", () => {
  it("retorna { success: true } cuando la llamada tiene éxito", async () => {
    mockedUpdate.mockResolvedValueOnce({ data: undefined } as never);

    const result = await updateAgentAppointmentStatusAction(1, "confirmada");

    expect(result.success).toBe(true);
  });

  it("pasa id, status y notes a la API correctamente", async () => {
    mockedUpdate.mockResolvedValueOnce({ data: undefined } as never);

    await updateAgentAppointmentStatusAction(5, "completada", "Sin observaciones");

    expect(mockedUpdate).toHaveBeenCalledWith(5, "completada", "Sin observaciones");
  });

  it("pasa undefined como notes cuando no se proporciona", async () => {
    mockedUpdate.mockResolvedValueOnce({ data: undefined } as never);

    await updateAgentAppointmentStatusAction(3, "cancelada");

    expect(mockedUpdate).toHaveBeenCalledWith(3, "cancelada", undefined);
  });
});

describe("updateAgentAppointmentStatusAction — error", () => {
  it("retorna { success: false, message } en caso de error", async () => {
    mockedUpdate.mockRejectedValueOnce(new Error("Network error"));

    const result = await updateAgentAppointmentStatusAction(1, "confirmada");

    expect(result.success).toBe(false);
    expect(result.message).toBeTruthy();
  });
});
