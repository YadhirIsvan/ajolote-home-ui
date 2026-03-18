import { useState } from "react";
import { Clock, CheckCircle, XCircle, RefreshCw, Play, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import AppointmentStatusSheet from "@/myAccount/agent/components/AppointmentStatusSheet";
import EmptyState from "@/myAccount/agent/components/EmptyState";
import type { AgentAppointment, AppointmentStatus } from "@/myAccount/agent/types/agent.types";

interface AppointmentKanbanProps {
  appointments: AgentAppointment[];
  onStatusChange: (id: number, newStatus: AppointmentStatus) => void;
}

const statusOrder: AppointmentStatus[] = [
  "programada",
  "confirmada",
  "en_progreso",
  "completada",
  "cancelada",
  "reagendada",
];

const statusConfig: Record<
  AppointmentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  programada: { label: "Programadas", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: Clock },
  confirmada: { label: "Confirmadas", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", icon: CheckCircle },
  en_progreso: { label: "En Progreso", color: "text-champagne-gold", bgColor: "bg-champagne-gold/10", borderColor: "border-champagne-gold/30", icon: Play },
  completada: { label: "Completadas", color: "text-gray-600", bgColor: "bg-gray-100", borderColor: "border-gray-200", icon: CheckCircle },
  cancelada: { label: "Canceladas", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", icon: XCircle },
  reagendada: { label: "Reagendadas", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", icon: RefreshCw },
  no_show: { label: "No Show", color: "text-gray-500", bgColor: "bg-gray-50", borderColor: "border-gray-200", icon: XCircle },
};

interface KanbanCardProps {
  appointment: AgentAppointment;
  onClick: () => void;
  compact?: boolean;
}

const KanbanCard = ({ appointment, onClick, compact = false }: KanbanCardProps) => {
  const config = statusConfig[appointment.status];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "p-3 cursor-pointer transition-all duration-300 border-border/30 bg-white",
        "hover:border-champagne-gold/50 hover:shadow-lg hover:-translate-y-0.5",
        "active:scale-[0.98]"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn("font-bold text-champagne-gold", compact ? "text-sm" : "text-base")}>
          {appointment.time}
        </span>
        <span className="text-xs text-foreground/50">{appointment.date}</span>
      </div>

      <h4
        className={cn(
          "font-semibold text-midnight truncate",
          compact ? "text-sm mb-1" : "text-base mb-2"
        )}
      >
        {appointment.client}
      </h4>

      <div className="flex items-center gap-1.5 text-foreground/60">
        <MapPin className={cn("flex-shrink-0", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
        <span className={cn("truncate", compact ? "text-xs" : "text-sm")}>
          {appointment.property}
        </span>
      </div>

      {!compact && (
        <Badge className={cn("mt-3 gap-1", config.bgColor, config.color)}>
          <config.icon className="w-3 h-3" />
          {config.label}
        </Badge>
      )}
    </Card>
  );
};

const AppointmentKanban = ({ appointments, onStatusChange }: AppointmentKanbanProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<AppointmentStatus>("programada");
  const [selectedAppointment, setSelectedAppointment] = useState<AgentAppointment | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const getByStatus = (status: AppointmentStatus) =>
    appointments.filter((apt) => apt.status === status);

  const handleAppointmentClick = (appointment: AgentAppointment) => {
    setSelectedAppointment(appointment);
    setIsSheetOpen(true);
  };

  const handleAdvanceStatus = () => {
    if (!selectedAppointment) return;
    const currentIndex = statusOrder.indexOf(selectedAppointment.status);
    if (currentIndex < statusOrder.length - 1 && currentIndex < 3) {
      onStatusChange(selectedAppointment.id, statusOrder[currentIndex + 1]);
    }
    setIsSheetOpen(false);
    setSelectedAppointment(null);
  };

  const handleRevertStatus = () => {
    if (!selectedAppointment) return;
    const currentIndex = statusOrder.indexOf(selectedAppointment.status);
    if (currentIndex > 0) {
      onStatusChange(selectedAppointment.id, statusOrder[currentIndex - 1]);
    }
    setIsSheetOpen(false);
    setSelectedAppointment(null);
  };

  const handleSwipe = (direction: "left" | "right") => {
    const currentIndex = statusOrder.indexOf(activeTab);
    if (direction === "right" && currentIndex < statusOrder.length - 1) {
      setActiveTab(statusOrder[currentIndex + 1]);
    } else if (direction === "left" && currentIndex > 0) {
      setActiveTab(statusOrder[currentIndex - 1]);
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setSelectedAppointment(null);
  };

  if (isMobile) {
    const currentAppointments = getByStatus(activeTab);
    const currentConfig = statusConfig[activeTab];

    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {statusOrder.map((status) => {
              const config = statusConfig[status];
              const count = getByStatus(status).length;
              const Icon = config.icon;
              const isActive = activeTab === status;

              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 snap-start min-h-[44px]",
                    isActive
                      ? "bg-midnight text-white shadow-lg scale-105"
                      : "bg-white border border-border/50 text-foreground/70 hover:border-champagne-gold/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-5 min-w-[20px] text-xs",
                      isActive ? "bg-white/20 text-white" : "bg-muted"
                    )}
                  >
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={() => handleSwipe("left")}
              disabled={statusOrder.indexOf(activeTab) === 0}
              className={cn(
                "p-2 rounded-full transition-all",
                statusOrder.indexOf(activeTab) === 0
                  ? "opacity-30"
                  : "bg-muted hover:bg-champagne-gold/10"
              )}
            >
              <ChevronLeft className="w-5 h-5 text-foreground/60" />
            </button>
            <div className="flex gap-1.5">
              {statusOrder.map((status) => (
                <div
                  key={status}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeTab === status ? "bg-champagne-gold w-6" : "bg-muted"
                  )}
                />
              ))}
            </div>
            <button
              onClick={() => handleSwipe("right")}
              disabled={statusOrder.indexOf(activeTab) === statusOrder.length - 1}
              className={cn(
                "p-2 rounded-full transition-all",
                statusOrder.indexOf(activeTab) === statusOrder.length - 1
                  ? "opacity-30"
                  : "bg-muted hover:bg-champagne-gold/10"
              )}
            >
              <ChevronRight className="w-5 h-5 text-foreground/60" />
            </button>
          </div>
        </div>

        <div className="space-y-3 animate-fade-in">
          {currentAppointments.length === 0 ? (
            <EmptyState
              type="appointments"
              message={`No hay citas ${currentConfig.label.toLowerCase()}`}
            />
          ) : (
            currentAppointments.map((apt) => (
              <KanbanCard
                key={apt.id}
                appointment={apt}
                onClick={() => handleAppointmentClick(apt)}
              />
            ))
          )}
        </div>

        <AppointmentStatusSheet
          isOpen={isSheetOpen}
          onClose={closeSheet}
          appointment={selectedAppointment}
          onAdvance={handleAdvanceStatus}
          onRevert={handleRevertStatus}
          isMobile={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-4 min-h-[500px]">
        {statusOrder.map((status) => {
          const config = statusConfig[status];
          const columnAppointments = getByStatus(status);
          const Icon = config.icon;

          return (
            <div key={status} className="flex flex-col">
              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-t-xl border-b-2",
                  "bg-midnight text-white",
                  config.borderColor
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-semibold text-sm">{config.label}</span>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  {columnAppointments.length}
                </Badge>
              </div>

              <div
                className={cn(
                  "flex-1 p-3 space-y-3 rounded-b-xl border border-t-0 bg-muted/20",
                  config.borderColor
                )}
              >
                {columnAppointments.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-foreground/40 italic">
                    Sin citas
                  </div>
                ) : (
                  columnAppointments.map((apt) => (
                    <KanbanCard
                      key={apt.id}
                      appointment={apt}
                      onClick={() => handleAppointmentClick(apt)}
                      compact
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AppointmentStatusSheet
        isOpen={isSheetOpen}
        onClose={closeSheet}
        appointment={selectedAppointment}
        onAdvance={handleAdvanceStatus}
        onRevert={handleRevertStatus}
        isMobile={false}
      />
    </div>
  );
};

export default AppointmentKanban;
