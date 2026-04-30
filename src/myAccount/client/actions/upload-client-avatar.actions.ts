import { clientApi } from "@/myAccount/client/api/client.api";
import { getMediaUrl } from "@/shared/utils/media-url.utils";

export const uploadClientAvatarAction = async (file: File): Promise<{ avatarUrl: string }> => {
  try {
    const { data } = await clientApi.uploadAvatar(file);
    return { avatarUrl: getMediaUrl(data.avatar_medium ?? data.avatar) };
  } catch (error) {
    console.error("[uploadClientAvatarAction] Error al subir avatar:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al subir la foto de perfil"
    );
  }
};

export const deleteClientAvatarAction = async (): Promise<void> => {
  try {
    await clientApi.updateProfile({ avatar: "" });
  } catch (error) {
    console.error("[deleteClientAvatarAction] Error al eliminar avatar:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al eliminar la foto de perfil"
    );
  }
};
