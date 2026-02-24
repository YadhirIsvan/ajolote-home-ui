import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPropertyDetailAction } from "@/buy/actions/get-property-detail.actions";

export const PROPERTY_DETAIL_QUERY_KEY = "buy-property-detail";

export const usePropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numId = id ? parseInt(id, 10) : NaN;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [PROPERTY_DETAIL_QUERY_KEY, numId],
    queryFn: () => getPropertyDetailAction(numId),
    enabled: !isNaN(numId),
    staleTime: 1000 * 60 * 10,
  });

  const property = data?.data ?? null;

  const truncatedDescription = property?.description
    ? property.description.slice(0, 150) + "..."
    : "";
  const displayImages = property?.images?.length
    ? property.images
    : ["/placeholder.svg"];
  const nearbyPOIs = property?.["nearby-places"] ?? [];
  const hasVideoTour = !!(property?.video_id || property?.video_img);

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedTime) {
      setShowScheduleModal(false);
      setSelectedDate(undefined);
      setSelectedTime(null);
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
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    truncatedDescription,
    displayImages,
    nearbyPOIs,
    hasVideoTour,
    handleConfirmAppointment,
  };
};
