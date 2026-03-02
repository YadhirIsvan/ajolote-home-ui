import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgentPropertiesAction } from "@/myAccount/agent/actions/get-agent-properties.actions";
import { getAgentAppointmentsAction } from "@/myAccount/agent/actions/get-agent-appointments.actions";
import type { AgentProperty, AgentAppointment } from "@/myAccount/agent/types/agent.types";

export const useAgentDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState<AgentProperty | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<AgentAppointment[] | null>(null);

  const propertiesQuery = useQuery({
    queryKey: ["agent-properties"],
    queryFn: getAgentPropertiesAction,
  });

  const appointmentsQuery = useQuery({
    queryKey: ["agent-appointments"],
    queryFn: getAgentAppointmentsAction,
  });

  const appointments = localAppointments ?? appointmentsQuery.data ?? [];

  const handlePropertyClick = (property: AgentProperty) => {
    setSelectedProperty(property);
    setIsPropertyModalOpen(true);
  };

  const handleStatusChange = (id: number, newStatus: AgentAppointment["status"]) => {
    const base = localAppointments ?? appointmentsQuery.data ?? [];
    setLocalAppointments(
      base.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
  };

  return {
    properties: propertiesQuery.data ?? [],
    propertiesLoading: propertiesQuery.isLoading,
    appointments,
    appointmentsLoading: appointmentsQuery.isLoading,
    selectedProperty,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    handlePropertyClick,
    handleStatusChange,
  };
};
