import { clientApi } from "@/myAccount/client/api/client.api";

export async function toggleSavedPropertyAction(
  propertyId: number,
  currentlySaved: boolean
): Promise<{ success: boolean; isSaved: boolean }> {
  try {
    if (currentlySaved) {
      await clientApi.unsaveProperty(propertyId);
      return { success: true, isSaved: false };
    } else {
      await clientApi.saveProperty(propertyId);
      return { success: true, isSaved: true };
    }
  } catch (error) {
    console.error("Error toggling saved property:", error);
    return { success: false, isSaved: currentlySaved };
  }
}
