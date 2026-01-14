import { useState } from "react";
import { 
  BarChart3, 
  Users, 
  Home, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Settings, 
  LogOut,
  ChevronRight,
  CheckCircle
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Agent {
  id: string;
  name: string;
  properties: number;
  sales: number;
  avatar: string;
}

interface PropertyAdmin {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  status: string;
  assignedAgent: string | null;
}

const mockAgents: Agent[] = [
  { id: "1", name: "Carlos Mendoza", properties: 8, sales: 3, avatar: "CM" },
  { id: "2", name: "Laura Sánchez", properties: 5, sales: 2, avatar: "LS" },
  { id: "3", name: "Roberto Díaz", properties: 6, sales: 4, avatar: "RD" },
  { id: "4", name: "Ana Martínez", properties: 4, sales: 1, avatar: "AM" },
];

const mockProperties: PropertyAdmin[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    location: "Polanco, CDMX",
    price: "$12,500,000",
    image: property1,
    status: "Activa",
    assignedAgent: "Carlos Mendoza",
  },
  {
    id: "2",
    title: "Departamento Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$4,800,000",
    image: property2,
    status: "Pendiente",
    assignedAgent: null,
  },
  {
    id: "3",
    title: "Penthouse Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$18,900,000",
    image: property3,
    status: "Activa",
    assignedAgent: "Laura Sánchez",
  },
];

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [properties, setProperties] = useState(mockProperties);

  const handleAgentAssign = (propertyId: string, agentName: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, assignedAgent: agentName, status: "Activa" }
          : p
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ventas Totales", value: "$48.5M", icon: DollarSign, change: "+12%" },
          { label: "Agentes Activos", value: "4", icon: Users, change: "+2" },
          { label: "Propiedades", value: "23", icon: Home, change: "+5" },
          { label: "Pendientes", value: "7", icon: Clock, change: "-3" },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-champagne-gold/10">
                  <stat.icon className="w-5 h-5 text-champagne-gold" />
                </div>
                <Badge
                  className={`${
                    stat.change.startsWith("+")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-midnight">{stat.value}</p>
              <p className="text-sm text-foreground/60">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Properties Management */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-midnight">Gestión de Propiedades</CardTitle>
              <Button variant="gold" size="sm" className="gap-2">
                <Home className="w-4 h-4" />
                Nueva Propiedad
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30">
                      <TableHead className="text-midnight">Propiedad</TableHead>
                      <TableHead className="text-midnight">Precio</TableHead>
                      <TableHead className="text-midnight">Estado</TableHead>
                      <TableHead className="text-midnight">Agente Asignado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => (
                      <TableRow key={property.id} className="border-border/30 hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-midnight">{property.title}</p>
                              <p className="text-sm text-foreground/60">{property.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-champagne-gold">
                          {property.price}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              property.status === "Activa"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-600"
                            }
                          >
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={property.assignedAgent || ""}
                            onValueChange={(value) => handleAgentAssign(property.id, value)}
                          >
                            <SelectTrigger className="w-[180px] border-border/50">
                              <SelectValue placeholder="Asignar agente" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockAgents.map((agent) => (
                                <SelectItem key={agent.id} value={agent.name}>
                                  {agent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agents Performance */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-midnight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-champagne-gold" />
                Top Agentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockAgents
                .sort((a, b) => b.sales - a.sales)
                .map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          index === 0
                            ? "bg-champagne-gold"
                            : index === 1
                            ? "bg-midnight"
                            : "bg-foreground/40"
                        }`}
                      >
                        {agent.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-midnight">{agent.name}</p>
                        <p className="text-sm text-foreground/60">
                          {agent.properties} propiedades
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-champagne-gold">{agent.sales}</p>
                      <p className="text-xs text-foreground/60">ventas</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-midnight">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Agregar Agente
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Ver Reportes
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold hover:text-champagne-gold">
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuración
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between border-red-200 text-red-500 hover:bg-red-50"
                onClick={onLogout}
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sales Chart Placeholder */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-midnight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-champagne-gold" />
            Ventas Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map(
              (month, index) => {
                const heights = [40, 55, 70, 45, 80, 65, 90, 75, 85, 60, 95, 50];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-champagne-gold to-champagne-gold/60 transition-all hover:from-champagne-gold-dark hover:to-champagne-gold"
                      style={{ height: `${heights[index]}%` }}
                    />
                    <span className="text-xs text-foreground/60">{month}</span>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
