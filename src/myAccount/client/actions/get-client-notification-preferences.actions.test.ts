import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getClientNotificationPreferencesAction,
  updateClientNotificationPreferencesAction,
} from "./get-client-notification-preferences.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: {
    getNotificationPreferences: vi.fn(),
    updateNotificationPreferences: vi.fn(),
  },
}));

const mockedGet = vi.mocked(clientApi.getNotificationPreferences);
const mockedUpdate = vi.mocked(clientApi.updateNotificationPreferences);

const _DEFAULT_PREFERENCES = {
  new_properties: false,
  price_updates: false,
  appointment_reminders: false,
  offers: false,
};

const ACTIVE_PREFERENCES = {
  new_properties: true,
  price_updates: true,
  appointment_reminders: false,
  offers: true,
};

beforeEach(() => vi.clearAllMocks());

// ─── getClientNotificationPreferencesAction ───────────────────────────────────

describe("getClientNotificationPreferencesAction", () => {
  it("éxito → retorna las preferencias del backend", async () => {
    mockedGet.mockResolvedValueOnce({ data: ACTIVE_PREFERENCES } as never);

    const result = await getClientNotificationPreferencesAction();

    expect(result).toEqual(ACTIVE_PREFERENCES);
  });

  it("error → lanza un Error", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(getClientNotificationPreferencesAction()).rejects.toThrow("Network error");
  });
});

// ─── updateClientNotificationPreferencesAction ────────────────────────────────

describe("updateClientNotificationPreferencesAction", () => {
  it("éxito → resuelve void", async () => {
    mockedUpdate.mockResolvedValueOnce(undefined as never);

    await expect(
      updateClientNotificationPreferencesAction(ACTIVE_PREFERENCES)
    ).resolves.toBeUndefined();

    expect(mockedUpdate).toHaveBeenCalledWith(ACTIVE_PREFERENCES);
  });

  it("error instanceof Error → rethrows con el mensaje original", async () => {
    mockedUpdate.mockRejectedValueOnce(new Error("Conflict"));

    await expect(
      updateClientNotificationPreferencesAction(ACTIVE_PREFERENCES)
    ).rejects.toThrow("Conflict");
  });

  it("error no-Error → mensaje genérico", async () => {
    mockedUpdate.mockRejectedValueOnce({ status: 400 });

    await expect(
      updateClientNotificationPreferencesAction(ACTIVE_PREFERENCES)
    ).rejects.toThrow("Error al actualizar preferencias de notificación");
  });
});
