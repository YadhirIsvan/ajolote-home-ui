import { clientApi } from "@/myAccount/client/api/client.api";

export async function checkSavedPropertyAction(
  propertyId: number
): Promise<{ isSaved: boolean }> {
  try {
    const response = await clientApi.checkSavedProperty(propertyId);
    return { isSaved: response.data.is_saved };
  } catch {
    return { isSaved: false };
  }
}
