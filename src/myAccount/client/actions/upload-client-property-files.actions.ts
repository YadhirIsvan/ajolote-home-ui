import { clientApi } from "@/myAccount/client/api/client.api";

export const uploadClientPropertyFilesAction = async (
  processId: number,
  files: File[]
): Promise<void> => {
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
    await clientApi.uploadPropertyFiles(processId, formData);
  }
};
