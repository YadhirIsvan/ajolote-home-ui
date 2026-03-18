import { axiosInstance } from "@/shared/api/axios.instance";

export interface ToggleSavedPropertyResult {
  success: boolean;
  isSaved: boolean;
}

export const toggleSavedPropertyAction = async (
  propertyId: number,
  currentlySaved: boolean
): Promise<ToggleSavedPropertyResult> => {
  try {
    if (currentlySaved) {
      await axiosInstance.delete(`/client/saved-properties/${propertyId}`);
      return { success: true, isSaved: false };
    } else {
      await axiosInstance.post("/client/saved-properties", { property_id: propertyId });
      return { success: true, isSaved: true };
    }
  } catch (error) {
    console.error("[toggleSavedPropertyAction] Error al guardar/quitar propiedad:", error);
    return { success: false, isSaved: currentlySaved };
  }
};
