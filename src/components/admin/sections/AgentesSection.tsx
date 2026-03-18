import { useState } from "react";
import { 
  Users, 
  Plus, 
  Clock, 
  Edit, 
  Trash2,
  Calendar,
  X,
  Check,
  Save,
  Coffee,
  Phone,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/shared/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TimeBlock {
  id: string;
  start: string;
  end: string;
  type: "work" | "lunch";
}

interface AgentSchedule {
  [day: string]: TimeBlock[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  properties: number;
  sales: number;
  status: "activo" | "inactivo";
  schedule: AgentSchedule;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const TIME_OPTIONS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00"
];

const createDefaultSchedule = (): AgentSchedule => {
  const schedule: AgentSchedule = {};
  DAYS.forEach(day => {
    schedule[day] = [];
  });
  return schedule;
};

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    email: "carlos@ajolote.mx",
    phone: "+52 55 1234 5678",
    avatar: "CM",
    properties: 8,
    sales: 5,
    status: "activo",
    schedule: {
      Lunes: [
        { id: "1a", start: "09:00", end: "14:00", type: "work" }, 
        { id: "1b", start: "14:00", end: "15:00", type: "lunch" }, 
        { id: "1c", start: "15:00", end: "18:00", type: "work" }
      ],
      Martes: [
        { id: "2a", start: "09:00", end: "14:00", type: "work" }, 
        { id: "2b", start: "14:00", end: "15:00", type: "lunch" }, 
        { id: "2c", start: "15:00", end: "18:00", type: "work" }
      ],
      Miércoles: [
        { id: "3a", start: "09:00", end: "14:00", type: "work" }, 
        { id: "3b", start: "14:00", end: "15:00", type: "lunch" }, 
        { id: "3c", start: "15:00", end: "18:00", type: "work" }
      ],
      Jueves: [
        { id: "4a", start: "09:00", end: "14:00", type: "work" }, 
        { id: "4b", start: "14:00", end: "15:00", type: "lunch" }, 
        { id: "4c", start: "15:00", end: "18:00", type: "work" }
      ],
      Viernes: [
        { id: "5a", start: "09:00", end: "14:00", type: "work" }, 
        { id: "5b", start: "14:00", end: "15:00", type: "lunch" }, 
        { id: "5c", start: "15:00", end: "17:00", type: "work" }
      ],
      Sábado: [{ id: "6a", start: "10:00", end: "14:00", type: "work" }],
      Domingo: [],
    },
  },
  {
    id: "2",
    name: "Laura Sánchez",
    email: "laura@ajolote.mx",
    phone: "+52 55 9876 5432",
    avatar: "LS",
    properties: 5,
    sales: 3,
    status: "activo",
    schedule: {
      Lunes: [{ id: "7a", start: "10:00", end: "19:00", type: "work" }],
      Martes: [{ id: "8a", start: "10:00", end: "19:00", type: "work" }],
      Miércoles: [{ id: "9a", start: "10:00", end: "19:00", type: "work" }],
      Jueves: [{ id: "10a", start: "10:00", end: "19:00", type: "work" }],
      Viernes: [{ id: "11a", start: "10:00", end: "19:00", type: "work" }],
      Sábado: [],
      Domingo: [],
    },
  },
  {
    id: "3",
    name: "Roberto Díaz",
    email: "roberto@ajolote.mx",
    phone: "+52 55 5555 1234",
    avatar: "RD",
    properties: 6,
    sales: 4,
    status: "activo",
    schedule: createDefaultSchedule(),
  },
];

const emptyAgent: Omit<Agent, "id"> = {
  name: "",
  email: "",
  phone: "",
  avatar: "",
  properties: 0,
  sales: 0,
  status: "activo",
  schedule: createDefaultSchedule(),
};

