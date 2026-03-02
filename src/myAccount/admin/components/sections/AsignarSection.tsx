import { useState } from "react";
import { 
  Home, 
  User, 
  ArrowRight, 
  X,
  Check,
  Shuffle,
  MapPin,
  Search,
  ArrowLeftRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  agent: string | null;
  bedrooms: number;
  bathrooms: number;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  properties: number;
  status: "activo" | "inactivo";
}

const AsignarSection = () => {
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const unassignedProperties = properties.filter(p => !p.agent);
  const assignedProperties = properties.filter(p => p.agent);

  const filteredUnassigned = unassignedProperties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssigned = assignedProperties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.agent && p.agent.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssign = (propertyId: string, agentName: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, agent: agentName } : p
    ));
    toast.success(`Propiedad asignada a ${agentName}`);
  };

  const handleRemoveAgent = (propertyId: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, agent: null } : p
    ));
    toast.success("Agente removido de la propiedad");
  };

  const handleOpenTransfer = (property: Property) => {
    setSelectedProperty(property);
    setIsTransferOpen(true);
  };

  const handleTransfer = (newAgentName: string) => {
    if (selectedProperty) {
      const oldAgent = selectedProperty.agent;
      setProperties(prev => prev.map(p => 
        p.id === selectedProperty.id ? { ...p, agent: newAgentName } : p
      ));
      toast.success(`Propiedad transferida de ${oldAgent} a ${newAgentName}`);
      setIsTransferOpen(false);
    }
  };

  const getAgentPropertyCount = (agentName: string) => {
    return properties.filter(p => p.agent === agentName).length;
  };

  const PropertyCard = ({ property, showAssignSelect }: { property: Property; showAssignSelect: boolean }) => (
    <Card className="border-border/50 hover:border-champagne-gold/50 transition-all overflow-hidden">
      <div className="flex">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-24 h-24 md:w-32 md:h-32 object-cover flex-shrink-0"
        />
        <CardContent className="p-3 md:p-4 flex-1 min-w-0">
          <h3 className="font-semibold text-midnight truncate text-sm md:text-base">{property.title}</h3>
          <div className="flex items-center gap-1 text-xs md:text-sm text-foreground/60 mb-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{property.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground/50 mb-2">
            <span>{property.bedrooms} rec</span>
            <span>•</span>
            <span>{property.bathrooms} baños</span>
          </div>
          <p className="text-sm md:text-base font-bold text-champagne-gold mb-2">{property.price}</p>
          
          {showAssignSelect ? (
            <Select onValueChange={(value) => handleAssign(property.id, value)}>
              <SelectTrigger className="h-9 text-xs md:text-sm border-champagne-gold/50">
                <SelectValue placeholder="Asignar a..." />
              </SelectTrigger>
              <SelectContent>
                {agents.filter(a => a.status === "activo").map((agent) => (
                  <SelectItem key={agent.id} value={agent.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs">
                        {agent.avatar}
                      </div>
                      <span>{agent.name}</span>
                      <span className="text-foreground/50">({getAgentPropertyCount(agent.name)})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs flex-shrink-0">
                  {agents.find(a => a.name === property.agent)?.avatar || "?"}
                </div>
                <span className="text-xs md:text-sm text-midnight truncate">{property.agent}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-champagne-gold hover:bg-champagne-gold/10"
                  onClick={() => handleOpenTransfer(property)}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50"
                  onClick={() => handleRemoveAgent(property.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );

  const TransferContent = () => {
    if (!selectedProperty) return null;
    
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl">
          <img 
            src={selectedProperty.image} 
            alt={selectedProperty.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-midnight">{selectedProperty.title}</h4>
            <p className="text-sm text-foreground/60">{selectedProperty.location}</p>
            <p className="text-sm font-medium text-champagne-gold">{selectedProperty.price}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-200">
          <User className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-xs text-orange-600">Agente Actual</p>
            <p className="font-medium text-orange-700">{selectedProperty.agent}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-midnight mb-3">Transferir a:</p>
          <div className="space-y-2">
            {agents
              .filter(a => a.name !== selectedProperty.agent && a.status === "activo")
              .map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleTransfer(agent.name)}
                  className="w-full flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-champagne-gold/10 hover:border-champagne-gold/50 border border-transparent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-champagne-gold text-white flex items-center justify-center font-semibold">
                      {agent.avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-midnight">{agent.name}</p>
                      <p className="text-xs text-foreground/60">{getAgentPropertyCount(agent.name)} propiedades asignadas</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-champagne-gold" />
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Asignar Propiedades</h1>
        <p className="text-foreground/60">Matchmaking entre casas y agentes</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <Input
          placeholder="Buscar propiedades o agentes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-border/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Properties */}
        <Card className="border-border/50">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-lg text-red-700 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Casas Sin Asignar
              <Badge className="bg-red-100 text-red-700 ml-auto">{filteredUnassigned.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredUnassigned.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>Todas las propiedades están asignadas</p>
              </div>
            ) : (
              filteredUnassigned.map((property) => (
                <PropertyCard key={property.id} property={property} showAssignSelect />
              ))
            )}
          </CardContent>
        </Card>

        {/* Assigned Properties */}
        <Card className="border-border/50">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="text-lg text-green-700 flex items-center gap-2">
              <User className="w-5 h-5" />
              Casas Asignadas
              <Badge className="bg-green-100 text-green-700 ml-auto">{filteredAssigned.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredAssigned.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Home className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades asignadas</p>
              </div>
            ) : (
              filteredAssigned.map((property) => (
                <PropertyCard key={property.id} property={property} showAssignSelect={false} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Agent Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-midnight">Resumen por Agente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {agents.map((agent) => {
              const agentProperties = getAgentPropertyCount(agent.name);
              return (
                <div 
                  key={agent.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all",
                    agent.status === "activo" 
                      ? "bg-muted/20 border-border/30 hover:border-champagne-gold/50" 
                      : "bg-gray-50 border-gray-200 opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white",
                    agent.status === "activo" ? "bg-champagne-gold" : "bg-gray-400"
                  )}>
                    {agent.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-midnight">{agent.name}</p>
                    <p className="text-sm text-foreground/60">{agentProperties} propiedades</p>
                    <Badge className={cn(
                      "text-xs mt-1",
                      agent.status === "activo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Transfer Modal/Drawer */}
      {isMobile ? (
        <Drawer open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DrawerContent>
            <DrawerHeader className="border-b border-border/30">
              <DrawerTitle>Transferir Propiedad</DrawerTitle>
            </DrawerHeader>
            <TransferContent />
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transferir Propiedad</DialogTitle>
            </DialogHeader>
            <TransferContent />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AsignarSection;
