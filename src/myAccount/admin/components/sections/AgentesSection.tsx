import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Clock,
  Edit,
  Trash2,
  X,
  Check,
  Save,
  Phone,
  Camera,
  ChevronLeft,
  Coffee,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/shared/components/ui/drawer";
import { useIsMobile } from "@/shared/hooks/use-mobile.hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatPhone } from "@/shared/utils/format-input";
import {
  getAdminAgentsAction,
  getAdminAgentSchedulesAction,
  createAdminAgentScheduleAction,
  updateAdminAgentScheduleAction,
  deleteAdminAgentScheduleAction,
  createAdminAgentAction,
  updateAdminAgentAction,
  uploadAdminAgentAvatarAction,
  deleteAdminAgentAction,
} from "@/myAccount/admin/actions/get-admin-agents.actions";
import type { AdminAgent, AgentSchedule } from "@/myAccount/admin/types/admin.types";

// ─── helpers ──────────────────────────────────────────────────────────────────

const getMediaUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/media/")) return `http://localhost:8000${url}`;
  return null;
};

// ─── constants ────────────────────────────────────────────────────────────────

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
const DAY_KEYS: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_ABBR: Record<DayKey, string> = {
  monday: "Lu", tuesday: "Ma", wednesday: "Mi", thursday: "Ju",
  friday: "Vi", saturday: "Sa", sunday: "Do",
};
const BREAK_TYPE_LABELS: Record<string, string> = {
  lunch: "Almuerzo", coffee: "Café", rest: "Descanso", other: "Otro",
};
const BREAK_TYPE_COLORS: Record<string, string> = {
  lunch: "bg-orange-100 text-orange-700 border-orange-200",
  coffee: "bg-amber-100 text-amber-700 border-amber-200",
  rest: "bg-blue-100 text-blue-700 border-blue-200",
  other: "bg-gray-100 text-gray-700 border-gray-200",
};

// ─── local types ──────────────────────────────────────────────────────────────

interface BreakItem {
  id?: number;
  break_type: "lunch" | "coffee" | "rest" | "other";
  name: string;
  start_time: string;
  end_time: string;
}

interface ScheduleFormData {
  name: string;
  monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean;
  friday: boolean; saturday: boolean; sunday: boolean;
  start_time: string;
  end_time: string;
  has_lunch_break: boolean;
  lunch_start: string;
  lunch_end: string;
  is_active: boolean;
  priority: number;
  breaks: BreakItem[];
}

interface AgentFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  zone: string;
  bio: string;
}

interface MappedAgent {
  id: string;
  rawId: number;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  initials: string;
  properties: number;
  sales: number;
}

// ─── defaults ────────────────────────────────────────────────────────────────

const emptyScheduleForm: ScheduleFormData = {
  name: "", monday: false, tuesday: false, wednesday: false, thursday: false,
  friday: false, saturday: false, sunday: false,
  start_time: "09:00", end_time: "18:00",
  has_lunch_break: false, lunch_start: "14:00", lunch_end: "15:00",
  is_active: true, priority: 0, breaks: [],
};

const emptyAgentForm: AgentFormData = { email: "", first_name: "", last_name: "", phone: "", zone: "", bio: "" };

const mapAdminAgent = (item: AdminAgent): MappedAgent => {
  const parts = item.name.split(" ");
  return {
    id: String(item.id),
    rawId: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone ?? "",
    avatarUrl: getMediaUrl(item.avatar),
    initials: parts.map(n => n[0]).join("").toUpperCase().slice(0, 2),
    properties: item.properties_count,
    sales: item.sales_count,
  };
};

// ─── component ───────────────────────────────────────────────────────────────

