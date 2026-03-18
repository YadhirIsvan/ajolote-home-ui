import { axiosInstance } from "@/shared/api/axios.instance";

export interface CheckSavedPropertyResult {
  isSaved: boolean;
}

export const checkSavedPropertyAction = async (
  propertyId: number
): Promise<CheckSavedPropertyResult> => {
  try {
    const { data } = await axiosInstance.get<{ is_saved: boolean }>(
      `/client/saved-properties/check?property_id=${propertyId}`
    );
    return { isSaved: data.is_saved };
  } catch (error) {
    console.error("[checkSavedPropertyAction] Error al verificar propiedad guardada:", error);
    return { isSaved: false };
  }
};
