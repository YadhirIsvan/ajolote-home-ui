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
  it("llama POST /auth/logout sin body (refresh_token en cookie httpOnly automática)", async () => {
    mockedPost.mockResolvedValueOnce({} as never);

    await logoutAction();

    expect(mockedPost).toHaveBeenCalledWith("/auth/logout");
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });

  it("NO lee ni envía tokens de localStorage — el browser envía las cookies automáticamente", async () => {
    localStorage.setItem("refresh_token", "should-be-ignored");
    mockedPost.mockResolvedValueOnce({} as never);

    await logoutAction();

    // Se llama solo con la ruta — sin objeto { refresh: ... } en el body
    expect(mockedPost).toHaveBeenCalledWith("/auth/logout");
    expect(mockedPost).not.toHaveBeenCalledWith(
      "/auth/logout",
      expect.objectContaining({ refresh: expect.anything() })
    );
  });

  it("error del servidor → silenciado, resuelve void sin lanzar", async () => {
    mockedPost.mockRejectedValueOnce(new Error("Server unavailable"));

    await expect(logoutAction()).resolves.toBeUndefined();
  });
});
