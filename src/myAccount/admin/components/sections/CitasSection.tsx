import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAppointmentsAction,
  createAdminAppointmentAction,
  updateAdminAppointmentStatusAction,
  getAdminAppointmentAvailabilityAction,
} from "@/myAccount/admin/actions/get-admin-appointments.actions";
import { getAdminClientsAction } from "@/myAccount/admin/actions/get-admin-clients.actions";
import { getAdminPropertiesAction } from "@/myAccount/admin/actions/get-admin-properties.actions";
import type { AdminAppointment, AdminClient, AdminProperty, AppointmentType } from "@/myAccount/admin/types/admin.types";
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
  CircleAlert,
  FileText,
  Timer,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { Textarea } from "@/shared/components/ui/textarea";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── status config ────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  programada: "Programada",
  confirmada: "Confirmada",
  en_progreso: "En progreso",
  completada: "Completada",
  cancelada: "Cancelada",
  no_show: "No show",
};

// For badges / kanban headers
const STATUS_COLORS: Record<string, string> = {
  programada:  "bg-blue-100 text-blue-700 border-blue-200",
  confirmada:  "bg-green-100 text-green-700 border-green-200",
  en_progreso: "bg-amber-100 text-amber-800 border-amber-200",
  completada:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelada:   "bg-red-100 text-red-600 border-red-200",
  no_show:     "bg-gray-100 text-gray-600 border-gray-200",
  reagendada:  "bg-purple-100 text-purple-700 border-purple-200",
};

// For calendar pills (compact, visually distinct)
const STATUS_PILL: Record<string, string> = {
  programada:  "bg-blue-100 text-blue-700",
  confirmada:  "bg-green-100 text-green-700",
  en_progreso: "bg-amber-200 text-amber-800",
  completada:  "bg-emerald-100 text-emerald-700",
  cancelada:   "bg-red-100 text-red-500 line-through",
  no_show:     "bg-gray-100 text-gray-400",
  reagendada:  "bg-purple-100 text-purple-600",
};

// Statuses shown in the change-status dropdown (no reagendada)
const EDITABLE_STATUSES = [
  "programada", "confirmada", "en_progreso", "completada", "cancelada", "no_show",
] as const;

// Kanban column order (no reagendada)
const STATUS_ORDER = [
  "programada", "confirmada", "en_progreso", "completada", "cancelada", "no_show",
] as const;

// ─── local types ──────────────────────────────────────────────────────────────

interface AppointmentTypeOption {
  id: AppointmentType;
  name: string;
  color: string;
  defaultDuration: number;
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
  rawId: number;
  date: string;
  time: string;
  client: string;
  clientId: string;
  property: string;
  propertyId: number;
  agent: string;
  agentMembershipId: number;
  typeId: AppointmentType;
  duration: number;
  notes: string;
  status: string;
  matricula: string;
}

interface FormData {
  date: string;
  time: string;
  clientId: string;
  client: string;
  propertySearch: string;
  property: string;
  propertyId: number | "";
  agentName: string;
  agentMembershipId: number | "";
  typeId: AppointmentType;
  duration: number;
  notes: string;
}

// ─── constants ────────────────────────────────────────────────────────────────

const appointmentTypes: AppointmentTypeOption[] = [
  { id: "primera_visita",  name: "Primera Visita",      color: "bg-blue-100 text-blue-700",    defaultDuration: 60  },
  { id: "seguimiento",     name: "Seguimiento",         color: "bg-green-100 text-green-700",  defaultDuration: 45  },
  { id: "cierre_contrato", name: "Cierre de Contrato",  color: "bg-champagne-gold/20 text-champagne-gold-dark", defaultDuration: 90 },
  { id: "entrega_llaves",  name: "Entrega de Llaves",   color: "bg-purple-100 text-purple-700",defaultDuration: 30  },
  { id: "avaluo",          name: "Avalúo",              color: "bg-orange-100 text-orange-700",defaultDuration: 120 },
];

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const WEEKDAYS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const DURATION_OPTIONS = [
  { value: 30,  label: "30 minutos"    },
  { value: 45,  label: "45 minutos"    },
  { value: 60,  label: "1 hora"        },
  { value: 90,  label: "1 hora 30 min" },
  { value: 120, label: "2 horas"       },
];

const emptyFormData: FormData = {
  date: "", time: "", clientId: "", client: "",
  propertySearch: "", property: "", propertyId: "",
  agentName: "", agentMembershipId: "",
  typeId: "primera_visita", duration: 60, notes: "",
};

