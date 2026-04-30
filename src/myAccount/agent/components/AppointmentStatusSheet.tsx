import { ChevronRight, ChevronLeft, Clock, User, MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentAppointment } from "@/myAccount/agent/types/agent.types";
import {
  APPOINTMENT_STATUS_ORDER,
  APPOINTMENT_STATUS_LABELS,
} from "@/myAccount/agent/constants/agent.constants";

interface AppointmentStatusSheetProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AgentAppointment | null;
  onAdvance: () => void;
  onRevert: () => void;
  isMobile: boolean;
}

const AppointmentStatusSheet = ({
  isOpen,
  onClose,
  appointment,
  onAdvance,
  onRevert,
  isMobile,
}: AppointmentStatusSheetProps) => {
  if (!appointment) return null;

  const currentIndex = APPOINTMENT_STATUS_ORDER.indexOf(appointment.status);
  const canAdvance = currentIndex < 3 && currentIndex >= 0;
  const canRevert = currentIndex > 0;

  const nextStatus = canAdvance ? APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS_ORDER[currentIndex + 1]] : null;
  const prevStatus = canRevert ? APPOINTMENT_STATUS_LABELS[APPOINTMENT_STATUS_ORDER[currentIndex - 1]] : null;

  const content = (
    <div className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-champagne-gold/10 rounded-lg">
            <Clock className="w-5 h-5 text-champagne-gold" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Fecha y Hora</p>
            <p className="font-semibold text-midnight">
              {appointment.date} • {appointment.time}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-champagne-gold/10 rounded-lg">
            <User className="w-5 h-5 text-champagne-gold" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Cliente</p>
            <p className="font-semibold text-midnight">{appointment.client}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-champagne-gold/10 rounded-lg">
            <MapPin className="w-5 h-5 text-champagne-gold" />
          </div>
          <div>
            <p className="text-sm text-foreground/60">Propiedad</p>
            <p className="font-semibold text-midnight">{appointment.property}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-foreground/60 mb-2">Estado Actual</p>
        <Badge className="px-4 py-2 text-base bg-champagne-gold/10 text-champagne-gold border border-champagne-gold/30">
          {APPOINTMENT_STATUS_LABELS[appointment.status]}
        </Badge>
      </div>

      <div className="space-y-3">
        {canAdvance && (
          <Button
            onClick={onAdvance}
            variant="gold"
            className="w-full h-14 text-base font-semibold gap-2"
          >
            Avanzar a "{nextStatus}"
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}

        {canRevert && (
          <Button
            onClick={onRevert}
            variant="outline"
            className={cn(
              "w-full h-12 border-2 border-foreground/20 text-foreground/70 hover:bg-muted/50 gap-2"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            Regresar a "{prevStatus}"
          </Button>
        )}

        {!canAdvance && !canRevert && (
          <p className="text-center text-foreground/50 text-sm italic py-4">
            Esta cita no puede ser modificada
          </p>
        )}

        <Button onClick={onClose} variant="ghost" className="w-full h-11 text-foreground/60">
          Cancelar
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="px-6 pb-8">
          <DrawerHeader className="px-0 pt-4 pb-2">
            <DrawerTitle className="text-xl text-midnight font-bold">
              Cambiar Estado de Cita
            </DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-midnight font-bold">
            Cambiar Estado de Cita
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentStatusSheet;
