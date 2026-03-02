import { useState, useMemo } from "react";
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
  Save,
  Search,
  AlertCircle,
  FileText,
  Timer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppointmentType {
  id: string;
  name: string;
  color: string;
  defaultDuration: number; // in minutes
}

interface Client {
  id: string;
  name: string;
  matricula: string;
  assignedAgent: string;
  phone?: string;
  email?: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  client: string;
  clientId: string;
  property: string;
  agent: string;
  typeId: string;
  duration: number;
  notes: string;
}

const appointmentTypes: AppointmentType[] = [
  { id: "1", name: "Primera Visita", color: "bg-blue-100 text-blue-700", defaultDuration: 60 },
  { id: "2", name: "Seguimiento", color: "bg-green-100 text-green-700", defaultDuration: 45 },
  { id: "3", name: "Cierre de Contrato", color: "bg-champagne-gold/20 text-champagne-gold-dark", defaultDuration: 90 },
  { id: "4", name: "Entrega de Llaves", color: "bg-purple-100 text-purple-700", defaultDuration: 30 },
  { id: "5", name: "Avalúo", color: "bg-orange-100 text-orange-700", defaultDuration: 120 },
];

const agents: string[] = [];
const properties: string[] = [];

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const ALL_TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

const DURATION_OPTIONS = [
  { value: 30, label: "30 minutos" },
  { value: 45, label: "45 minutos" },
  { value: 60, label: "1 hora" },
  { value: 90, label: "1 hora 30 min" },
  { value: 120, label: "2 horas" },
];

interface FormData {
  date: string;
  time: string;
  clientId: string;
  client: string;
  property: string;
  agent: string;
  typeId: string;
  duration: number;
  notes: string;
}

const emptyFormData: FormData = {
  date: "",
  time: "",
  clientId: "",
  client: "",
  property: "",
  agent: "",
  typeId: "1",
  duration: 60,
  notes: "",
};

