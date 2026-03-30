import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useNotifications } from "./use-notifications.notifications.hook";
import { getNotificationsAction } from "@/notifications/actions/get-notifications.actions";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/notifications/actions/mark-notification-read.actions";

vi.mock("@/notifications/actions/get-notifications.actions");
vi.mock("@/notifications/actions/mark-notification-read.actions");

const mockedGet = vi.mocked(getNotificationsAction);
const mockedMarkRead = vi.mocked(markNotificationReadAction);
const mockedMarkAll = vi.mocked(markAllNotificationsReadAction);

const MOCK_RESULT = {
  count: 5,
  unreadCount: 2,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: "Propiedad guardada",
      message: "Se guardó tu propiedad.",
      notificationType: "property_saved",
      isRead: false,
      referenceType: "property",
      referenceId: 42,
      createdAt: "2026-03-28T10:00:00Z",
    },
    {
      id: 2,
      title: "Cita confirmada",
      message: "Tu cita fue confirmada.",
      notificationType: "appointment",
      isRead: true,
      referenceType: "appointment",
      referenceId: 7,
      createdAt: "2026-03-27T09:00:00Z",
    },
  ],
};

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => vi.clearAllMocks());

// ─── Estado inicial y datos ───────────────────────────────────────────────────

describe("useNotifications — estado y datos", () => {
  it("isLoading: true mientras la query está en vuelo", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("defaults: notifications: [], unreadCount: 0, total: 0 antes de resolver", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it("datos poblados correctamente tras resolver", async () => {
    mockedGet.mockResolvedValueOnce(MOCK_RESULT);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.unreadCount).toBe(2);
    expect(result.current.total).toBe(5);
    expect(result.current.notifications[0].title).toBe("Propiedad guardada");
  });
});

// ─── markRead ─────────────────────────────────────────────────────────────────

describe("useNotifications — markRead", () => {
  it("markRead(5) llama a markNotificationReadAction con 5", async () => {
    mockedGet.mockResolvedValue(MOCK_RESULT);
    mockedMarkRead.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.markRead(5));

    await waitFor(() => expect(mockedMarkRead).toHaveBeenCalledWith(5));
  });

  it("tras éxito invalida la query provocando re-fetch", async () => {
    mockedGet.mockResolvedValue(MOCK_RESULT);
    mockedMarkRead.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = mockedGet.mock.calls.length;

    act(() => result.current.markRead(1));

    await waitFor(() =>
      expect(mockedGet.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });
});

// ─── markAllRead ──────────────────────────────────────────────────────────────

describe("useNotifications — markAllRead", () => {
  it("markAllRead() llama a markAllNotificationsReadAction", async () => {
    mockedGet.mockResolvedValue(MOCK_RESULT);
    mockedMarkAll.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.markAllRead());

    await waitFor(() => expect(mockedMarkAll).toHaveBeenCalledTimes(1));
  });

  it("tras éxito invalida la query provocando re-fetch", async () => {
    mockedGet.mockResolvedValue(MOCK_RESULT);
    mockedMarkAll.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useNotifications(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const callsBefore = mockedGet.mock.calls.length;

    act(() => result.current.markAllRead());

    await waitFor(() =>
      expect(mockedGet.mock.calls.length).toBeGreaterThan(callsBefore)
    );
  });
});
