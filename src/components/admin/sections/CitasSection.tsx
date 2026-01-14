import { useState } from "react";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Home,
  Tag,
  Users,
  Plus,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppointmentType {
  id: string;
  name: string;
  color: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  client: string;
  property: string;
  agent: string;
  typeId: string;
  notes: string;
}

const appointmentTypes: AppointmentType[] = [
  { id: "1", name: "Primera Visita", color: "bg-blue-100 text-blue-700" },
  { id: "2", name: "Seguimiento", color: "bg-green-100 text-green-700" },
  { id: "3", name: "Cierre de Contrato", color: "bg-champagne-gold/20 text-champagne-gold-dark" },
  { id: "4", name: "Entrega de Llaves", color: "bg-purple-100 text-purple-700" },
  { id: "5", name: "Avalúo", color: "bg-orange-100 text-orange-700" },
];

const mockAppointments: Appointment[] = [
  { id: "1", date: "2026-01-14", time: "10:00", client: "María García", property: "Casa en Polanco", agent: "Carlos Mendoza", typeId: "1", notes: "" },
  { id: "2", date: "2026-01-14", time: "14:00", client: "Juan López", property: "Depto Roma Norte", agent: "Laura Sánchez", typeId: "2", notes: "" },
  { id: "3", date: "2026-01-15", time: "11:00", client: "Ana Martínez", property: "Penthouse Santa Fe", agent: "Roberto Díaz", typeId: "3", notes: "" },
  { id: "4", date: "2026-01-16", time: "09:00", client: "Pedro Hernández", property: "Casa en Polanco", agent: "Carlos Mendoza", typeId: "1", notes: "" },
  { id: "5", date: "2026-01-17", time: "16:00", client: "Sofía Ruiz", property: "Depto Roma Norte", agent: "Laura Sánchez", typeId: "4", notes: "" },
  { id: "6", date: "2026-01-20", time: "10:00", client: "Carlos Mendez", property: "Penthouse Santa Fe", agent: "Roberto Díaz", typeId: "2", notes: "" },
];

const agents = ["Carlos Mendoza", "Laura Sánchez", "Roberto Díaz", "Ana Martínez"];
const properties = ["Casa en Polanco", "Depto Roma Norte", "Penthouse Santa Fe", "Casa en Coyoacán"];

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const emptyAppointment: Omit<Appointment, "id"> = {
  date: "",
  time: "10:00",
  client: "",
  property: "",
  agent: "",
  typeId: "1",
  notes: "",
};

const CitasSection = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 14));
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Appointment, "id">>(emptyAppointment);
  const [selectedDate, setSelectedDate] = useState<string>("");

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
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getTypeInfo = (typeId: string) => {
    return appointmentTypes.find(t => t.id === typeId) || appointmentTypes[0];
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailOpen(true);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setEditingId(null);
    setFormData({ ...emptyAppointment, date: dateStr });
    setIsFormOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setFormData({
      date: apt.date,
      time: apt.time,
      client: apt.client,
      property: apt.property,
      agent: apt.agent,
      typeId: apt.typeId,
      notes: apt.notes,
    });
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAppointments(prev => prev.map(a => 
        a.id === editingId ? { ...a, ...formData } : a
      ));
      toast.success("Cita actualizada");
    } else {
      const newApt: Appointment = {
        id: Date.now().toString(),
        ...formData,
      };
      setAppointments(prev => [...prev, newApt]);
      toast.success("Cita creada");
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setIsDetailOpen(false);
    toast.success("Cita eliminada");
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
    const typeInfo = getTypeInfo(selectedAppointment.typeId);

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
              <Badge className={typeInfo.color}>{typeInfo.name}</Badge>
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
          <Button variant="gold" className="flex-1" onClick={() => handleEdit(selectedAppointment)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => handleDelete(selectedAppointment.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  const FormContent = () => (
    <div className="space-y-5 p-4">
      <div className="space-y-2">
        <Label>Fecha</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Hora</Label>
        <Select value={formData.time} onValueChange={(v) => setFormData(prev => ({ ...prev, time: v }))}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Tipo de Cita</Label>
        <Select value={formData.typeId} onValueChange={(v) => setFormData(prev => ({ ...prev, typeId: v }))}>
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {appointmentTypes.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Cliente</Label>
        <Input
          value={formData.client}
          onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
          placeholder="Nombre del cliente"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Propiedad</Label>
        <Select value={formData.property} onValueChange={(v) => setFormData(prev => ({ ...prev, property: v }))}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Seleccionar propiedad" />
          </SelectTrigger>
          <SelectContent>
            {properties.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Agente Asignado</Label>
        <Select value={formData.agent} onValueChange={(v) => setFormData(prev => ({ ...prev, agent: v }))}>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Seleccionar agente" />
          </SelectTrigger>
          <SelectContent>
            {agents.map(a => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Notas (Opcional)</Label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Notas adicionales..."
          className="h-12"
        />
      </div>
    </div>
  );

  const todayAppointments = appointments.filter(apt => apt.date === "2026-01-14");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Calendario de Citas</h1>
          <p className="text-foreground/60">Vista maestra de todas las citas</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={() => { setEditingId(null); setFormData(emptyAppointment); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4" />
          Nueva Cita
        </Button>
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

              const dayAppointments = getAppointmentsForDay(day);
              const isToday = day === 14 && month === 0 && year === 2026;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[80px] md:min-h-[100px] border border-border/30 rounded-lg p-1 md:p-2 cursor-pointer hover:border-champagne-gold/50 transition-colors",
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
                    {dayAppointments.slice(0, isMobile ? 1 : 2).map((apt) => {
                      const typeInfo = getTypeInfo(apt.typeId);
                      return (
                        <button
                          key={apt.id}
                          onClick={(e) => { e.stopPropagation(); handleAppointmentClick(apt); }}
                          className={cn(
                            "w-full text-left p-1 rounded text-xs truncate transition-all hover:scale-105",
                            typeInfo.color
                          )}
                        >
                          {isMobile ? apt.time : `${apt.time} - ${apt.client}`}
                        </button>
                      );
                    })}
                    {dayAppointments.length > (isMobile ? 1 : 2) && (
                      <span className="text-xs text-foreground/50">
                        +{dayAppointments.length - (isMobile ? 1 : 2)} más
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
            Citas de Hoy ({todayAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayAppointments.length === 0 ? (
            <p className="text-center text-foreground/50 py-4">No hay citas programadas para hoy</p>
          ) : (
            todayAppointments.map((apt) => {
              const typeInfo = getTypeInfo(apt.typeId);
              return (
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
                      <p className="text-xs text-foreground/40">{apt.agent}</p>
                    </div>
                  </div>
                  <Badge className={typeInfo.color}>{typeInfo.name}</Badge>
                </div>
              );
            })
          )}
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

      {/* Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent className="max-h-[95vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId ? "Editar Cita" : "Nueva Cita"}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <FormContent />
            </div>
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSave} className="w-full h-12">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Cita" : "Nueva Cita"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CitasSection;
