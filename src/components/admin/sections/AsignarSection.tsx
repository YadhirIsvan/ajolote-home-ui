import { useState } from "react";
import { 
  Home, 
  User, 
  ArrowRight, 
  X,
  Check,
  Shuffle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  agent: string | null;
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  properties: number;
}

const mockAgents: Agent[] = [
  { id: "1", name: "Carlos Mendoza", avatar: "CM", properties: 3 },
  { id: "2", name: "Laura Sánchez", avatar: "LS", properties: 2 },
  { id: "3", name: "Roberto Díaz", avatar: "RD", properties: 4 },
  { id: "4", name: "Ana Martínez", avatar: "AM", properties: 1 },
];

const initialProperties: Property[] = [
  { id: "1", title: "Casa en Polanco", location: "Polanco, CDMX", price: "$12,500,000", image: property1, agent: "Carlos Mendoza" },
  { id: "2", title: "Departamento Roma Norte", location: "Roma Norte, CDMX", price: "$4,800,000", image: property2, agent: null },
  { id: "3", title: "Penthouse Santa Fe", location: "Santa Fe, CDMX", price: "$18,900,000", image: property3, agent: "Laura Sánchez" },
  { id: "4", title: "Casa en Coyoacán", location: "Coyoacán, CDMX", price: "$8,200,000", image: property1, agent: null },
  { id: "5", title: "Loft en Condesa", location: "Condesa, CDMX", price: "$6,500,000", image: property2, agent: null },
];

const AsignarSection = () => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const unassignedProperties = properties.filter(p => !p.agent);
  const assignedProperties = properties.filter(p => p.agent);

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
          <p className="text-xs md:text-sm text-foreground/60 truncate">{property.location}</p>
          <p className="text-sm md:text-base font-bold text-champagne-gold my-1">{property.price}</p>
          
          {showAssignSelect ? (
            <Select onValueChange={(value) => handleAssign(property.id, value)}>
              <SelectTrigger className="h-9 text-xs md:text-sm border-champagne-gold/50">
                <SelectValue placeholder="Asignar a..." />
              </SelectTrigger>
              <SelectContent>
                {mockAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs">
                        {agent.avatar}
                      </div>
                      {agent.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-champagne-gold text-white flex items-center justify-center text-xs flex-shrink-0">
                  {mockAgents.find(a => a.name === property.agent)?.avatar || "?"}
                </div>
                <span className="text-xs md:text-sm text-midnight truncate">{property.agent}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Select onValueChange={(value) => handleAssign(property.id, value)}>
                  <SelectTrigger className="h-8 w-8 p-0 border-0 bg-muted/30">
                    <Shuffle className="w-4 h-4 text-foreground/60" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.name}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight">Asignar Propiedades</h1>
        <p className="text-foreground/60">Matchmaking entre casas y agentes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Properties */}
        <Card className="border-border/50">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-lg text-red-700 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Casas Sin Asignar
              <Badge className="bg-red-100 text-red-700 ml-auto">{unassignedProperties.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {unassignedProperties.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Check className="w-12 h-12 mx-auto mb-3 text-green-500" />
                <p>Todas las propiedades están asignadas</p>
              </div>
            ) : (
              unassignedProperties.map((property) => (
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
              <Badge className="bg-green-100 text-green-700 ml-auto">{assignedProperties.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {assignedProperties.length === 0 ? (
              <div className="text-center py-8 text-foreground/50">
                <Home className="w-12 h-12 mx-auto mb-3" />
                <p>No hay propiedades asignadas</p>
              </div>
            ) : (
              assignedProperties.map((property) => (
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
            {mockAgents.map((agent) => {
              const agentProperties = properties.filter(p => p.agent === agent.name).length;
              return (
                <div 
                  key={agent.id}
                  className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-champagne-gold text-white flex items-center justify-center font-semibold">
                    {agent.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-midnight text-sm">{agent.name}</p>
                    <p className="text-xs text-foreground/60">{agentProperties} propiedades</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AsignarSection;
