import { clientApi } from "@/myAccount/client/api/client.api";

export const uploadClientPropertyFilesAction = async (
  processId: number,
  files: File[]
): Promise<void> => {
  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
      await clientApi.uploadPropertyFiles(processId, formData);
    }
  } catch (error) {
    console.error("[uploadClientPropertyFilesAction] Error al subir documentos:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al subir los documentos"
    );
  }
};
