import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPropertyDetailAction } from "@/buy/actions/get-property-detail.actions";
import { scheduleAppointmentAction } from "@/buy/actions/schedule-appointment.actions";
import { getAppointmentSlotsAction } from "@/buy/actions/get-appointment-slots.actions";
import type { AppointmentResponse, AppointmentSlot } from "@/buy/types/property.types";

export const PROPERTY_DETAIL_QUERY_KEY = "buy-property-detail";
export const APPOINTMENT_SLOTS_QUERY_KEY = "buy-appointment-slots";

export const usePropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numId = id ? parseInt(id, 10) : NaN;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCallConfirmModal, setShowCallConfirmModal] = useState(false);
  const [successData, setSuccessData] = useState<AppointmentResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [agentPhoneToCall, setAgentPhoneToCall] = useState<string>("");

  const { data, isLoading, isError } = useQuery({
    queryKey: [PROPERTY_DETAIL_QUERY_KEY, numId],
    queryFn: () => getPropertyDetailAction(numId),
    enabled: !isNaN(numId),
    staleTime: 1000 * 60 * 10,
  });

  // Fetch appointment slots when date changes
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSlotsLoading(true);

    try {
      const dateStr = date.toISOString().split("T")[0];
      const result = await getAppointmentSlotsAction(numId, dateStr);
      if (result.success && result.data) {
        setAvailableSlots(result.data.available_slots || []);
      } else {
        setAvailableSlots([]);
      }
    } catch {
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const property = data?.data ?? null;

  const truncatedDescription = property?.description
    ? property.description.slice(0, 80) + "..."
    : "";
  const displayImages = property?.images?.length
    ? property.images
    : ["/placeholder.svg"];
  const nearbyPOIs = property?.["nearby-places"] ?? [];
  const hasVideoTour = !!(property?.video_id || property?.video_img);

  // Verifica auth leyendo localStorage (igual que useAuth)
  const isAuthenticated = !!localStorage.getItem("access_token");

  // Bug 1: Si no está autenticado, abre modal de login en vez del modal de cita
  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowScheduleModal(true);
    }
  };

  // Después de login exitoso, abre directo el modal de cita
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setShowScheduleModal(true);
  };

  // Maneja clic en botón de llamada - muestra confirmación
  const handleCallClick = (phoneNumber: string) => {
    setAgentPhoneToCall(phoneNumber);
    setShowCallConfirmModal(true);
  };

  // Confirma la llamada y redirecciona a tel:
  const handleConfirmCall = () => {
    if (agentPhoneToCall) {
      window.location.href = `tel:${agentPhoneToCall}`;
      setShowCallConfirmModal(false);
    }
  };

  // Bug 2: Ahora sí llama a la API para guardar la cita
  const handleConfirmAppointment = async () => {
    if (!selectedDate || !selectedTime || isNaN(numId)) return;

    let user: { first_name?: string; last_name?: string; phone?: string | null; email?: string } | null = null;
    try {
      user = JSON.parse(localStorage.getItem("user") ?? "null");
    } catch {
      user = null;
    }

    const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.email || "";
    const dateStr = selectedDate.toISOString().split("T")[0];

    setIsScheduling(true);
    setScheduleError(null);

    const result = await scheduleAppointmentAction(numId, {
      date: dateStr,
      time: selectedTime,
      name,
      phone: user?.phone ?? "",
      email: user?.email ?? "",
    });

    setIsScheduling(false);

    if (result.success && result.data) {
      setShowScheduleModal(false);
      setSelectedDate(undefined);
      setSelectedTime(null);
      setSuccessData(result.data);
      setShowSuccessModal(true); // Bug 3: muestra diálogo de éxito
    } else {
      setScheduleError(result.message);
    }
  };

  return {
    property,
    isLoading,
    isError: isError || isNaN(numId),
    showFullDescription,
    setShowFullDescription,
    showScheduleModal,
    setShowScheduleModal,
    showAuthModal,
    setShowAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    showVideoModal,
    setShowVideoModal,
    showCallConfirmModal,
    setShowCallConfirmModal,
    successData,
    selectedDate,
    setSelectedDate,
    handleDateSelect,
    selectedTime,
    setSelectedTime,
    availableSlots,
    slotsLoading,
    truncatedDescription,
    displayImages,
    nearbyPOIs,
    hasVideoTour,
    handleScheduleClick,
    handleAuthSuccess,
    handleConfirmAppointment,
    handleCallClick,
    handleConfirmCall,
    isScheduling,
    scheduleError,
  };
};
