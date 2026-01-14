import { useState } from "react";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Home,
  Tag,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  date: string;
  time: string;
  client: string;
  property: string;
  agent: string;
  type: string;
  typeColor: string;
}

const mockAppointments: Appointment[] = [
  { id: "1", date: "2026-01-14", time: "10:00", client: "María García", property: "Casa en Polanco", agent: "Carlos Mendoza", type: "Primera Visita", typeColor: "bg-blue-100 text-blue-700" },
  { id: "2", date: "2026-01-14", time: "14:00", client: "Juan López", property: "Depto Roma Norte", agent: "Laura Sánchez", type: "Seguimiento", typeColor: "bg-green-100 text-green-700" },
  { id: "3", date: "2026-01-15", time: "11:00", client: "Ana Martínez", property: "Penthouse Santa Fe", agent: "Roberto Díaz", type: "Cierre de Contrato", typeColor: "bg-champagne-gold/20 text-champagne-gold-dark" },
  { id: "4", date: "2026-01-16", time: "09:00", client: "Pedro Hernández", property: "Casa en Polanco", agent: "Carlos Mendoza", type: "Primera Visita", typeColor: "bg-blue-100 text-blue-700" },
  { id: "5", date: "2026-01-17", time: "16:00", client: "Sofía Ruiz", property: "Depto Roma Norte", agent: "Laura Sánchez", type: "Entrega de Llaves", typeColor: "bg-purple-100 text-purple-700" },
  { id: "6", date: "2026-01-20", time: "10:00", client: "Carlos Mendez", property: "Penthouse Santa Fe", agent: "Roberto Díaz", type: "Seguimiento", typeColor: "bg-green-100 text-green-700" },
];

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const CitasSection = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 14));
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockAppointments.filter(apt => apt.date === dateStr);
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailOpen(true);
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const AppointmentDetailContent = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-3 p-4 bg-champagne-gold/10 rounded-xl">
          <Clock className="w-6 h-6 text-champagne-gold" />
          <div>
            <p className="font-bold text-xl text-midnight">{selectedAppointment.time}</p>
            <p className="text-foreground/60">{new Date(selectedAppointment.date).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Tag className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Tipo de Cita</p>
              <Badge className={selectedAppointment.typeColor}>{selectedAppointment.type}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Home className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Propiedad</p>
              <p className="font-medium text-midnight">{selectedAppointment.property}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <User className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Cliente</p>
              <p className="font-medium text-midnight">{selectedAppointment.client}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Users className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Agente Asignado</p>
              <p className="font-medium text-midnight">{selectedAppointment.agent}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="gold" className="flex-1">
            Editar Cita
          </Button>
          <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50">
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Calendario de Citas</h1>
        <p className="text-foreground/60">Vista maestra de todas las citas</p>
      </div>

      {/* Calendar Card */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-xl text-midnight">
              {MONTHS[month]} {year}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-foreground/60 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="min-h-[80px] md:min-h-[100px]" />;
              }

              const appointments = getAppointmentsForDay(day);
              const isToday = day === 14 && month === 0 && year === 2026;

              return (
                <div
                  key={day}
                  className={cn(
                    "min-h-[80px] md:min-h-[100px] border border-border/30 rounded-lg p-1 md:p-2",
                    isToday && "bg-champagne-gold/10 border-champagne-gold/50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isToday ? "text-champagne-gold" : "text-midnight"
                  )}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {appointments.slice(0, isMobile ? 1 : 2).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => handleAppointmentClick(apt)}
                        className={cn(
                          "w-full text-left p-1 rounded text-xs truncate transition-all hover:scale-105",
                          apt.typeColor
                        )}
                      >
                        {isMobile ? apt.time : `${apt.time} - ${apt.client}`}
                      </button>
                    ))}
                    {appointments.length > (isMobile ? 1 : 2) && (
                      <span className="text-xs text-foreground/50">
                        +{appointments.length - (isMobile ? 1 : 2)} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-midnight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-champagne-gold" />
            Citas de Hoy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAppointments.filter(apt => apt.date === "2026-01-14").map((apt) => (
            <div
              key={apt.id}
              onClick={() => handleAppointmentClick(apt)}
              className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30 cursor-pointer hover:border-champagne-gold/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-champagne-gold">{apt.time}</p>
                </div>
                <div>
                  <p className="font-medium text-midnight">{apt.client}</p>
                  <p className="text-sm text-foreground/60">{apt.property}</p>
                </div>
              </div>
              <Badge className={apt.typeColor}>{apt.type}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Appointment Detail Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Detalle de Cita</DrawerTitle>
            </DrawerHeader>
            <AppointmentDetailContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalle de Cita</DialogTitle>
            </DialogHeader>
            <AppointmentDetailContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CitasSection;
