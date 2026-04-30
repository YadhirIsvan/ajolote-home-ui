import { useState } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, User, X, AlertTriangle, Home } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useClientAppointments } from "@/myAccount/client/hooks/use-client-appointments.client.hook";
import {
  formatDate,
  formatTime,
  getAppointmentStatusConfig,
} from "@/myAccount/client/utils/client.utils";
import { CANCELLABLE_APPOINTMENT_STATUSES } from "@/myAccount/client/constants/client.constants";

interface ClientCitasProps {
  onBack: () => void;
}

const ClientCitas = ({ onBack }: ClientCitasProps) => {
  const { appointments, isLoading, cancelAppointment, isCancelling } = useClientAppointments();
  const [cancelId, setCancelId] = useState<number | null>(null);

  const handleConfirmCancel = () => {
    if (cancelId !== null) {
      cancelAppointment({ id: cancelId });
      setCancelId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-[hsl(var(--champagne-gold))] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </button>

      <div>
        <h1 className="text-2xl font-bold text-midnight">Mis Citas</h1>
        <p className="text-sm text-foreground/50 mt-1">
          {isLoading ? "Cargando..." : `${appointments.length} citas registradas`}
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <Card className="border border-border/20 rounded-2xl">
          <CardContent className="p-10 text-center">
            <Calendar className="w-10 h-10 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/50 text-sm">
              No tienes citas agendadas todavía.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const config = getAppointmentStatusConfig(apt.status);
            const canCancel = CANCELLABLE_APPOINTMENT_STATUSES.has(apt.status);

            return (
              <Card
                key={apt.id}
                className="border border-border/20 bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Property image */}
                    <div className="sm:w-40 h-36 sm:h-auto bg-secondary/20 relative flex-shrink-0">
                      {apt.property_image ? (
                        <img
                          src={apt.property_image}
                          alt={apt.property_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-8 h-8 text-foreground/15" />
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${config.className}`}>
                        {config.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-midnight truncate">
                            {apt.property_title}
                          </h3>
                          {apt.property_address && (
                            <div className="flex items-center gap-1.5 text-sm text-foreground/45 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{apt.property_address}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-foreground/30 font-mono shrink-0">
                          {apt.matricula}
                        </span>
                      </div>

                      {/* Date, time, agent */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/60">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-[hsl(var(--champagne-gold))]" />
                          <span>{formatDate(apt.scheduled_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[hsl(var(--champagne-gold))]" />
                          <span>
                            {formatTime(apt.scheduled_time)}
                            {apt.duration_minutes && ` (${apt.duration_minutes} min)`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-[hsl(var(--champagne-gold))]" />
                          <span>{apt.agent_name}</span>
                        </div>
                      </div>

                      {/* Cancel button */}
                      {canCancel && (
                        <div className="mt-4 pt-3 border-t border-border/10">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium px-3 h-8"
                            onClick={() => setCancelId(apt.id)}
                            disabled={isCancelling}
                          >
                            Cancelar cita
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel confirmation modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setCancelId(null)}
              className="absolute top-4 left-4 p-1.5 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <X className="w-5 h-5 text-foreground/50" />
            </button>

            <div className="text-center pt-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-midnight mb-2">
                ¿Cancelar esta cita?
              </h3>
              <p className="text-sm text-foreground/50 mb-6">
                Esta acción no se puede deshacer. El horario quedará disponible para otros clientes.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setCancelId(null)}
                >
                  No, mantener
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelando..." : "Sí, cancelar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCitas;