const AgentesSection = () => {
  const isMobile = useIsMobile();
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Agent, "id">>(emptyAgent);
  const [tempSchedule, setTempSchedule] = useState<AgentSchedule>(createDefaultSchedule());
  
  // Block form state
  const [addingBlockDay, setAddingBlockDay] = useState<string | null>(null);
  const [newBlock, setNewBlock] = useState<{ start: string; end: string; type: "work" | "lunch" }>({
    start: "09:00",
    end: "17:00",
    type: "work"
  });

  const handleOpenScheduler = (agent: Agent) => {
    setSelectedAgent(agent);
    setTempSchedule(JSON.parse(JSON.stringify(agent.schedule)));
    setIsSchedulerOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyAgent);
    setIsFormOpen(true);
  };

  const handleEdit = (agent: Agent) => {
    setEditingId(agent.id);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      avatar: agent.avatar,
      properties: agent.properties,
      sales: agent.sales,
      status: agent.status,
      schedule: agent.schedule,
    });
    setIsFormOpen(true);
  };

  const handleSaveAgent = () => {
    if (editingId) {
      setAgents(prev => prev.map(a => 
        a.id === editingId ? { ...a, ...formData } : a
      ));
      toast.success("Agente actualizado");
    } else {
      const newAgent: Agent = {
        id: Date.now().toString(),
        ...formData,
        avatar: formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      };
      setAgents(prev => [...prev, newAgent]);
      toast.success("Agente creado");
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    toast.success("Agente eliminado");
  };

  const handleAddBlock = (day: string) => {
    const block: TimeBlock = {
      id: Date.now().toString(),
      ...newBlock
    };
    setTempSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), block].sort((a, b) => a.start.localeCompare(b.start))
    }));
    setAddingBlockDay(null);
    setNewBlock({ start: "09:00", end: "17:00", type: "work" });
  };

  const handleRemoveBlock = (day: string, blockId: string) => {
    setTempSchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(b => b.id !== blockId)
    }));
  };

  const handleSaveSchedule = () => {
    if (selectedAgent) {
      setAgents(prev => prev.map(a => 
        a.id === selectedAgent.id ? { ...a, schedule: tempSchedule } : a
      ));
      toast.success("Horario guardado");
    }
    setIsSchedulerOpen(false);
  };

  const SchedulerContent = () => {
    if (!selectedAgent) return null;

    return (
      <div className="space-y-4">
        {/* Agent Header */}
        <div className="flex items-center gap-4 p-4 bg-champagne-gold/10 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold">
            {selectedAgent.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight">{selectedAgent.name}</h3>
            <p className="text-foreground/60">{selectedAgent.email}</p>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-3">
          <h4 className="font-semibold text-midnight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-champagne-gold" />
            Horario Semanal
          </h4>

          {DAYS.map((day) => {
            const blocks = tempSchedule[day] || [];
            const hasWork = blocks.length > 0;

            return (
              <div key={day} className="border border-border/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-muted/20">
                  <span className="font-medium text-midnight">{day}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-champagne-gold h-8"
                    onClick={() => setAddingBlockDay(addingBlockDay === day ? null : day)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir
                  </Button>
                </div>

                {/* Add Block Form */}
                {addingBlockDay === day && (
                  <div className="p-3 bg-champagne-gold/5 border-b border-champagne-gold/20 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={newBlock.start} onValueChange={(v) => setNewBlock(prev => ({ ...prev, start: v }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Inicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newBlock.end} onValueChange={(v) => setNewBlock(prev => ({ ...prev, end: v }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Fin" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newBlock.type} onValueChange={(v: "work" | "lunch") => setNewBlock(prev => ({ ...prev, type: v }))}>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Trabajo</SelectItem>
                          <SelectItem value="lunch">Comida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setAddingBlockDay(null)} className="flex-1">
                        Cancelar
                      </Button>
                      <Button variant="gold" size="sm" onClick={() => handleAddBlock(day)} className="flex-1">
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                  </div>
                )}
                
                {hasWork ? (
                  <div className="p-3 space-y-2">
                    {blocks.map((block) => (
                      <div 
                        key={block.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          block.type === "lunch" 
                            ? "bg-orange-50 border border-orange-200" 
                            : "bg-champagne-gold/10 border border-champagne-gold/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {block.type === "lunch" ? (
                            <Coffee className="w-4 h-4 text-orange-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-champagne-gold" />
                          )}
                          <span className="font-medium text-midnight">
                            {block.start} - {block.end}
                          </span>
                          {block.type === "lunch" && (
                            <Badge className="bg-orange-100 text-orange-600 text-xs">
                              Comida
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-400 hover:text-red-500 h-8 w-8 p-0"
                          onClick={() => handleRemoveBlock(day, block.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-foreground/50 text-sm">
                    Día libre
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const FormContent = () => (
    <div className="space-y-5 p-4">
      <div className="space-y-2">
        <Label>Nombre Completo</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Carlos Mendoza"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="carlos@ajolote.mx"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+52 55 1234 5678"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>Estado</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "activo" | "inactivo") => 
            setFormData(prev => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className="h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Gestión de Agentes</h1>
          <p className="text-foreground/60">Administra cuentas y horarios</p>
        </div>
        <Button variant="gold" className="gap-2" onClick={handleCreate}>
          <Plus className="w-4 h-4" />
          Nuevo Agente
        </Button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all">
            <CardContent className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-midnight truncate">{agent.name}</h3>
                  <p className="text-sm text-foreground/60 truncate">{agent.email}</p>
                </div>
                <Badge className={agent.status === "activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {agent.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-foreground/60 mb-4">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{agent.phone}</span>
                </div>
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-foreground/60 hover:text-midnight"
                  onClick={() => handleEdit(agent)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(agent.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduler Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
          <DrawerContent className="max-h-[90vh]">
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Scheduler Pro</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4">
              <SchedulerContent />
            </div>
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSaveSchedule} className="w-full h-12">
                <Check className="w-4 h-4 mr-2" />
                Guardar Horario
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Scheduler Pro</DialogTitle>
            </DialogHeader>
            <SchedulerContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSchedulerOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSaveSchedule}>
                <Check className="w-4 h-4 mr-2" />
                Guardar Horario
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Agent Form Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>{editingId ? "Editar Agente" : "Nuevo Agente"}</DrawerTitle>
            </DrawerHeader>
            <FormContent />
            <DrawerFooter className="border-t border-border/30">
              <Button variant="gold" onClick={handleSaveAgent} className="w-full h-12">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Agente" : "Nuevo Agente"}</DialogTitle>
            </DialogHeader>
            <FormContent />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button variant="gold" onClick={handleSaveAgent}>
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

export default AgentesSection;
