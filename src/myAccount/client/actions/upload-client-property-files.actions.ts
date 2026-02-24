import { clientApi } from "@/myAccount/client/api/client.api";

export const uploadClientPropertyFilesAction = async (
  propertyId: number,
  files: File[]
): Promise<void> => {
  const formData = new FormData();
  files.forEach((f) => formData.append("file", f));
  await clientApi.uploadPropertyFiles(propertyId, formData);
};
