import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotificationsAction } from "./get-notifications.actions";
import { notificationsApi } from "@/notifications/api/notifications.api";

vi.mock("@/notifications/api/notifications.api", () => ({
  notificationsApi: { getNotifications: vi.fn() },
}));

const mockedGetNotifications = vi.mocked(notificationsApi.getNotifications);

function makeBackendItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: "Nueva propiedad guardada",
    message: "Tu propiedad fue guardada.",
    notification_type: "property_saved",
    is_read: false,
    reference_type: "property",
    reference_id: 42,
    created_at: "2026-03-28T10:00:00Z",
    ...overrides,
  };
}

function makeBackendResponse(
  items: ReturnType<typeof makeBackendItem>[],
  opts: { count?: number; unread_count?: number; next?: string | null } = {}
) {
  return {
    data: {
      count: opts.count ?? items.length,
      unread_count: opts.unread_count ?? 0,
      next: opts.next ?? null,
      previous: null,
      results: items,
    },
  };
}

beforeEach(() => vi.clearAllMocks());

// ─── mapItem: snake_case → camelCase ─────────────────────────────────────────

describe("getNotificationsAction — mapItem", () => {
  it("mapea is_read, notification_type y created_at a camelCase", async () => {
    mockedGetNotifications.mockResolvedValueOnce(
      makeBackendResponse([makeBackendItem()]) as never
    );

    const { results } = await getNotificationsAction();

    expect(results[0].isRead).toBe(false);
    expect(results[0].notificationType).toBe("property_saved");
    expect(results[0].createdAt).toBe("2026-03-28T10:00:00Z");
  });

  it("reference_id: null se preserva como null en referenceId", async () => {
    mockedGetNotifications.mockResolvedValueOnce(
      makeBackendResponse([makeBackendItem({ reference_id: null })]) as never
    );

    const { results } = await getNotificationsAction();

    expect(results[0].referenceId).toBeNull();
  });
});

// ─── getNotificationsAction: respuestas y params ──────────────────────────────

describe("getNotificationsAction — respuestas y params", () => {
  it("respuesta exitosa mapea count, unreadCount, next, previous y results", async () => {
    mockedGetNotifications.mockResolvedValueOnce(
      makeBackendResponse(
        [makeBackendItem(), makeBackendItem({ id: 2 })],
        { count: 50, unread_count: 3, next: "/notifications/?offset=20" }
      ) as never
    );

    const result = await getNotificationsAction();

    expect(result.count).toBe(50);
    expect(result.unreadCount).toBe(3);
    expect(result.next).toBe("/notifications/?offset=20");
    expect(result.previous).toBeNull();
    expect(result.results).toHaveLength(2);
  });

  it("isRead, limit y offset se pasan a la API como is_read, limit, offset", async () => {
    mockedGetNotifications.mockResolvedValueOnce(
      makeBackendResponse([]) as never
    );

    await getNotificationsAction({ isRead: false, limit: 10, offset: 20 });

    expect(mockedGetNotifications).toHaveBeenCalledWith({
      is_read: false,
      limit: 10,
      offset: 20,
    });
  });

  it("error con instancia Error lanza con el mensaje original", async () => {
    mockedGetNotifications.mockRejectedValueOnce(new Error("Network timeout"));

    await expect(getNotificationsAction()).rejects.toThrow("Network timeout");
  });

  it("error no-Error lanza con mensaje 'Error desconocido...'", async () => {
    mockedGetNotifications.mockRejectedValueOnce({ code: 500 });

    await expect(getNotificationsAction()).rejects.toThrow(
      "Error desconocido al obtener notificaciones"
    );
  });
});
