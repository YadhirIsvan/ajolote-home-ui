import { Clock, CheckCircle, XCircle, RefreshCw, Play, MapPin, UserX } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/lib/utils";
import type { AgentAppointment } from "@/myAccount/agent/types/agent.types";

interface AppointmentCardProps {
  appointment: AgentAppointment;
  onCheckIn?: (id: number, checked: boolean) => void;
}

const statusConfig: Record<
  AgentAppointment["status"],
  { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  programada: { label: "Programada", color: "text-blue-600", bgColor: "bg-blue-50", icon: Clock },
  confirmada: { label: "Confirmada", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle },
  en_progreso: { label: "En Progreso", color: "text-champagne-gold", bgColor: "bg-champagne-gold/10", icon: Play },
  completada: { label: "Completada", color: "text-gray-600", bgColor: "bg-gray-100", icon: CheckCircle },
  cancelada: { label: "Cancelada", color: "text-red-600", bgColor: "bg-red-50", icon: XCircle },
  no_show: { label: "No se presentó", color: "text-gray-500", bgColor: "bg-gray-100", icon: UserX },
  reagendada: { label: "Reagendada", color: "text-orange-600", bgColor: "bg-orange-50", icon: RefreshCw },
};

const AppointmentCard = ({ appointment, onCheckIn }: AppointmentCardProps) => {
  const config = statusConfig[appointment.status];
  const StatusIcon = config.icon;
  const isActive = appointment.status === "en_progreso";

  return (
    <div
      className={cn(
        "p-4 md:p-5 rounded-2xl border-2 transition-all duration-200",
        isActive
          ? "border-champagne-gold bg-champagne-gold/5 shadow-lg shadow-champagne-gold/10"
          : "border-border/30 bg-white hover:border-champagne-gold/30"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center min-w-[56px] h-14 bg-champagne-gold/10 rounded-xl px-2">
            <span className="text-lg font-bold text-midnight leading-tight">
              {appointment.date.split(" ")[0]}
            </span>
            <span className="text-xs text-foreground/60">{appointment.date.split(" ")[1]}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-midnight text-base truncate">{appointment.client}</h4>
            <div className="flex items-center gap-1 text-sm text-foreground/60 mt-0.5">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{appointment.property}</span>
            </div>
            <p className="text-sm text-champagne-gold font-medium mt-1">{appointment.time}</p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
          <Badge className={cn("gap-1.5 px-3 py-1", config.bgColor, config.color)}>
            <StatusIcon className="w-3.5 h-3.5" />
            {config.label}
          </Badge>

          {(appointment.status === "confirmada" || appointment.status === "en_progreso") && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/50 hidden sm:inline">Check-in</span>
              <Switch
                checked={appointment.status === "en_progreso"}
                onCheckedChange={(checked) => onCheckIn?.(appointment.id, checked)}
                className="data-[state=checked]:bg-champagne-gold"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
