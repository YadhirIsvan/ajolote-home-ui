import { buyApi, ENDPOINTS } from "@/buy/api/buy.api";
import type { AppointmentData, AppointmentResponse } from "@/buy/types/property.types";

export interface ScheduleAppointmentResponse {
  success: boolean;
  data?: AppointmentResponse;
  message: string;
}

const convertTo24h = (timeStr: string): string => {
  // If already in 24h format (HH:MM), return as-is
  if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
    const [hours, minutes] = timeStr.split(":");
    return `${String(parseInt(hours, 10)).padStart(2, "0")}:${minutes}`;
  }

  // If in 12h format (H:MM AM/PM), convert to 24h
  const [time, period] = timeStr.split(" ");
  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

export const scheduleAppointmentAction = async (
  propertyId: number,
  appointmentData: AppointmentData
): Promise<ScheduleAppointmentResponse> => {
  try {
    const payload = {
      date: appointmentData.date,
      time: convertTo24h(appointmentData.time),
      name: appointmentData.name,
      phone: appointmentData.phone,
      email: appointmentData.email,
    };
    const { data } = await buyApi.post<AppointmentResponse>(
      ENDPOINTS.SCHEDULE_APPOINTMENT(propertyId),
      payload
    );
    return {
      success: true,
      data,
      message: `Cita agendada para el ${data.scheduled_date} a las ${data.scheduled_time.slice(0, 5)}. Matrícula: ${data.matricula}`,
    };
  } catch (error) {
    console.error("[scheduleAppointmentAction] Error al agendar cita:", error);
    return {
      success: false,
      message: "No se pudo agendar la cita. Intenta de nuevo.",
    };
  }
};