const AgentesSection = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── queries ──
  const agentsQuery = useQuery({ queryKey: ["admin-agents"], queryFn: getAdminAgentsAction });
  const agents = (agentsQuery.data?.results ?? []).map(mapAdminAgent);

  const [selectedAgent, setSelectedAgent] = useState<MappedAgent | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const schedulesQuery = useQuery({
    queryKey: ["admin-agent-schedules", selectedAgent?.rawId],
    queryFn: () => getAdminAgentSchedulesAction(selectedAgent!.rawId),
    enabled: isSchedulerOpen && !!selectedAgent,
  });
  const schedules = schedulesQuery.data ?? [];

  // ── agent mutations ──
  const updateAgentMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<AgentFormData> }) =>
      updateAdminAgentAction(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-agents"] }),
    onError: () => toast.error("Error al guardar los datos del agente"),
  });
  const avatarMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadAdminAgentAvatarAction(id, file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-agents"] }),
    onError: () => toast.error("Error al subir la foto de perfil"),
  });
  const deleteAgentMutation = useMutation({
    mutationFn: (rawId: number) => deleteAdminAgentAction(rawId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      toast.success("Agente eliminado");
    },
    onError: () => toast.error("Error al eliminar el agente"),
  });

  // ── schedule mutations ──
  const invalidateSchedules = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-agent-schedules", selectedAgent?.rawId] });

  const createScheduleMutation = useMutation({
    mutationFn: ({ agentId, payload }: { agentId: number; payload: ScheduleFormData }) => {
      const { breaks, ...rest } = payload;
      return createAdminAgentScheduleAction(agentId, {
        ...rest,
        lunch_start: rest.has_lunch_break ? rest.lunch_start : null,
        lunch_end: rest.has_lunch_break ? rest.lunch_end : null,
        breaks: breaks.map(({ break_type, name, start_time, end_time }) => ({ break_type, name, start_time, end_time })),
      });
    },
    onSuccess: () => { invalidateSchedules(); toast.success("Horario creado"); },
    onError: () => toast.error("Error al crear el horario"),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: ({ agentId, scheduleId, payload }: { agentId: number; scheduleId: number; payload: ScheduleFormData }) => {
      const { breaks, ...rest } = payload;
      return updateAdminAgentScheduleAction(agentId, scheduleId, {
        ...rest,
        lunch_start: rest.has_lunch_break ? rest.lunch_start : null,
        lunch_end: rest.has_lunch_break ? rest.lunch_end : null,
        breaks: breaks.map(({ break_type, name, start_time, end_time }) => ({ break_type, name, start_time, end_time })),
      });
    },
    onSuccess: () => { invalidateSchedules(); toast.success("Horario actualizado"); },
    onError: () => toast.error("Error al actualizar el horario"),
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: ({ agentId, scheduleId }: { agentId: number; scheduleId: number }) =>
      deleteAdminAgentScheduleAction(agentId, scheduleId),
    onSuccess: () => { invalidateSchedules(); toast.success("Horario eliminado"); },
    onError: () => toast.error("Error al eliminar el horario"),
  });

  // ── agent form state ──
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<number | null>(null);
  const [agentForm, setAgentForm] = useState<AgentFormData>(emptyAgentForm);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSavingAgent, setIsSavingAgent] = useState(false);

  // ── scheduler state ──
  const [schedulerView, setSchedulerView] = useState<"list" | "form">("list");
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>(emptyScheduleForm);
  const [isAddingBreak, setIsAddingBreak] = useState(false);
  const [newBreak, setNewBreak] = useState<BreakItem>({
    break_type: "coffee", name: "", start_time: "10:30", end_time: "10:45",
  });
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  // ── agent handlers ──
  const handleCreate = () => {
    setEditingAgentId(null);
    setAgentForm(emptyAgentForm);
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsFormOpen(true);
  };

  const handleEdit = (agent: MappedAgent) => {
    const parts = agent.name.split(" ");
    setEditingAgentId(agent.rawId);
    setAgentForm({
      email: agent.email,
      first_name: parts[0] ?? "",
      last_name: parts.slice(1).join(" "),
      phone: agent.phone,
      zone: "",
      bio: "",
    });
    setAvatarFile(null);
    setAvatarPreview(agent.avatarUrl);
    setIsFormOpen(true);
  };

  const handleSaveAgent = async () => {
    if (!editingAgentId) {
      // Crear agente nuevo
      if (!agentForm.email.trim()) {
        toast.error("El email es requerido");
        return;
      }
      if (!agentForm.first_name.trim()) {
        toast.error("El nombre es requerido");
        return;
      }
      setIsSavingAgent(true);
      try {
        const created = await createAdminAgentAction({
          email: agentForm.email,
          first_name: agentForm.first_name,
          last_name: agentForm.last_name,
          phone: agentForm.phone,
          zone: agentForm.zone,
          bio: agentForm.bio,
        });
        if (avatarFile && created.id) {
          await avatarMutation.mutateAsync({ id: created.id, file: avatarFile });
        }
        queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
        toast.success("Agente creado exitosamente");
        setIsFormOpen(false);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        toast.error(error?.response?.data?.error || "Error al crear el agente");
      } finally {
        setIsSavingAgent(false);
      }
      return;
    }
    // Editar agente existente
    setIsSavingAgent(true);
    try {
      const { email: _email, ...updatePayload } = agentForm;
      await updateAgentMutation.mutateAsync({ id: editingAgentId, payload: updatePayload });
      if (avatarFile) {
        await avatarMutation.mutateAsync({ id: editingAgentId, file: avatarFile });
      }
      toast.success("Agente actualizado");
      setIsFormOpen(false);
    } catch {
      // handled in mutation onError
    } finally {
      setIsSavingAgent(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── scheduler handlers ──
  const handleOpenScheduler = (agent: MappedAgent) => {
    setSelectedAgent(agent);
    setSchedulerView("list");
    setEditingScheduleId(null);
    setScheduleForm(emptyScheduleForm);
    setIsSchedulerOpen(true);
  };

  const handleSchedulerClose = (open: boolean) => {
    if (!open) {
      setSchedulerView("list");
      setEditingScheduleId(null);
      setScheduleForm(emptyScheduleForm);
      setIsAddingBreak(false);
    }
    setIsSchedulerOpen(open);
  };

  const handleNewSchedule = () => {
    setEditingScheduleId(null);
    setScheduleForm(emptyScheduleForm);
    setIsAddingBreak(false);
    setSchedulerView("form");
  };

  const handleEditSchedule = (s: AgentSchedule) => {
    setEditingScheduleId(s.id);
    setScheduleForm({
      name: s.name,
      monday: s.monday, tuesday: s.tuesday, wednesday: s.wednesday, thursday: s.thursday,
      friday: s.friday, saturday: s.saturday, sunday: s.sunday,
      start_time: s.start_time, end_time: s.end_time,
      has_lunch_break: s.has_lunch_break,
      lunch_start: s.lunch_start ?? "14:00",
      lunch_end: s.lunch_end ?? "15:00",
      is_active: s.is_active,
      priority: s.priority,
      breaks: s.breaks.map(b => ({
        id: b.id,
        break_type: b.break_type as BreakItem["break_type"],
        name: b.name,
        start_time: b.start_time,
        end_time: b.end_time,
      })),
    });
    setIsAddingBreak(false);
    setSchedulerView("form");
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    if (!selectedAgent) return;
    deleteScheduleMutation.mutate({ agentId: selectedAgent.rawId, scheduleId });
  };

  const handleSaveSchedule = async () => {
    if (!selectedAgent) return;
    if (!scheduleForm.name.trim()) { toast.error("El nombre del horario es obligatorio"); return; }
    const hasDay = DAY_KEYS.some(d => scheduleForm[d]);
    if (!hasDay) { toast.error("Selecciona al menos un día"); return; }
    setIsSavingSchedule(true);
    try {
      if (editingScheduleId) {
        await updateScheduleMutation.mutateAsync({
          agentId: selectedAgent.rawId, scheduleId: editingScheduleId, payload: scheduleForm,
        });
      } else {
        await createScheduleMutation.mutateAsync({ agentId: selectedAgent.rawId, payload: scheduleForm });
      }
      setSchedulerView("list");
    } catch {
      // handled in mutation onError
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const handleAddBreak = () => {
    setScheduleForm(prev => ({ ...prev, breaks: [...prev.breaks, { ...newBreak }] }));
    setNewBreak({ break_type: "coffee", name: "", start_time: "10:30", end_time: "10:45" });
    setIsAddingBreak(false);
  };

  const handleRemoveBreak = (index: number) => {
    setScheduleForm(prev => ({ ...prev, breaks: prev.breaks.filter((_, i) => i !== index) }));
  };

  // ── Scheduler Content (called as function, not component) ──────────────────
  const SchedulerContent = () => {
    if (!selectedAgent) return null;

    // ── Agent header ──
    const AgentHeader = (
      <div className="flex items-center gap-3 p-4 bg-champagne-gold/10 rounded-xl mb-4">
        <div className="w-12 h-12 rounded-full bg-champagne-gold flex items-center justify-center text-white text-lg font-bold overflow-hidden flex-shrink-0">
          {selectedAgent.avatarUrl
            ? <img src={selectedAgent.avatarUrl} alt={selectedAgent.name} className="w-full h-full object-cover" />
            : selectedAgent.initials}
        </div>
        <div>
          <p className="font-semibold text-midnight">{selectedAgent.name}</p>
          <p className="text-sm text-foreground/60">{selectedAgent.email}</p>
        </div>
      </div>
    );

    // ── Schedule list view ──
    if (schedulerView === "list") {
      return (
        <div className="space-y-4">
          {AgentHeader}

          {schedulesQuery.isLoading ? (
            <p className="text-center text-foreground/60 py-6">Cargando horarios...</p>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Calendar className="w-10 h-10 text-foreground/30 mx-auto" />
              <p className="text-foreground/50">Sin horarios configurados</p>
              <p className="text-sm text-foreground/40">Agrega un horario para que el agente pueda recibir citas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((s) => {
                const activeDays = DAY_KEYS.filter(d => s[d]);
                return (
                  <div key={s.id} className="border border-border/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="font-semibold text-midnight truncate">{s.name}</span>
                        <Badge className={s.is_active ? "bg-green-100 text-green-700 shrink-0" : "bg-gray-100 text-gray-600 shrink-0"}>
                          {s.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/60 hover:text-midnight"
                          onClick={() => handleEditSchedule(s)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteSchedule(s.id)}
                          disabled={deleteScheduleMutation.isPending}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Days */}
                    <div className="flex gap-1 flex-wrap">
                      {DAY_KEYS.map(d => (
                        <span key={d} className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          activeDays.includes(d)
                            ? "bg-champagne-gold text-white"
                            : "bg-muted text-foreground/40"
                        )}>
                          {DAY_ABBR[d]}
                        </span>
                      ))}
                    </div>

                    {/* Time range */}
                    <div className="flex items-center gap-3 text-sm text-foreground/70">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-champagne-gold" />
                        <span>{s.start_time} — {s.end_time}</span>
                      </div>
                      {s.has_lunch_break && s.lunch_start && s.lunch_end && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <Coffee className="w-4 h-4" />
                          <span>Almuerzo {s.lunch_start}–{s.lunch_end}</span>
                        </div>
                      )}
                    </div>

                    {/* Breaks */}
                    {s.breaks.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {s.breaks.map(b => (
                          <span key={b.id} className={cn("text-xs px-2 py-0.5 rounded-full border", BREAK_TYPE_COLORS[b.break_type] ?? BREAK_TYPE_COLORS.other)}>
                            {b.name || BREAK_TYPE_LABELS[b.break_type]} {b.start_time}–{b.end_time}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <Button variant="gold" className="w-full gap-2" onClick={handleNewSchedule}>
            <Plus className="w-4 h-4" />
            Nuevo Horario
          </Button>
        </div>
      );
    }

    // ── Schedule form view ──
    return (
      <div className="space-y-5">
        {/* Back + title */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSchedulerView("list")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="font-semibold text-midnight">
            {editingScheduleId ? "Editar Horario" : "Nuevo Horario"}
          </h3>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label>Nombre del horario <span className="text-red-500">*</span></Label>
          <Input
            value={scheduleForm.name}
            onChange={e => setScheduleForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Ej. Horario Estándar"
            className="h-12"
          />
        </div>

        {/* Days */}
        <div className="space-y-2">
          <Label>Días activos <span className="text-red-500">*</span></Label>
          <div className="flex gap-2 flex-wrap">
            {DAY_KEYS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setScheduleForm(p => ({ ...p, [d]: !p[d] }))}
                className={cn(
                  "w-10 h-10 rounded-full text-sm font-medium border-2 transition-colors",
                  scheduleForm[d]
                    ? "bg-champagne-gold text-white border-champagne-gold"
                    : "bg-white text-foreground/50 border-border hover:border-champagne-gold/50"
                )}
              >
                {DAY_ABBR[d]}
              </button>
            ))}
          </div>
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Hora inicio</Label>
            <Input
              type="time"
              value={scheduleForm.start_time}
              onChange={e => setScheduleForm(p => ({ ...p, start_time: e.target.value }))}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Hora fin</Label>
            <Input
              type="time"
              value={scheduleForm.end_time}
              onChange={e => setScheduleForm(p => ({ ...p, end_time: e.target.value }))}
              className="h-12"
            />
          </div>
        </div>

        {/* Lunch break */}
        <div className="space-y-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="flex items-center justify-between">
            <Label className="text-orange-700 font-medium">Hora de almuerzo</Label>
            <Switch
              checked={scheduleForm.has_lunch_break}
              onCheckedChange={v => setScheduleForm(p => ({ ...p, has_lunch_break: v }))}
            />
          </div>
          {scheduleForm.has_lunch_break && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-orange-600">Inicio</Label>
                <Input
                  type="time"
                  value={scheduleForm.lunch_start}
                  onChange={e => setScheduleForm(p => ({ ...p, lunch_start: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-orange-600">Fin</Label>
                <Input
                  type="time"
                  value={scheduleForm.lunch_end}
                  onChange={e => setScheduleForm(p => ({ ...p, lunch_end: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>
          )}
        </div>

        {/* Extra breaks */}
        <div className="space-y-3">
          <Label>Descansos adicionales</Label>

          {scheduleForm.breaks.length > 0 && (
            <div className="space-y-2">
              {scheduleForm.breaks.map((b, i) => (
                <div key={i} className={cn("flex items-center justify-between px-3 py-2 rounded-lg border text-sm", BREAK_TYPE_COLORS[b.break_type] ?? BREAK_TYPE_COLORS.other)}>
                  <span>
                    {b.name || BREAK_TYPE_LABELS[b.break_type]} · {b.start_time}–{b.end_time}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-current opacity-60 hover:opacity-100"
                    onClick={() => handleRemoveBreak(i)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {isAddingBreak ? (
            <div className="p-3 border border-border/40 rounded-xl space-y-3 bg-muted/20">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Tipo</Label>
                  <Select
                    value={newBreak.break_type}
                    onValueChange={(v: BreakItem["break_type"]) => setNewBreak(p => ({ ...p, break_type: v }))}
                  >
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(BREAK_TYPE_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Nombre (opcional)</Label>
                  <Input
                    value={newBreak.name}
                    onChange={e => setNewBreak(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ej. Café mañanero"
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Inicio</Label>
                  <Input type="time" value={newBreak.start_time}
                    onChange={e => setNewBreak(p => ({ ...p, start_time: e.target.value }))} className="h-10" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fin</Label>
                  <Input type="time" value={newBreak.end_time}
                    onChange={e => setNewBreak(p => ({ ...p, end_time: e.target.value }))} className="h-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsAddingBreak(false)}>
                  Cancelar
                </Button>
                <Button variant="gold" size="sm" className="flex-1" onClick={handleAddBreak}>
                  <Check className="w-4 h-4 mr-1" /> Agregar
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 text-foreground/60"
              onClick={() => setIsAddingBreak(true)}>
              <Plus className="w-4 h-4" /> Agregar descanso
            </Button>
          )}
        </div>

        {/* Options */}
        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Switch
              checked={scheduleForm.is_active}
              onCheckedChange={v => setScheduleForm(p => ({ ...p, is_active: v }))}
            />
            <Label>Horario activo</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-foreground/60">Prioridad</Label>
            <Input
              type="number"
              value={scheduleForm.priority}
              onChange={e => setScheduleForm(p => ({ ...p, priority: Number(e.target.value) }))}
              className="h-9 w-16 text-center"
              min={0}
            />
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1" onClick={() => setSchedulerView("list")}>
            Cancelar
          </Button>
          <Button variant="gold" className="flex-1 gap-2" onClick={handleSaveSchedule} disabled={isSavingSchedule}>
            <Save className="w-4 h-4" />
            {isSavingSchedule ? "Guardando..." : "Guardar Horario"}
          </Button>
        </div>
      </div>
    );
  };

  // ── Agent Form Content (called as function) ────────────────────────────────
  const FormContent = () => (
    <div className="space-y-5 p-4">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative w-24 h-24 rounded-full bg-champagne-gold flex items-center justify-center text-white text-3xl font-bold overflow-hidden cursor-pointer group"
          onClick={() => avatarInputRef.current?.click()}
        >
          {avatarPreview
            ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            : <span>{(agentForm.first_name[0] ?? "") + (agentForm.last_name[0] ?? "")}</span>}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <button type="button" className="text-sm text-champagne-gold hover:underline"
          onClick={() => avatarInputRef.current?.click()}>
          Cambiar foto
        </button>
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
      </div>

      {!editingAgentId && (
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input value={agentForm.email}
            onChange={e => setAgentForm(p => ({ ...p, email: e.target.value }))}
            placeholder="agente@ejemplo.com" type="email" className="h-12" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Nombre *</Label>
          <Input value={agentForm.first_name}
            onChange={e => setAgentForm(p => ({ ...p, first_name: e.target.value }))}
            placeholder="Carlos" className="h-12" />
        </div>
        <div className="space-y-2">
          <Label>Apellido</Label>
          <Input value={agentForm.last_name}
            onChange={e => setAgentForm(p => ({ ...p, last_name: e.target.value }))}
            placeholder="Mendoza" className="h-12" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input value={formatPhone(agentForm.phone)}
          onChange={e => setAgentForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9+]/g, "") }))}
          placeholder="272 123 4567" className="h-12" />
      </div>

      <div className="space-y-2">
        <Label>Zona</Label>
        <Select value={agentForm.zone} onValueChange={v => setAgentForm(p => ({ ...p, zone: v }))}>
          <SelectTrigger className="h-12"><SelectValue placeholder="Seleccionar zona" /></SelectTrigger>
          <SelectContent>
            {["Norte", "Sur", "Centro", "Oriente", "Poniente"].map(z => (
              <SelectItem key={z} value={z}>{z}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Biografía</Label>
        <textarea
          value={agentForm.bio}
          onChange={e => setAgentForm(p => ({ ...p, bio: e.target.value }))}
          placeholder="Breve descripción del agente..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );

  // ── Scheduler dialog/drawer wrapper ──────────────────────────────────────
  const SchedulerWrapper = isMobile ? (
    <Drawer open={isSchedulerOpen} onOpenChange={handleSchedulerClose}>
      <DrawerContent className="max-h-[92vh]">
        <DrawerHeader className="border-b border-border/30 shrink-0">
          <DrawerTitle>
            {schedulerView === "list" ? "Horarios del Agente" : (editingScheduleId ? "Editar Horario" : "Nuevo Horario")}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto p-4 flex-1">
          {SchedulerContent()}
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isSchedulerOpen} onOpenChange={handleSchedulerClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>
            {schedulerView === "list" ? "Horarios del Agente" : (editingScheduleId ? "Editar Horario" : "Nuevo Horario")}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-1">
          {SchedulerContent()}
        </div>
      </DialogContent>
    </Dialog>
  );

  // ── Agent form dialog/drawer wrapper ─────────────────────────────────────
  const AgentFormWrapper = isMobile ? (
    <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DrawerContent>
        <DrawerHeader className="border-b border-border/30">
          <DrawerTitle>{editingAgentId ? "Editar Agente" : "Nuevo Agente"}</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto flex-1">
          {FormContent()}
        </div>
        <div className="p-4 border-t border-border/30">
          <Button variant="gold" onClick={handleSaveAgent} disabled={isSavingAgent} className="w-full h-12">
            <Save className="w-4 h-4 mr-2" />
            {isSavingAgent ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{editingAgentId ? "Editar Agente" : "Nuevo Agente"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1">
          {FormContent()}
        </div>
        <div className="flex gap-2 p-4 border-t border-border/30 shrink-0">
          <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
          <Button variant="gold" className="flex-1" onClick={handleSaveAgent} disabled={isSavingAgent}>
            <Save className="w-4 h-4 mr-2" />
            {isSavingAgent ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Gestión de Agentes</h1>
          <p className="text-foreground/60">Administra cuentas y horarios</p>
        </div>
        <Button variant="gold" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Agente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {agentsQuery.isLoading ? (
          <p className="col-span-3 text-center text-foreground/60 py-8">Cargando agentes...</p>
        ) : agents.length === 0 ? (
          <p className="col-span-3 text-center text-foreground/60 py-8">No hay agentes registrados</p>
        ) : null}

        {agents.map((agent) => (
          <Card key={agent.id} className="border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold overflow-hidden flex-shrink-0">
                  {agent.avatarUrl
                    ? <img src={agent.avatarUrl} alt={agent.name} className="w-full h-full object-cover" />
                    : agent.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-midnight truncate">{agent.name}</h3>
                  <p className="text-sm text-foreground/60 truncate">{agent.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-foreground/60 mb-4">
                <Phone className="w-4 h-4" />
                <span className="truncate">{agent.phone || "Sin teléfono"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-muted/20 rounded-xl">
                <div className="text-center">
                  <p className="text-lg font-bold text-midnight">{agent.properties}</p>
                  <p className="text-xs text-foreground/60">Propiedades</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-champagne-gold">{agent.sales}</p>
                  <p className="text-xs text-foreground/60">Ventas</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white"
                  onClick={() => handleOpenScheduler(agent)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Horarios
                </Button>
                <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-midnight"
                  onClick={() => handleEdit(agent)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => deleteAgentMutation.mutate(agent.rawId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {SchedulerWrapper}
      {AgentFormWrapper}
    </div>
  );
};

export default AgentesSection;
