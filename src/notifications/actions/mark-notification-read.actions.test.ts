import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "./mark-notification-read.actions";
import { notificationsApi } from "@/notifications/api/notifications.api";

vi.mock("@/notifications/api/notifications.api", () => ({
  notificationsApi: {
    markRead: vi.fn(),
    markAllRead: vi.fn(),
  },
}));

const mockedMarkRead = vi.mocked(notificationsApi.markRead);
const mockedMarkAllRead = vi.mocked(notificationsApi.markAllRead);

beforeEach(() => vi.clearAllMocks());

// ─── markNotificationReadAction ───────────────────────────────────────────────

describe("markNotificationReadAction", () => {
  it("éxito resuelve void sin lanzar", async () => {
    mockedMarkRead.mockResolvedValueOnce(undefined as never);

    await expect(markNotificationReadAction(5)).resolves.toBeUndefined();
    expect(mockedMarkRead).toHaveBeenCalledWith(5);
  });

  it("error con instancia Error lanza con el mensaje original", async () => {
    mockedMarkRead.mockRejectedValueOnce(new Error("Forbidden"));

    await expect(markNotificationReadAction(5)).rejects.toThrow("Forbidden");
  });

  it("error no-Error lanza con mensaje genérico", async () => {
    mockedMarkRead.mockRejectedValueOnce({ status: 403 });

    await expect(markNotificationReadAction(5)).rejects.toThrow(
      "Error al marcar notificación como leída"
    );
  });
});

// ─── markAllNotificationsReadAction ──────────────────────────────────────────

describe("markAllNotificationsReadAction", () => {
  it("éxito resuelve void sin lanzar", async () => {
    mockedMarkAllRead.mockResolvedValueOnce(undefined as never);

    await expect(markAllNotificationsReadAction()).resolves.toBeUndefined();
  });

  it("error lanza Error", async () => {
    mockedMarkAllRead.mockRejectedValueOnce(new Error("Server Error"));

    await expect(markAllNotificationsReadAction()).rejects.toThrow("Server Error");
  });
});
