import { describe, it, expect, vi, beforeEach } from "vitest";
import { meAction } from "./me.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { get: vi.fn() },
}));

const mockedGet = vi.mocked(axiosInstance.get);

const MOCK_USER = {
  id: 1,
  email: "me@test.com",
  first_name: "Ana",
  last_name: "Torres",
  phone: null,
  memberships: [{ id: 1, tenant_id: 10, role: "client" }],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("meAction", () => {
  it("llama GET /auth/me exactamente una vez", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { user: MOCK_USER, refresh_expires_at: 0 },
    } as never);

    await meAction();

    expect(mockedGet).toHaveBeenCalledWith("/auth/me");
    expect(mockedGet).toHaveBeenCalledTimes(1);
  });

  it("retorna { user, refresh_expires_at } cuando el servidor responde 200", async () => {
    mockedGet.mockResolvedValueOnce({
      data: { user: MOCK_USER, refresh_expires_at: 1700000000000 },
    } as never);

    const result = await meAction();

    expect(result).not.toBeNull();
    expect(result!.user).toEqual(MOCK_USER);
    expect(result!.refresh_expires_at).toBe(1700000000000);
  });

  it("retorna null cuando el servidor responde con error (401, 403, 500...)", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Unauthorized"));

    const result = await meAction();

    expect(result).toBeNull();
  });

  it("retorna null en error de red sin lanzar excepción", async () => {
    mockedGet.mockRejectedValueOnce(new Error("Network Error"));

    await expect(meAction()).resolves.toBeNull();
  });
});
