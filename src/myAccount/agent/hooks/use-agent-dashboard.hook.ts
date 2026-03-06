import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAgentPropertiesAction } from "@/myAccount/agent/actions/get-agent-properties.actions";
import { getAgentAppointmentsAction } from "@/myAccount/agent/actions/get-agent-appointments.actions";
import { getAgentDashboardAction } from "@/myAccount/agent/actions/get-agent-dashboard.actions";
import type { AgentProperty, AgentAppointment } from "@/myAccount/agent/types/agent.types";

export const useAgentDashboard = () => {
  const [selectedProperty, setSelectedProperty] = useState<AgentProperty | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<AgentAppointment[] | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: getAgentDashboardAction,
    staleTime: 0,
    refetchInterval: 5000, // Refetch cada 5 segundos
  });

  const propertiesQuery = useQuery({
    queryKey: ["agent-properties"],
    queryFn: getAgentPropertiesAction,
    staleTime: 0, // Los datos se consideran "stale" inmediatamente
    refetchInterval: 5000, // Refetch automático cada 5 segundos cuando la ventana esté activa
  });

  const appointmentsQuery = useQuery({
    queryKey: ["agent-appointments"],
    queryFn: getAgentAppointmentsAction,
    staleTime: 0,
    refetchInterval: 5000,
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

  const refetchAll = () => {
    dashboardQuery.refetch();
    propertiesQuery.refetch();
    appointmentsQuery.refetch();
  };

  return {
    dashboard: dashboardQuery.data ?? null,
    properties: propertiesQuery.data ?? [],
    propertiesLoading: propertiesQuery.isLoading,
    appointments,
    appointmentsLoading: appointmentsQuery.isLoading,
    selectedProperty,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    handlePropertyClick,
    handleStatusChange,
    refetchAll, // ✅ Agregamos función para refrescar manualmente
  };
};