const CitasSection = () => {
  const isMobile = useIsMobile();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [clientSearch, setClientSearch] = useState("");
  const [isClientSearchFocused, setIsClientSearchFocused] = useState(false);
  const [isFromCalendarClick, setIsFromCalendarClick] = useState(false);

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

  // Filter clients by search (name or matricula)
  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return [];
    const searchLower = clientSearch.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(searchLower) ||
      c.matricula.toLowerCase().includes(searchLower)
    );
  }, [clientSearch, clients]);

  // Get unavailable time slots for a specific agent and date
  const getUnavailableSlots = useMemo(() => {
    if (!formData.agent || !formData.date) return new Set<string>();
    
    const agentAppointments = appointments.filter(
      apt => apt.agent === formData.agent && apt.date === formData.date && apt.id !== editingId
    );
    
    const unavailable = new Set<string>();
    
    agentAppointments.forEach(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + apt.duration;
      
      ALL_TIME_SLOTS.forEach(slot => {
        const [slotHours, slotMinutes] = slot.split(':').map(Number);
        const slotStartMinutes = slotHours * 60 + slotMinutes;
        const slotEndMinutes = slotStartMinutes + formData.duration;
        
        // Check if this slot overlaps with any existing appointment
        if (
          (slotStartMinutes >= startMinutes && slotStartMinutes < endMinutes) ||
          (slotEndMinutes > startMinutes && slotEndMinutes <= endMinutes) ||
          (slotStartMinutes <= startMinutes && slotEndMinutes >= endMinutes)
        ) {
          unavailable.add(slot);
        }
      });
    });
    
    return unavailable;
  }, [formData.agent, formData.date, formData.duration, appointments, editingId]);

  const availableTimeSlots = useMemo(() => {
    return ALL_TIME_SLOTS.map(slot => ({
      time: slot,
      available: !getUnavailableSlots.has(slot)
    }));
  }, [getUnavailableSlots]);

  const handleSelectClient = (client: Client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      client: client.name,
      agent: client.assignedAgent,
    }));
    setClientSearch(client.name);
    setIsClientSearchFocused(false);
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailOpen(true);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setEditingId(null);
    setFormData({ ...emptyFormData, date: dateStr });
    setClientSearch("");
    setIsFromCalendarClick(true);
    setIsFormOpen(true);
  };

  const handleNewAppointment = () => {
    setEditingId(null);
    setFormData(emptyFormData);
    setClientSearch("");
    setIsFromCalendarClick(false);
    setIsFormOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setFormData({
      date: apt.date,
      time: apt.time,
      clientId: apt.clientId,
      client: apt.client,
      property: apt.property,
      agent: apt.agent,
      typeId: apt.typeId,
      duration: apt.duration,
      notes: apt.notes,
    });
    setClientSearch(apt.client);
    setIsFromCalendarClick(false);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.clientId || !formData.date || !formData.time || !formData.agent) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    if (editingId) {
      setAppointments(prev => prev.map(a => 
        a.id === editingId ? { 
          ...a, 
          ...formData,
        } : a
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
    setFormData(emptyFormData);
    setClientSearch("");
  };

  const handleDelete = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    setIsDetailOpen(false);
    toast.success("Cita eliminada");
  };

  const handleTypeChange = (typeId: string) => {
    const type = appointmentTypes.find(t => t.id === typeId);
    setFormData(prev => ({
      ...prev,
      typeId,
      duration: type?.defaultDuration || 60,
      time: "", // Reset time when type changes since duration affects availability
    }));
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
              <Timer className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Duración</p>
              <p className="font-medium text-midnight">{selectedAppointment.duration} minutos</p>
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

          {selectedAppointment.notes && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Notas</p>
                <p className="font-medium text-midnight">{selectedAppointment.notes}</p>
              </div>
            </div>
          )}
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

  const FormContent = () => {
    const isClientSelected = !!formData.clientId;
    const canSelectTime = formData.agent && formData.date;
    
    return (
      <div className="space-y-6 p-4">
        {/* Step indicator for calendar click flow */}
        {isFromCalendarClick && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              Fecha seleccionada: <strong>{new Date(formData.date + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
            </span>
          </div>
        )}

        {/* Client Search Section - Primary Action */}
        <div className="relative">
          <div className={cn(
            "p-4 rounded-xl border-2 transition-all",
            !isClientSelected ? "border-champagne-gold bg-champagne-gold/5" : "border-green-300 bg-green-50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                !isClientSelected ? "bg-champagne-gold/20" : "bg-green-100"
              )}>
                <Search className={cn("w-5 h-5", !isClientSelected ? "text-champagne-gold" : "text-green-600")} />
              </div>
              <div>
                <Label className="text-base font-semibold text-midnight">
                  {!isClientSelected ? "1. Buscar Cliente" : "Cliente Seleccionado"}
                </Label>
                <p className="text-xs text-foreground/60">Busca por nombre o matrícula</p>
              </div>
            </div>
            
            <div className="relative">
              <Input
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  if (formData.clientId) {
                    setFormData(prev => ({ ...prev, clientId: "", client: "", agent: "" }));
                  }
                }}
                onFocus={() => setIsClientSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsClientSearchFocused(false), 200)}
                placeholder="Ej: María García o CLI-2024-001"
                className="h-12 pr-10"
              />
              {isClientSelected && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Badge className="bg-green-100 text-green-700">✓ Seleccionado</Badge>
                </div>
              )}
            </div>
            
            {/* Client search results dropdown */}
            {isClientSearchFocused && filteredClients.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-4 py-3 text-left hover:bg-champagne-gold/10 transition-colors border-b border-border/30 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-midnight">{client.name}</p>
                        <p className="text-sm text-foreground/60">{client.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs font-mono">{client.matricula}</Badge>
                        <p className="text-xs text-foreground/50 mt-1">Agente: {client.assignedAgent}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {isClientSearchFocused && clientSearch && filteredClients.length === 0 && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-border rounded-xl shadow-lg p-4">
                <p className="text-center text-foreground/60 text-sm">No se encontraron clientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Agent Section */}
        <div className={cn(
          "p-4 rounded-xl border transition-all",
          !isClientSelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Users className="w-5 h-5 text-champagne-gold" />
            </div>
            <Label className="text-base font-semibold text-midnight">2. Agente Asignado</Label>
          </div>
          
          <Select 
            value={formData.agent} 
            onValueChange={(v) => setFormData(prev => ({ ...prev, agent: v, time: "" }))}
            disabled={!isClientSelected}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Seleccionar agente" />
            </SelectTrigger>
            <SelectContent>
              {agents.map(a => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isClientSelected && formData.agent && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <span>✓</span> Agente por defecto del cliente
            </p>
          )}
        </div>

        {/* Date & Time Section */}
        <div className={cn(
          "p-4 rounded-xl border transition-all",
          !isClientSelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Clock className="w-5 h-5 text-champagne-gold" />
            </div>
            <Label className="text-base font-semibold text-midnight">3. Fecha y Hora</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Input */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Fecha</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: "" }))}
                className="h-12"
                disabled={!isClientSelected || isFromCalendarClick}
              />
            </div>
            
            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Hora</Label>
              {canSelectTime ? (
                <Select 
                  value={formData.time} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, time: v }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar hora" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimeSlots.map(({ time, available }) => (
                      <SelectItem 
                        key={time} 
                        value={time}
                        disabled={!available}
                        className={cn(!available && "opacity-50")}
                      >
                        <div className="flex items-center gap-2">
                          <span>{time}</span>
                          {!available && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                              Ocupado
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="h-12 flex items-center px-3 bg-muted/30 rounded-md border border-border/50">
                  <span className="text-sm text-foreground/50">Selecciona agente y fecha primero</span>
                </div>
              )}
            </div>
          </div>
          
          {canSelectTime && getUnavailableSlots.size > 0 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Algunos horarios no están disponibles porque el agente ya tiene citas programadas. 
                Duración considerada: {formData.duration} min.
              </p>
            </div>
          )}
        </div>

        {/* Additional Details Section */}
        <div className={cn(
          "p-4 rounded-xl border transition-all",
          !isClientSelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white"
        )}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Tag className="w-5 h-5 text-champagne-gold" />
            </div>
            <Label className="text-base font-semibold text-midnight">4. Detalles de la Cita</Label>
          </div>
          
          <div className="space-y-4">
            {/* Appointment Type */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Tipo de Cita</Label>
              <Select 
                value={formData.typeId} 
                onValueChange={handleTypeChange}
                disabled={!isClientSelected}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(t => (
                    <SelectItem key={t.id} value={t.id}>
                      <div className="flex items-center gap-2">
                        <Badge className={cn(t.color, "text-xs")}>{t.name}</Badge>
                        <span className="text-xs text-foreground/50">({t.defaultDuration} min)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Duración Aproximada</Label>
              <Select 
                value={String(formData.duration)} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, duration: parseInt(v), time: "" }))}
                disabled={!isClientSelected}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(d => (
                    <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Property */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Propiedad</Label>
              <Select 
                value={formData.property} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, property: v }))}
                disabled={!isClientSelected}
              >
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

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Notas (Opcional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales sobre la cita..."
                className="min-h-[80px] resize-none"
                disabled={!isClientSelected}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(apt => apt.date === todayStr);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Calendario de Citas</h1>
          <p className="text-foreground/60">Vista maestra de todas las citas</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleNewAppointment}>
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
              const now = new Date();
              const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

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
                      <p className="text-xs text-foreground/50">{apt.duration} min</p>
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
            <div className="overflow-y-auto flex-1">
              <FormContent />
            </div>
            <DrawerFooter className="border-t border-border/30">
              <Button 
                variant="gold" 
                onClick={handleSave} 
                className="w-full h-12"
                disabled={!formData.clientId || !formData.date || !formData.time || !formData.agent}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cita
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingId ? "Editar Cita" : "Nueva Cita"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button 
                variant="gold" 
                onClick={handleSave}
                disabled={!formData.clientId || !formData.date || !formData.time || !formData.agent}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Cita
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CitasSection;
