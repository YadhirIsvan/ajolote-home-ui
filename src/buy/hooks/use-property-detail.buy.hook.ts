import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPropertyDetailAction } from "@/buy/actions/get-property-detail.actions";
import { scheduleAppointmentAction } from "@/buy/actions/schedule-appointment.actions";
import { getAppointmentSlotsAction } from "@/buy/actions/get-appointment-slots.actions";
import { getFinancialProfileAction } from "@/buy/actions/get-financial-profile.actions";
import { FINANCIAL_PROFILE_QUERY_KEY } from "@/shared/actions/save-financial-profile.actions";
import { checkSavedPropertyAction } from "@/buy/actions/check-saved-property.buy.actions";
import { toggleSavedPropertyAction } from "@/buy/actions/toggle-saved-property.buy.actions";
import { updateUserPhoneAction } from "@/buy/actions/update-user-phone.buy.actions";
import { useAuth } from "@/shared/hooks/auth.context";
import type { AppointmentResponse, AppointmentSlot } from "@/buy/types/property.types";

export const PROPERTY_DETAIL_QUERY_KEY = "buy-property-detail";
const SAVED_PROPERTY_QUERY_KEY = "buy-saved-property";

export const usePropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numId = id ? parseInt(id, 10) : NaN;
  const queryClient = useQueryClient();

  const { isAuthenticated, user, syncAuthState } = useAuth();

  // ── Modal / UI state ──────────────────────────────────────────────
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);

  // ── Appointment state ─────────────────────────────────────────────
  const [successData, setSuccessData] = useState<AppointmentResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [phoneFlowError, setPhoneFlowError] = useState<string | null>(null);

  // ── Saved property state ──────────────────────────────────────────
  const [showSaveAuthModal, setShowSaveAuthModal] = useState(false);

  // ── Agent call state ──────────────────────────────────────────────
  const [showCallConfirmModal, setShowCallConfirmModal] = useState(false);
  const [agentPhoneToCall, setAgentPhoneToCall] = useState<string>("");

  // ── Financial profile query ───────────────────────────────────────
  const { data: financialProfileData, isLoading: loadingProfile } = useQuery({
    queryKey: [FINANCIAL_PROFILE_QUERY_KEY],
    queryFn: getFinancialProfileAction,
    enabled: isAuthenticated,
    select: (result) => result.profile,
    staleTime: 0,
    retry: false,
  });
  const financialProfile = financialProfileData ?? null;

  // ── Property detail query ─────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: [PROPERTY_DETAIL_QUERY_KEY, numId],
    queryFn: () => getPropertyDetailAction(numId),
    enabled: !isNaN(numId),
    staleTime: 1000 * 60 * 10,
  });

  const property = data?.data ?? null;

  // ── Saved property query ──────────────────────────────────────────
  const { data: savedPropertyData } = useQuery({
    queryKey: [SAVED_PROPERTY_QUERY_KEY, numId],
    queryFn: () => checkSavedPropertyAction(numId),
    enabled: !!property?.id && isAuthenticated && !isNaN(numId),
    staleTime: 0,
  });
  const isSaved = savedPropertyData?.isSaved ?? false;

  // ── Derived display values ────────────────────────────────────────
  const truncatedDescription = property?.description
    ? property.description.slice(0, 250) + "..."
    : "";
  const displayImages = property?.images?.length ? property.images : ["/placeholder.svg"];
  const nearbyPOIs = property?.nearbyPlaces ?? [];
  const hasVideoTour = !!(property?.videoId || property?.videoImg);

  // ── Mutations ────────────────────────────────────────────────────

  const slotsMutation = useMutation({
    mutationFn: ({ propertyId, date }: { propertyId: number; date: string }) =>
      getAppointmentSlotsAction(propertyId, date),
  });

  const updatePhoneMutation = useMutation({
    mutationFn: (phone: string) => updateUserPhoneAction({ phone }),
  });

  const scheduleAppointmentMutation = useMutation({
    mutationFn: (params: { propertyId: number; data: Parameters<typeof scheduleAppointmentAction>[1] }) =>
      scheduleAppointmentAction(params.propertyId, params.data),
  });

  const toggleSavedPropertyMutation = useMutation({
    mutationFn: ({ propertyId, currentlySaved }: { propertyId: number; currentlySaved: boolean }) =>
      toggleSavedPropertyAction(propertyId, currentlySaved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SAVED_PROPERTY_QUERY_KEY, numId] });
    },
  });

  const isScheduling = updatePhoneMutation.isPending || scheduleAppointmentMutation.isPending;
  const slotsLoading = slotsMutation.isPending;
  const savingInProgress = toggleSavedPropertyMutation.isPending;

  // ── Handlers ─────────────────────────────────────────────────────

  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
    const dateStr = date.toISOString().split("T")[0];
    const result = await slotsMutation.mutateAsync({ propertyId: numId, date: dateStr });
    if (result.success && result.data) {
      setAvailableSlots(result.data.available_slots || []);
    } else {
      setAvailableSlots([]);
    }
  };

  const handleScheduleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowScheduleModal(true);
    }
  };

  const handleAuthSuccess = async () => {
    await syncAuthState();
    setShowAuthModal(false);
    setShowScheduleModal(true);
  };

  const handleSaveAuthSuccess = async () => {
    await syncAuthState();
    setShowSaveAuthModal(false);
    await performToggleSave();
  };

  // ── Agent contact handlers ────────────────────────────────────────
  const handleCallClick = (phoneNumber: string) => {
    setAgentPhoneToCall(phoneNumber);
    setShowCallConfirmModal(true);
  };

  const handleConfirmCall = () => {
    if (agentPhoneToCall) {
      window.location.href = `tel:${agentPhoneToCall}`;
    }
    setShowCallConfirmModal(false);
  };

  // Step 1: user pressed "Confirmar Cita" → open phone confirmation first
  const handleOpenPhoneConfirm = () => {
    if (!selectedDate || !selectedTime || isNaN(numId)) return;
    setPhoneFlowError(null);
    setShowScheduleModal(false);
    setShowPhoneConfirmModal(true);
  };

  // Step 2: runs after phone is confirmed/updated in the modal
  const handleConfirmPhoneAndSchedule = async (finalPhone: string) => {
    if (!selectedDate || !selectedTime || isNaN(numId)) return;

    setPhoneFlowError(null);

    if (finalPhone !== (user?.phone ?? "")) {
      const updateResult = await updatePhoneMutation.mutateAsync(finalPhone);
      if (!updateResult.success) {
        setPhoneFlowError(updateResult.message ?? "No se pudo guardar el teléfono.");
        return;
      }
      await syncAuthState();
    }

    const name =
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
      user?.email ||
      "";
    const dateStr = selectedDate.toISOString().split("T")[0];

    const result = await scheduleAppointmentMutation.mutateAsync({
      propertyId: numId,
      data: {
        date: dateStr,
        time: selectedTime,
        name,
        phone: finalPhone,
        email: user?.email ?? "",
      },
    });

    if (result.success && result.data) {
      setShowPhoneConfirmModal(false);
      setSelectedDate(undefined);
      setSelectedTime(null);
      setSuccessData(result.data);
      setShowSuccessModal(true);
    } else {
      setPhoneFlowError(result.message);
    }
  };

  // ── Saved property handlers ───────────────────────────────────────
  const performToggleSave = async () => {
    if (!property?.id || savingInProgress) return;
    await toggleSavedPropertyMutation.mutateAsync({
      propertyId: property.id,
      currentlySaved: isSaved,
    });
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      setShowSaveAuthModal(true);
      return;
    }
    await performToggleSave();
  };

  return {
    property,
    isLoading,
    isError: isError || isNaN(numId),
    // Description / images
    showFullDescription,
    setShowFullDescription,
    truncatedDescription,
    displayImages,
    nearbyPOIs,
    hasVideoTour,
    // Modals
    showScheduleModal,
    setShowScheduleModal,
    showAuthModal,
    setShowAuthModal,
    showSuccessModal,
    setShowSuccessModal,
    showVideoModal,
    setShowVideoModal,
    showPhoneConfirmModal,
    setShowPhoneConfirmModal,
    // Appointment
    successData,
    selectedDate,
    setSelectedDate,
    handleDateSelect,
    selectedTime,
    setSelectedTime,
    availableSlots,
    slotsLoading,
    handleScheduleClick,
    handleAuthSuccess,
    handleOpenPhoneConfirm,
    handleConfirmPhoneAndSchedule,
    isScheduling,
    phoneFlowError,
    currentUserPhone: user?.phone ?? "",
    // Saved property
    isSaved,
    savingInProgress,
    showSaveAuthModal,
    setShowSaveAuthModal,
    handleToggleSave,
    handleSaveAuthSuccess,
    // Agent contact
    showCallConfirmModal,
    setShowCallConfirmModal,
    agentPhoneToCall,
    handleCallClick,
    handleConfirmCall,
    // Financial profile
    financialProfile,
    loadingProfile,
    showMortgageCalculator: isAuthenticated && !loadingProfile && financialProfile !== null,
  };
};