// ─── mappers ─────────────────────────────────────────────────────────────────

const mapAdminAppointment = (item: AdminAppointment): Appointment => ({
  id: String(item.id),
  rawId: item.id,
  date: item.scheduledDate,
  time: item.scheduledTime.slice(0, 5),
  client: item.clientName,
  clientId: "",
  property: item.property.title,
  propertyId: item.property.id,
  agent: item.agent.name,
  agentMembershipId: item.agent.id,
  typeId: item.appointmentType ?? "primera_visita",
  duration: item.durationMinutes,
  notes: "",
  status: item.status,
  matricula: item.matricula,
});

const mapAdminClient = (item: AdminClient): Client => ({
  id: String(item.membershipId),
  name: item.name,
  matricula: item.email.split("@")[0].toUpperCase(),
  assignedAgent: "",
  phone: item.phone,
  email: item.email,
});

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Returns local YYYY-MM-DD (avoids UTC-shift bug with toISOString) */
const localDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// ─── component ───────────────────────────────────────────────────────────────

const CitasSection = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());

  // ── queries ──
  const appointmentsQuery = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => getAdminAppointmentsAction({ limit: 500 }),
  });
  const appointments = (appointmentsQuery.data?.results ?? []).map(mapAdminAppointment);

  const propertiesQuery = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => getAdminPropertiesAction({ limit: 200 }),
  });
  const allProperties = propertiesQuery.data?.results ?? [];

  // ── status mutation ──
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAdminAppointmentStatusAction(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
      toast.success("Estado actualizado");
    },
    onError: () => toast.error("Error al actualizar el estado"),
  });

  // ── create mutation ──
  const createMutation = useMutation({
    mutationFn: createAdminAppointmentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-kanban"] });
      toast.success("Cita creada correctamente");
      setIsFormOpen(false);
      setFormData(emptyFormData);
      setClientSearch("");
      setAvailableSlots([]);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(msg ?? "Error al crear la cita");
    },
  });

  // ── UI state ──
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailOpen, setIsDetailOpen]   = useState(false);
  const [isFormOpen, setIsFormOpen]       = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [formData, setFormData]           = useState<FormData>(emptyFormData);
  const [clientSearch, setClientSearch]   = useState("");
  const [isClientSearchFocused, setIsClientSearchFocused] = useState(false);
  const [isPropertySearchFocused, setIsPropertySearchFocused] = useState(false);
  const [isFromCalendarClick, setIsFromCalendarClick]     = useState(false);
  const [availableSlots, setAvailableSlots]   = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading]       = useState(false);

  const clientsQuery = useQuery({
    queryKey: ["admin-clients-search", clientSearch],
    queryFn: () => getAdminClientsAction({ search: clientSearch, limit: 20 }),
    enabled: clientSearch.length >= 2,
  });
  const clients = (clientsQuery.data?.results ?? []).map(mapAdminClient);

  // ── calendar computed ──
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth  = new Date(year, month + 1, 0);
  const startingDay  = firstDayOfMonth.getDay();
  const daysInMonth  = lastDayOfMonth.getDate();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth     = () => setCurrentDate(new Date(year, month + 1, 1));

  const getAppointmentsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter(a => a.date === dateStr);
  };

  // ── client search filtered ──
  const filteredClients = useMemo(() => {
    if (!clientSearch.trim()) return [];
    const q = clientSearch.toLowerCase();
    return clients.filter(c => c.name.toLowerCase().includes(q) || c.matricula.toLowerCase().includes(q));
  }, [clientSearch, clients]);

  // ── property search filtered ──
  const filteredProperties = useMemo(() => {
    if (!formData.propertySearch.trim()) return [];
    const q = formData.propertySearch.toLowerCase();
    return allProperties.filter(p =>
      p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    );
  }, [formData.propertySearch, allProperties]);

  // ── kanban: appointments grouped by status ──
  const appointmentsByStatus = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    STATUS_ORDER.forEach(s => {
      map[s] = appointments
        .filter(a => a.status === s)
        .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    });
    return map;
  }, [appointments]);

  // ── fetch slots when agent+date known ──
  const fetchSlots = async (agentMembershipId: number | "", date: string) => {
    if (!agentMembershipId || !date) { setAvailableSlots([]); return; }
    setSlotsLoading(true);
    const slots = await getAdminAppointmentAvailabilityAction(agentMembershipId as number, date);
    setAvailableSlots(slots);
    setSlotsLoading(false);
  };

  const handleSelectProperty = (prop: AdminProperty) => {
    setFormData(prev => ({
      ...prev,
      propertySearch: prop.title,
      property: prop.title,
      propertyId: prop.id,
      agentName: prop.agent?.name ?? "",
      agentMembershipId: prop.agent?.id ?? "",
      time: "",
    }));
    setIsPropertySearchFocused(false);
    if (prop.agent?.id && formData.date) {
      fetchSlots(prop.agent.id, formData.date);
    } else {
      setAvailableSlots([]);
    }
  };

  // ── handlers ──
  const handleSelectClient = (client: Client) => {
    setFormData(prev => ({ ...prev, clientId: client.id, client: client.name }));
    setClientSearch(client.name);
    setIsClientSearchFocused(false);
  };

  const handleAppointmentClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsDetailOpen(true);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setEditingId(null);
    setFormData({ ...emptyFormData, date: dateStr });
    setClientSearch("");
    setAvailableSlots([]);
    setIsFromCalendarClick(true);
    setIsFormOpen(true);
  };

  const handleNewAppointment = () => {
    setEditingId(null);
    setFormData(emptyFormData);
    setClientSearch("");
    setAvailableSlots([]);
    setIsFromCalendarClick(false);
    setIsFormOpen(true);
  };

  const handleEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setFormData({
      date: apt.date, time: apt.time, clientId: apt.clientId,
      client: apt.client,
      propertySearch: apt.property, property: apt.property, propertyId: apt.propertyId,
      agentName: apt.agent, agentMembershipId: apt.agentMembershipId,
      typeId: apt.typeId, duration: apt.duration, notes: apt.notes,
    });
    setClientSearch(apt.client);
    setAvailableSlots([]);
    setIsFromCalendarClick(false);
    setIsDetailOpen(false);
    setIsFormOpen(true);
    // fetch real slots for the existing date
    if (apt.agentMembershipId && apt.date) {
      fetchSlots(apt.agentMembershipId, apt.date);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedAppointment) return;
    updateStatusMutation.mutate(
      { id: selectedAppointment.rawId, status: newStatus },
      { onSuccess: () => setSelectedAppointment(prev => prev ? { ...prev, status: newStatus } : null) }
    );
  };

  const handleSave = () => {
    if (!formData.propertyId || !formData.agentMembershipId || !formData.date || !formData.time) {
      toast.error("Selecciona propiedad, fecha y hora para continuar");
      return;
    }
    createMutation.mutate({
      property_id: formData.propertyId as number,
      agent_membership_id: formData.agentMembershipId as number,
      client_membership_id: formData.clientId ? parseInt(formData.clientId) : null,
      scheduled_date: formData.date,
      scheduled_time: formData.time,
      duration_minutes: formData.duration || null,
      appointment_type: formData.typeId,
      notes: formData.notes,
    });
  };

  const handleDelete = (_id: string) => {
    toast.info("Eliminación de citas disponible próximamente");
    setIsDetailOpen(false);
  };

  const handleTypeChange = (typeId: string) => {
    const type = appointmentTypes.find(t => t.id === typeId);
    setFormData(prev => ({ ...prev, typeId: typeId as AppointmentType, duration: type?.defaultDuration || 60, time: "" }));
  };

  // ── calendar grid ──
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  // ─── Detail content (called as function) ─────────────────────────────────
  const AppointmentDetailContent = () => {
    if (!selectedAppointment) return null;
    const apt = selectedAppointment;
    const statusColor = STATUS_COLORS[apt.status] ?? STATUS_COLORS.programada;

    return (
      <div className="space-y-5 p-4">
        {/* Date/time header */}
        <div className="flex items-center gap-3 p-4 bg-champagne-gold/10 rounded-xl">
          <Clock className="w-6 h-6 text-champagne-gold shrink-0" />
          <div>
            <p className="font-bold text-xl text-midnight">{apt.time}</p>
            <p className="text-foreground/60">
              {new Date(apt.date + "T12:00:00").toLocaleDateString("es-MX", {
                weekday: "long", day: "numeric", month: "long",
              })}
            </p>
          </div>
          <div className="ml-auto">
            <Badge className="font-mono text-xs">{apt.matricula}</Badge>
          </div>
        </div>

        {/* Appointment type badge */}
        {(() => {
          const t = appointmentTypes.find(x => x.id === apt.typeId);
          return t ? (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-champagne-gold" />
              <span className="text-sm text-foreground/60">Tipo:</span>
              <Badge className={cn("text-xs font-medium", t.color)}>{t.name}</Badge>
            </div>
          ) : null;
        })()}

        {/* Status change */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-midnight">Estado de la cita</Label>
          <Select
            value={apt.status}
            onValueChange={handleStatusChange}
            disabled={updateStatusMutation.isPending}
          >
            <SelectTrigger className={cn("h-11 border font-medium", statusColor)}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITABLE_STATUSES.map(s => (
                <SelectItem key={s} value={s}>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", STATUS_COLORS[s].split(" ")[0])} />
                    {STATUS_LABELS[s]}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {updateStatusMutation.isPending && (
            <p className="text-xs text-foreground/50">Guardando...</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Timer className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Duración</p>
              <p className="font-medium text-midnight">{apt.duration} min</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Home className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Propiedad</p>
              <p className="font-medium text-midnight">{apt.property}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <User className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Cliente</p>
              <p className="font-medium text-midnight">{apt.client}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted/30">
              <Users className="w-5 h-5 text-champagne-gold" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Agente</p>
              <p className="font-medium text-midnight">{apt.agent}</p>
            </div>
          </div>

          {apt.notes && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Notas</p>
                <p className="font-medium text-midnight">{apt.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2 border-t border-border/30">
          <Button variant="gold" className="flex-1" onClick={() => handleEdit(apt)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => handleDelete(apt.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ─── Form content (called as function) ───────────────────────────────────
  const FormContent = () => {
    const isPropertySelected = !!formData.propertyId;
    const canSelectTime = isPropertySelected && !!formData.date;

    return (
      <div className="space-y-6 p-4">
        {isFromCalendarClick && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-700">
              Fecha seleccionada:{" "}
              <strong>
                {new Date(formData.date + "T12:00:00").toLocaleDateString("es-MX", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </strong>
            </span>
          </div>
        )}

        {/* Step 1 — Property */}
        <div className="relative">
          <div className={cn(
            "p-4 rounded-xl border-2 transition-all",
            !isPropertySelected ? "border-champagne-gold bg-champagne-gold/5" : "border-green-300 bg-green-50"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("p-2 rounded-lg", !isPropertySelected ? "bg-champagne-gold/20" : "bg-green-100")}>
                <Home className={cn("w-5 h-5", !isPropertySelected ? "text-champagne-gold" : "text-green-600")} />
              </div>
              <div>
                <Label className="text-base font-semibold text-midnight">
                  {!isPropertySelected ? "1. Seleccionar Propiedad" : "Propiedad Seleccionada"}
                </Label>
                <p className="text-xs text-foreground/60">Busca por título o dirección</p>
              </div>
            </div>
            <div className="relative">
              <Input
                value={formData.propertySearch}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    propertySearch: e.target.value,
                    ...(prev.propertyId ? { propertyId: "", property: "", agentName: "", agentMembershipId: "", time: "" } : {}),
                  }));
                  setAvailableSlots([]);
                }}
                onFocus={() => setIsPropertySearchFocused(true)}
                onBlur={() => setTimeout(() => setIsPropertySearchFocused(false), 200)}
                placeholder="Ej: Casa en Córdoba..."
                className="h-12 pr-10"
              />
              {isPropertySelected && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Badge className="bg-green-100 text-green-700">✓</Badge>
                </div>
              )}
            </div>
            {/* Agent auto-filled indicator */}
            {isPropertySelected && formData.agentName && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-white/70 rounded-lg border border-green-200">
                <Users className="w-4 h-4 text-green-600 shrink-0" />
                <span className="text-sm text-foreground/70">Agente asignado:</span>
                <span className="text-sm font-semibold text-midnight">{formData.agentName}</span>
              </div>
            )}
            {isPropertySelected && !formData.agentName && (
              <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <CircleAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm text-amber-700">Esta propiedad no tiene agente asignado.</span>
              </div>
            )}
            {isPropertySearchFocused && filteredProperties.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredProperties.map(prop => (
                  <button key={prop.id} onClick={() => handleSelectProperty(prop)}
                    className="w-full px-4 py-3 text-left hover:bg-champagne-gold/10 transition-colors border-b border-border/30 last:border-b-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-midnight truncate">{prop.title}</p>
                        <p className="text-xs text-foreground/60 truncate">{prop.address}</p>
                      </div>
                      {prop.agent ? (
                        <Badge variant="outline" className="text-xs shrink-0">{prop.agent.name}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 shrink-0">Sin agente</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 2 — Client */}
        <div className="relative">
          <div className={cn(
            "p-4 rounded-xl border transition-all",
            !isPropertySelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white"
          )}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-muted/30">
                <Search className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <Label className="text-base font-semibold text-midnight">2. Cliente (Opcional)</Label>
                <p className="text-xs text-foreground/60">Busca por nombre o email</p>
              </div>
            </div>
            <div className="relative">
              <Input
                value={clientSearch}
                onChange={e => {
                  setClientSearch(e.target.value);
                  if (formData.clientId) setFormData(prev => ({ ...prev, clientId: "", client: "" }));
                }}
                onFocus={() => setIsClientSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsClientSearchFocused(false), 200)}
                placeholder="Ej: María García"
                className="h-12 pr-10"
                disabled={!isPropertySelected}
              />
              {formData.clientId && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Badge className="bg-green-100 text-green-700">✓</Badge>
                </div>
              )}
            </div>
            {isClientSearchFocused && filteredClients.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.map(client => (
                  <button key={client.id} onClick={() => handleSelectClient(client)}
                    className="w-full px-4 py-3 text-left hover:bg-champagne-gold/10 transition-colors border-b border-border/30 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-midnight">{client.name}</p>
                        <p className="text-sm text-foreground/60">{client.email}</p>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">{client.matricula}</Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Step 3 — Date & Time */}
        <div className={cn("p-4 rounded-xl border transition-all",
          !isPropertySelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white")}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted/30"><Clock className="w-5 h-5 text-champagne-gold" /></div>
            <Label className="text-base font-semibold text-midnight">3. Fecha y Hora</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Fecha</Label>
              <Input type="date" value={formData.date}
                onChange={e => {
                  const newDate = e.target.value;
                  setFormData(prev => ({ ...prev, date: newDate, time: "" }));
                  if (formData.agentMembershipId && newDate) {
                    fetchSlots(formData.agentMembershipId, newDate);
                  }
                }}
                className="h-12" disabled={!isPropertySelected || isFromCalendarClick} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Hora disponible</Label>
              {canSelectTime ? (
                slotsLoading ? (
                  <div className="h-12 flex items-center px-3 bg-muted/30 rounded-md border border-border/50">
                    <span className="text-sm text-foreground/50">Cargando horarios...</span>
                  </div>
                ) : availableSlots.length > 0 ? (
                  <Select value={formData.time} onValueChange={v => setFormData(prev => ({ ...prev, time: v }))}>
                    <SelectTrigger className="h-12"><SelectValue placeholder="Seleccionar hora" /></SelectTrigger>
                    <SelectContent>
                      {availableSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center gap-2">
                            <span>{slot}</span>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">Disponible</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-12 flex items-center px-3 bg-amber-50 rounded-md border border-amber-200">
                    <span className="text-sm text-amber-700">Sin horarios disponibles para este día</span>
                  </div>
                )
              ) : (
                <div className="h-12 flex items-center px-3 bg-muted/30 rounded-md border border-border/50">
                  <span className="text-sm text-foreground/50">Selecciona propiedad y fecha primero</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 4 — Details */}
        <div className={cn("p-4 rounded-xl border transition-all",
          !isPropertySelected ? "border-border/30 bg-muted/20 opacity-60" : "border-border bg-white")}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-muted/30"><Tag className="w-5 h-5 text-champagne-gold" /></div>
            <Label className="text-base font-semibold text-midnight">4. Detalles</Label>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Tipo de Cita</Label>
              <Select value={formData.typeId} onValueChange={handleTypeChange} disabled={!isPropertySelected}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
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
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Duración</Label>
              <Select value={String(formData.duration)}
                onValueChange={v => setFormData(prev => ({ ...prev, duration: parseInt(v), time: "" }))}
                disabled={!isPropertySelected}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map(d => <SelectItem key={d.value} value={String(d.value)}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-foreground/70">Notas (Opcional)</Label>
              <Textarea value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notas adicionales..." className="min-h-[80px] resize-none"
                disabled={!isPropertySelected} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── render ───────────────────────────────────────────────────────────────
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

      {/* ── Calendar ── */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-xl text-midnight">{MONTHS[month]} {year}</CardTitle>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Status legend */}
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {STATUS_ORDER.map(s => (
            <span key={s} className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", STATUS_COLORS[s])}>
              {STATUS_LABELS[s]}
            </span>
          ))}
        </div>

        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-sm font-medium text-foreground/60 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="min-h-[80px] md:min-h-[100px]" />;
              const dayApts = getAppointmentsForDay(day);
              const isToday = localDateStr(new Date()) === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              return (
                <div key={day} onClick={() => handleDayClick(day)}
                  className={cn(
                    "min-h-[80px] md:min-h-[100px] border border-border/30 rounded-lg p-1 md:p-2 cursor-pointer hover:border-champagne-gold/50 transition-colors",
                    isToday && "bg-champagne-gold/10 border-champagne-gold/50"
                  )}>
                  <span className={cn("text-sm font-medium", isToday ? "text-champagne-gold" : "text-midnight")}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayApts.slice(0, isMobile ? 1 : 2).map(apt => (
                      <button key={apt.id}
                        onClick={e => { e.stopPropagation(); handleAppointmentClick(apt); }}
                        className={cn(
                          "w-full text-left p-1 rounded text-xs truncate transition-all hover:scale-105",
                          STATUS_PILL[apt.status] ?? "bg-gray-100 text-gray-600"
                        )}>
                        {isMobile ? apt.time : `${apt.time} ${apt.client}`}
                      </button>
                    ))}
                    {dayApts.length > (isMobile ? 1 : 2) && (
                      <span className="text-xs text-foreground/50">
                        +{dayApts.length - (isMobile ? 1 : 2)} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── Kanban por estado ── */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-midnight flex items-center gap-2">
            <Hash className="w-5 h-5 text-champagne-gold" />
            Resumen de Citas por Estado
          </CardTitle>
          <p className="text-sm text-foreground/60">
            Ordenadas de fecha más reciente a la actual · {appointments.length} cita{appointments.length !== 1 ? "s" : ""} en total
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4 min-w-max">
              {STATUS_ORDER.map(status => {
                const cols = appointmentsByStatus[status] ?? [];
                return (
                  <div key={status} className="w-56 space-y-3">
                    {/* Column header */}
                    <div className="flex items-center justify-between">
                      <Badge className={cn("font-medium border", STATUS_COLORS[status])}>
                        {STATUS_LABELS[status]}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground/60">{cols.length}</span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2">
                      {cols.length === 0 ? (
                        <div className="py-6 text-center text-sm text-foreground/30 border border-dashed border-border/40 rounded-xl">
                          Sin citas
                        </div>
                      ) : (
                        cols.map(apt => (
                          <div key={apt.id}
                            onClick={() => handleAppointmentClick(apt)}
                            className="p-3 bg-white border border-border/40 rounded-xl cursor-pointer hover:border-champagne-gold/50 hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-xs text-foreground/40">{apt.matricula}</span>
                              <span className="text-xs font-bold text-champagne-gold">{apt.time}</span>
                            </div>
                            <p className="font-medium text-midnight text-sm truncate">{apt.client}</p>
                            <p className="text-xs text-foreground/60 truncate mt-0.5">{apt.property}</p>
                            <p className="text-xs text-foreground/40 mt-1.5">
                              {new Date(apt.date + "T12:00:00").toLocaleDateString("es-MX", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Detail Dialog/Drawer ── */}
      {isMobile ? (
        <Drawer open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Detalle de Cita</DrawerTitle>
            </DrawerHeader>
            {AppointmentDetailContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detalle de Cita</DialogTitle>
            </DialogHeader>
            {AppointmentDetailContent()}
          </DialogContent>
        </Dialog>
      )}

      {/* ── Form Dialog/Drawer ── */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent className="max-h-[95vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId ? "Editar Cita" : "Nueva Cita"}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto flex-1">
              {FormContent()}
            </div>
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSave} className="w-full h-12"
                disabled={createMutation.isPending || !formData.propertyId || !formData.agentMembershipId || !formData.date || !formData.time}>
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Guardando…" : "Guardar Cita"}
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
            {FormContent()}
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSave}
                disabled={createMutation.isPending || !formData.propertyId || !formData.agentMembershipId || !formData.date || !formData.time}>
                <Save className="w-4 h-4 mr-2" />
                {createMutation.isPending ? "Guardando…" : "Guardar Cita"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CitasSection;
