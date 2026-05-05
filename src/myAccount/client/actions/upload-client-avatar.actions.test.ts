import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  uploadClientAvatarAction,
  deleteClientAvatarAction,
} from "./upload-client-avatar.actions";
import { clientApi } from "@/myAccount/client/api/client.api";

vi.mock("@/myAccount/client/api/client.api", () => ({
  clientApi: {
    uploadAvatar: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

vi.mock("@/shared/utils/media-url.utils", () => ({
  getMediaUrl: (url: string) => `https://api.avakanta.com${url}`,
}));

const mockedUpload = vi.mocked(clientApi.uploadAvatar);
const mockedUpdate = vi.mocked(clientApi.updateProfile);

beforeEach(() => vi.clearAllMocks());

function makeFile(name = "avatar.jpg"): File {
  return new File(["img"], name, { type: "image/jpeg" });
}

// ─── uploadClientAvatarAction ─────────────────────────────────────────────────

describe("uploadClientAvatarAction", () => {
  it("éxito con avatar_medium → retorna avatarUrl con URL absoluta", async () => {
    mockedUpload.mockResolvedValueOnce({
      data: { avatar_medium: "/media/avatars/7/small.webp", avatar: "/media/avatars/7/orig.jpg" },
    } as never);

    const result = await uploadClientAvatarAction(makeFile());

    expect(result.avatarUrl).toBe("https://api.avakanta.com/media/avatars/7/small.webp");
  });

  it("éxito sin avatar_medium → usa avatar como fallback", async () => {
    mockedUpload.mockResolvedValueOnce({
      data: { avatar_medium: null, avatar: "/media/avatars/7/orig.jpg" },
    } as never);

    const result = await uploadClientAvatarAction(makeFile());

    expect(result.avatarUrl).toBe("https://api.avakanta.com/media/avatars/7/orig.jpg");
  });

  it("error instanceof Error → rethrows con el mensaje original", async () => {
    mockedUpload.mockRejectedValueOnce(new Error("413 Payload Too Large"));

    await expect(uploadClientAvatarAction(makeFile())).rejects.toThrow("413 Payload Too Large");
  });

  it("error no-Error → mensaje genérico", async () => {
    mockedUpload.mockRejectedValueOnce({ status: 500 });

    await expect(uploadClientAvatarAction(makeFile())).rejects.toThrow(
      "Error al subir la foto de perfil"
    );
  });
});

// ─── deleteClientAvatarAction ─────────────────────────────────────────────────

describe("deleteClientAvatarAction", () => {
  it("éxito → resuelve void", async () => {
    mockedUpdate.mockResolvedValueOnce(undefined as never);

    await expect(deleteClientAvatarAction()).resolves.toBeUndefined();
    expect(mockedUpdate).toHaveBeenCalledWith({ avatar: "" });
  });

  it("error instanceof Error → rethrows con el mensaje original", async () => {
    mockedUpdate.mockRejectedValueOnce(new Error("Forbidden"));

    await expect(deleteClientAvatarAction()).rejects.toThrow("Forbidden");
  });

  it("error no-Error → mensaje genérico", async () => {
    mockedUpdate.mockRejectedValueOnce({ status: 403 });

    await expect(deleteClientAvatarAction()).rejects.toThrow(
      "Error al eliminar la foto de perfil"
    );
  });
});
