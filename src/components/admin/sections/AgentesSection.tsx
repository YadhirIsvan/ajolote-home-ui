import { useState } from "react";
import { 
  Users, 
  Plus, 
  Clock, 
  Edit, 
  Trash2,
  Calendar,
  X,
  Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TimeBlock {
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
      Lunes: [{ start: "09:00", end: "14:00", type: "work" }, { start: "14:00", end: "15:00", type: "lunch" }, { start: "15:00", end: "18:00", type: "work" }],
      Martes: [{ start: "09:00", end: "14:00", type: "work" }, { start: "14:00", end: "15:00", type: "lunch" }, { start: "15:00", end: "18:00", type: "work" }],
      Miércoles: [{ start: "09:00", end: "14:00", type: "work" }, { start: "14:00", end: "15:00", type: "lunch" }, { start: "15:00", end: "18:00", type: "work" }],
      Jueves: [{ start: "09:00", end: "14:00", type: "work" }, { start: "14:00", end: "15:00", type: "lunch" }, { start: "15:00", end: "18:00", type: "work" }],
      Viernes: [{ start: "09:00", end: "14:00", type: "work" }, { start: "14:00", end: "15:00", type: "lunch" }, { start: "15:00", end: "17:00", type: "work" }],
      Sábado: [{ start: "10:00", end: "14:00", type: "work" }],
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
      Lunes: [{ start: "10:00", end: "19:00", type: "work" }],
      Martes: [{ start: "10:00", end: "19:00", type: "work" }],
      Miércoles: [{ start: "10:00", end: "19:00", type: "work" }],
      Jueves: [{ start: "10:00", end: "19:00", type: "work" }],
      Viernes: [{ start: "10:00", end: "19:00", type: "work" }],
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
    schedule: {
      Lunes: [{ start: "08:00", end: "17:00", type: "work" }],
      Martes: [{ start: "08:00", end: "17:00", type: "work" }],
      Miércoles: [{ start: "08:00", end: "17:00", type: "work" }],
      Jueves: [{ start: "08:00", end: "17:00", type: "work" }],
      Viernes: [{ start: "08:00", end: "17:00", type: "work" }],
      Sábado: [{ start: "09:00", end: "13:00", type: "work" }],
      Domingo: [],
    },
  },
];

const AgentesSection = () => {
  const isMobile = useIsMobile();
  const [agents] = useState<Agent[]>(mockAgents);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const handleOpenScheduler = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsSchedulerOpen(true);
  };

  const SchedulerContent = () => {
    if (!selectedAgent) return null;

    return (
      <div className="space-y-6 p-4">
        {/* Agent Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-border/30">
          <div className="w-14 h-14 rounded-full bg-champagne-gold flex items-center justify-center text-white text-xl font-bold">
            {selectedAgent.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight">{selectedAgent.name}</h3>
            <p className="text-foreground/60">{selectedAgent.email}</p>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="space-y-4">
          <h4 className="font-semibold text-midnight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-champagne-gold" />
            Horario Semanal
          </h4>

          {DAYS.map((day) => {
            const blocks = selectedAgent.schedule[day] || [];
            const hasWork = blocks.length > 0;

            return (
              <div key={day} className="border border-border/30 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-muted/20">
                  <span className="font-medium text-midnight">{day}</span>
                  <Button variant="ghost" size="sm" className="text-champagne-gold h-8">
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir
                  </Button>
                </div>
                
                {hasWork ? (
                  <div className="p-3 space-y-2">
                    {blocks.map((block, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          block.type === "lunch" 
                            ? "bg-orange-50 border border-orange-200" 
                            : "bg-champagne-gold/10 border border-champagne-gold/30"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={cn(
                            "w-4 h-4",
                            block.type === "lunch" ? "text-orange-500" : "text-champagne-gold"
                          )} />
                          <span className="font-medium text-midnight">
                            {block.start} - {block.end}
                          </span>
                          {block.type === "lunch" && (
                            <Badge className="bg-orange-100 text-orange-600 text-xs">
                              Comida
                            </Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500 h-8 w-8 p-0">
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

        <Button variant="gold" className="w-full h-12">
          <Check className="w-4 h-4 mr-2" />
          Guardar Horario
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight">Gestión de Agentes</h1>
          <p className="text-foreground/60">Administra cuentas y horarios</p>
        </div>
        <Button variant="gold" className="gap-2">
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
                <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-midnight">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500 hover:bg-red-50">
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
              <DrawerTitle>Configurar Horarios</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <SchedulerContent />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configurar Horarios</DialogTitle>
            </DialogHeader>
            <SchedulerContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AgentesSection;
