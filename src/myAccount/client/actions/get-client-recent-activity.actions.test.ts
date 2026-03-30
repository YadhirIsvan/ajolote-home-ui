import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getClientRecentActivityAction } from "./get-client-recent-activity.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getDashboard: vi.fn() },
}));

const mockedGetDashboard = vi.mocked(clientApi.getDashboard);

// Fecha fija para hacer determinísticos los cálculos de hoursAgo
const NOW = new Date("2026-03-28T12:00:00Z").getTime();

beforeEach(() => {
  vi.clearAllMocks();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
});

// ─── humanizeType (indirecto) ─────────────────────────────────────────────────

describe("getClientRecentActivityAction — humanizeType", () => {
  it("'property_saved' → 'Property Saved' (snake_case → Title Case)", async () => {
    mockedGetDashboard.mockResolvedValueOnce({
      data: {
        recent_activity: [
          { type: "property_saved", description: "desc", created_at: new Date(NOW - 3_600_000).toISOString() },
        ],
      },
    } as never);

    const [item] = await getClientRecentActivityAction();

    expect(item.name).toBe("Property Saved");
  });

  it("'view' → 'View' (una sola palabra)", async () => {
    mockedGetDashboard.mockResolvedValueOnce({
      data: {
        recent_activity: [
          { type: "view", description: "desc", created_at: new Date(NOW - 3_600_000).toISOString() },
        ],
      },
    } as never);

    const [item] = await getClientRecentActivityAction();

    expect(item.name).toBe("View");
  });
});

// ─── hoursAgo (indirecto) ─────────────────────────────────────────────────────

describe("getClientRecentActivityAction — hoursAgo", () => {
  it("actividad de hace exactamente 1 hora → time: 1", async () => {
    const oneHourAgo = new Date(NOW - 3_600_000).toISOString();
    mockedGetDashboard.mockResolvedValueOnce({
      data: {
        recent_activity: [
          { type: "view", description: "", created_at: oneHourAgo },
        ],
      },
    } as never);

    const [item] = await getClientRecentActivityAction();

    expect(item.time).toBe(1);
  });

  it("actividad muy reciente (segundos) → mínimo 1 hora", async () => {
    const justNow = new Date(NOW - 5_000).toISOString(); // 5 seconds ago
    mockedGetDashboard.mockResolvedValueOnce({
      data: {
        recent_activity: [
          { type: "view", description: "", created_at: justNow },
        ],
      },
    } as never);

    const [item] = await getClientRecentActivityAction();

    expect(item.time).toBe(1);
  });
});

// ─── getClientRecentActivityAction ───────────────────────────────────────────

describe("getClientRecentActivityAction", () => {
  it("éxito → mapea name, description y time", async () => {
    const created = new Date(NOW - 7_200_000).toISOString(); // 2 hours ago
    mockedGetDashboard.mockResolvedValueOnce({
      data: {
        recent_activity: [
          { type: "appointment_created", description: "Cita agendada para mañana", created_at: created },
        ],
      },
    } as never);

    const [item] = await getClientRecentActivityAction();

    expect(item.name).toBe("Appointment Created");
    expect(item.description).toBe("Cita agendada para mañana");
    expect(item.time).toBe(2);
  });

  it("recent_activity ausente (undefined) → retorna []", async () => {
    mockedGetDashboard.mockResolvedValueOnce({
      data: {},
    } as never);

    const result = await getClientRecentActivityAction();

    expect(result).toEqual([]);
  });

  it("error → silencia y retorna []", async () => {
    mockedGetDashboard.mockRejectedValueOnce(new Error("Server error"));

    const result = await getClientRecentActivityAction();

    expect(result).toEqual([]);
  });
});
