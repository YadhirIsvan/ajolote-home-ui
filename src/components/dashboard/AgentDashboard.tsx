import { useState } from "react";
import { Home, Calendar, Users, ChevronRight, Clock, CheckCircle, XCircle, RefreshCw, Play, LogOut, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentPropertyModal from "./AgentPropertyModal";

import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

interface AgentDashboardProps {
  onLogout: () => void;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  leads: number;
  status: string;
}

interface Appointment {
  id: string;
  client: string;
  property: string;
  date: string;
  time: string;
  status: "programada" | "confirmada" | "en_progreso" | "completada" | "cancelada" | "reagendada";
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Casa en Polanco",
    location: "Polanco, CDMX",
    price: "$12,500,000",
    image: property1,
    leads: 5,
    status: "Activa",
  },
  {
    id: "2",
    title: "Departamento en Roma Norte",
    location: "Roma Norte, CDMX",
    price: "$4,800,000",
    image: property2,
    leads: 3,
    status: "Activa",
  },
  {
    id: "3",
    title: "Penthouse en Santa Fe",
    location: "Santa Fe, CDMX",
    price: "$18,900,000",
    image: property3,
    leads: 8,
    status: "En negociación",
  },
];

const mockAppointments: Appointment[] = [
  { id: "1", client: "María García", property: "Casa en Polanco", date: "15 Ene", time: "10:00 AM", status: "confirmada" },
  { id: "2", client: "Carlos Rodríguez", property: "Depto Roma Norte", date: "15 Ene", time: "2:00 PM", status: "programada" },
  { id: "3", client: "Ana Martínez", property: "Penthouse Santa Fe", date: "16 Ene", time: "11:00 AM", status: "en_progreso" },
  { id: "4", client: "Pedro López", property: "Casa en Polanco", date: "14 Ene", time: "4:00 PM", status: "completada" },
  { id: "5", client: "Laura Sánchez", property: "Depto Roma Norte", date: "13 Ene", time: "1:00 PM", status: "cancelada" },
  { id: "6", client: "Roberto Díaz", property: "Penthouse Santa Fe", date: "17 Ene", time: "9:00 AM", status: "reagendada" },
];

const statusConfig: Record<Appointment["status"], { label: string; color: string; icon: React.ComponentType<any> }> = {
  programada: { label: "Programada", color: "bg-blue-100 text-blue-700", icon: Clock },
  confirmada: { label: "Confirmada", color: "bg-green-100 text-green-700", icon: CheckCircle },
  en_progreso: { label: "En Progreso", color: "bg-champagne-gold/20 text-champagne-gold", icon: Play },
  completada: { label: "Completada", color: "bg-gray-100 text-gray-600", icon: CheckCircle },
  cancelada: { label: "Cancelada", color: "bg-red-100 text-red-600", icon: XCircle },
  reagendada: { label: "Reagendada", color: "bg-orange-100 text-orange-600", icon: RefreshCw },
};

const AgentDashboard = ({ onLogout }: AgentDashboardProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsPropertyModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Propiedades", value: "3", icon: Home },
          { label: "Leads Activos", value: "16", icon: Users },
          { label: "Citas Hoy", value: "2", icon: Calendar },
          { label: "Ventas Mes", value: "1", icon: CheckCircle },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-champagne-gold/10">
                <stat.icon className="w-5 h-5 text-champagne-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-midnight">{stat.value}</p>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="bg-muted/30 p-1">
          <TabsTrigger 
            value="properties" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
          >
            <Home className="w-4 h-4" />
            Casas Asignadas
          </TabsTrigger>
          <TabsTrigger 
            value="appointments" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
          >
            <Calendar className="w-4 h-4" />
            Gestión de Citas
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-2"
          >
            <Settings className="w-4 h-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden border-border/50 hover:border-champagne-gold/50 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => handlePropertyClick(property)}
              >
                <div className="relative">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      property.status === "En negociación"
                        ? "bg-champagne-gold text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-midnight mb-1">{property.title}</h3>
                  <p className="text-foreground/60 text-sm mb-3">{property.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-champagne-gold">{property.price}</span>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Users className="w-4 h-4" />
                      <span>{property.leads} leads</span>
                    </div>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePropertyClick(property);
                    }}
                  >
                    Gestionar
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl text-midnight">Citas Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAppointments.map((appointment) => {
                  const config = statusConfig[appointment.status];
                  return (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30 hover:border-champagne-gold/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 bg-champagne-gold/10 rounded-xl">
                          <span className="text-sm font-bold text-midnight">{appointment.date.split(" ")[0]}</span>
                          <span className="text-xs text-foreground/60">{appointment.date.split(" ")[1]}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-midnight">{appointment.client}</h4>
                          <p className="text-sm text-foreground/60">
                            {appointment.property} • {appointment.time}
                          </p>
                        </div>
                      </div>
                      <Badge className={`${config.color} gap-1`}>
                        <config.icon className="w-3 h-3" />
                        {config.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-champagne-gold/10">
                    <Settings className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight">Configuración</h3>
                    <p className="text-sm text-foreground/60">Notificaciones y preferencias</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white">
                  Abrir Configuración
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-red-100">
                    <LogOut className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight">Cerrar Sesión</h3>
                    <p className="text-sm text-foreground/60">Salir de tu cuenta</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-500 hover:bg-red-50"
                  onClick={onLogout}
                >
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Property Modal */}
      <AgentPropertyModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        property={selectedProperty}
      />
    </div>
  );
};

export default AgentDashboard;
