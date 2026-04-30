import { describe, it, expect, vi, beforeEach } from "vitest";
import { getClientProfileAction } from "./get-client-profile.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: { getUserProfile: vi.fn() },
}));

const mockedGetUserProfile = vi.mocked(clientApi.getUserProfile);

beforeEach(() => vi.clearAllMocks());

describe("getClientProfileAction", () => {
  it("éxito → retorna el perfil del usuario", async () => {
    const profile = {
      id: 1,
      email: "test@example.com",
      first_name: "Ana",
      last_name: "García",
      phone: "272 123 4567",
      avatar: null,
    };
    mockedGetUserProfile.mockResolvedValueOnce({ data: profile } as never);

    const result = await getClientProfileAction();

    expect(result).toEqual(profile);
  });

  it("error → lanza un Error", async () => {
    mockedGetUserProfile.mockRejectedValueOnce(new Error("Unauthorized"));

    await expect(getClientProfileAction()).rejects.toThrow("Unauthorized");
  });
});
