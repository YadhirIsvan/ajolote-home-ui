import { describe, it, expect, vi, beforeEach } from "vitest";
import { logoutAction } from "./logout.actions";
import { axiosInstance } from "@/shared/api/axios.instance";

vi.mock("@/shared/api/axios.instance", () => ({
  axiosInstance: { post: vi.fn() },
}));

const mockedPost = vi.mocked(axiosInstance.post);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("logoutAction", () => {
  it("lee refresh_token de localStorage y lo envía en el body", async () => {
    localStorage.setItem("refresh_token", "my-refresh-token");
    mockedPost.mockResolvedValueOnce({} as never);

    await logoutAction();

    expect(mockedPost).toHaveBeenCalledWith("/auth/logout", {
      refresh: "my-refresh-token",
    });
  });

  it("refresh_token null → envía null sin lanzar error", async () => {
    mockedPost.mockResolvedValueOnce({} as never);

    await expect(logoutAction()).resolves.toBeUndefined();

    expect(mockedPost).toHaveBeenCalledWith("/auth/logout", { refresh: null });
  });

  it("error del servidor → silenciado, resuelve void sin lanzar", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Server unavailable"));

    await expect(logoutAction()).resolves.toBeUndefined();
  });
});
