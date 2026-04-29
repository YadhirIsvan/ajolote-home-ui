import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { AppointmentSlotsResponse } from "@/buy/types/property.types";

export interface GetAppointmentSlotsResponse {
  success: boolean;
  data?: AppointmentSlotsResponse;
  message?: string;
}

export const getAppointmentSlotsAction = async (
  propertyId: number,
  date: string
): Promise<GetAppointmentSlotsResponse> => {
  try {
    const { data } = await buyApi.get<AppointmentSlotsResponse>(
      `${ENDPOINTS.APPOINTMENT_SLOTS}?property_id=${propertyId}&date=${date}`
    );
    return { success: true, data };
  } catch (error) {
    console.error("[getAppointmentSlotsAction] Error al obtener horarios:", error);
    return {
      success: false,
      message: "No se pudieron obtener los horarios disponibles.",
    };
  }
};
