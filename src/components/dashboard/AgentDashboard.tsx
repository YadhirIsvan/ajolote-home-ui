import { useState } from "react";
import { Home, Calendar, Users, ChevronRight, CheckCircle, LogOut, Settings, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import AgentPropertyModal from "./AgentPropertyModal";
import AppointmentKanban, { Appointment } from "./AppointmentKanban";
import EmptyState from "./EmptyState";

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

// Appointment interface is imported from AppointmentKanban

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

const AgentDashboard = ({ onLogout }: AgentDashboardProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsPropertyModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
  };

  // Show empty state for appointments demo
  const showEmptyAppointments = false;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Sticky Agent Header - Mobile */}
      <div className="sticky top-16 z-20 -mx-6 px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-border/30 md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-champagne-gold" />
          </div>
          <div>
            <h2 className="font-bold text-midnight">Alejandro Torres</h2>
            <p className="text-sm text-foreground/60">Agente Premium</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Propiedades", value: "3", icon: Home },
          { label: "Leads Activos", value: "16", icon: Users },
          { label: "Citas Hoy", value: "2", icon: Calendar },
          { label: "Ventas Mes", value: "1", icon: CheckCircle },
        ].map((stat, index) => (
          <Card key={index} className="border-border/50 bg-white">
            <CardContent className="p-3 md:p-4 flex items-center gap-3 md:gap-4">
              <div className="p-2.5 md:p-3 rounded-xl bg-champagne-gold/10 flex-shrink-0">
                <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-champagne-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-2xl font-bold text-midnight">{stat.value}</p>
                <p className="text-xs md:text-sm text-foreground/60 truncate">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 w-full grid grid-cols-3">
          <TabsTrigger 
            value="properties" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-1.5 text-xs md:text-sm"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Casas Asignadas</span>
            <span className="sm:hidden">Casas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="appointments" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-1.5 text-xs md:text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Gestión de Citas</span>
            <span className="sm:hidden">Citas</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="data-[state=active]:bg-champagne-gold data-[state=active]:text-white gap-1.5 text-xs md:text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configuración</span>
            <span className="sm:hidden">Config</span>
          </TabsTrigger>
        </TabsList>

        {/* Properties Tab */}
        <TabsContent value="properties">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                    className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                <CardContent className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-semibold text-midnight mb-1 truncate">{property.title}</h3>
                  <p className="text-foreground/60 text-sm mb-3">{property.location}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg md:text-xl font-bold text-champagne-gold">{property.price}</span>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Users className="w-4 h-4" />
                      <span>{property.leads} leads</span>
                    </div>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full h-11"
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

        {/* Appointments Tab - Kanban Style */}
        <TabsContent value="appointments" className="mt-0">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-midnight">
                Gestión de Citas
              </h2>
              <Badge variant="outline" className="border-champagne-gold text-champagne-gold">
                {appointments.length} citas totales
              </Badge>
            </div>

            {/* Kanban Board */}
            {showEmptyAppointments ? (
              <Card className="border-border/50">
                <EmptyState type="appointments" />
              </Card>
            ) : (
              <AppointmentKanban
                appointments={appointments}
                onStatusChange={handleStatusChange}
              />
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="border-border/50">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-champagne-gold/10">
                    <Settings className="w-6 h-6 text-champagne-gold" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight">Configuración</h3>
                    <p className="text-sm text-foreground/60">Notificaciones y preferencias</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-12 border-champagne-gold text-champagne-gold hover:bg-champagne-gold hover:text-white">
                  Abrir Configuración
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-5 md:p-6">
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
                  className="w-full h-12 border-red-200 text-red-500 hover:bg-red-50"
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
