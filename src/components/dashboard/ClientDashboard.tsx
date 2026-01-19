import { useState } from "react";
import { User, CreditCard, Home, ShoppingCart, LogOut, Bell, Shield, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface ClientDashboardProps {
  onLogout: () => void;
}

const ClientDashboard = ({ onLogout }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const [profileTab, setProfileTab] = useState("perfil");

  return (
    <div className="space-y-6">
      {/* Header with CTA and Logout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-champagne-gold/5 to-transparent rounded-2xl border border-champagne-gold/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-champagne-gold/20 flex items-center justify-center">
            <User className="w-6 h-6 text-champagne-gold" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-midnight">¡Bienvenido de nuevo!</h2>
            <p className="text-sm text-foreground/60">Gestiona tu cuenta y propiedades</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="gold"
            className="font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/credito")}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Obtén tu Crédito
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="text-foreground/50 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Bento Box Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mi Perfil - Large Card with Tabs */}
        <Card className="md:row-span-2 border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs value={profileTab} onValueChange={setProfileTab} className="w-full">
              <div className="p-6 pb-0 border-b border-border/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-champagne-gold/10">
                    <User className="w-5 h-5 text-champagne-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-midnight">Mi Perfil</h3>
                </div>
                <TabsList className="w-full grid grid-cols-3 bg-muted/30 p-1 rounded-lg">
                  <TabsTrigger value="perfil" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                    Datos
                  </TabsTrigger>
                  <TabsTrigger value="notificaciones" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                    <Bell className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
                    Alertas
                  </TabsTrigger>
                  <TabsTrigger value="seguridad" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                    <Shield className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
                    Seguridad
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="perfil" className="p-6 pt-4 m-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-champagne-gold to-champagne-gold-dark flex items-center justify-center text-white text-xl font-bold">
                      JD
                    </div>
                    <div>
                      <p className="font-semibold text-midnight text-lg">Juan Díaz</p>
                      <p className="text-sm text-foreground/60">juan.diaz@email.com</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-foreground/50 mb-1">Teléfono</p>
                      <p className="text-sm font-medium text-midnight">+52 555 123 4567</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <p className="text-xs text-foreground/50 mb-1">Ciudad</p>
                      <p className="text-sm font-medium text-midnight">CDMX</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2 border-champagne-gold/30 text-champagne-gold hover:bg-champagne-gold/5">
                    Editar Perfil
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notificaciones" className="p-6 pt-4 m-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-champagne-gold" />
                      <span className="text-sm text-midnight">Nuevas propiedades</span>
                    </div>
                    <div className="w-10 h-6 bg-champagne-gold rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-champagne-gold" />
                      <span className="text-sm text-midnight">Actualizaciones de precio</span>
                    </div>
                    <div className="w-10 h-6 bg-champagne-gold rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-foreground/40" />
                      <span className="text-sm text-midnight">Recordatorios de citas</span>
                    </div>
                    <div className="w-10 h-6 bg-muted/50 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seguridad" className="p-6 pt-4 m-0">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold/30">
                    <span className="text-sm">Cambiar contraseña</span>
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold/30">
                    <span className="text-sm">Verificación en dos pasos</span>
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between border-border/50 hover:border-champagne-gold/30">
                    <span className="text-sm">Sesiones activas</span>
                    <ChevronRight className="w-4 h-4 text-foreground/40" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Score de Crédito - Featured Card */}
        <Card className="border-champagne-gold/20 bg-gradient-to-br from-champagne-gold/5 via-white to-champagne-gold/10 shadow-sm hover:shadow-lg transition-all rounded-2xl overflow-hidden group cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-champagne-gold/20">
                <TrendingUp className="w-5 h-5 text-champagne-gold" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Pre-aprobado</span>
            </div>
            <h3 className="text-lg font-semibold text-midnight mb-1">Mi Score de Crédito</h3>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-bold text-champagne-gold">750</span>
              <span className="text-sm text-foreground/60">/ 850</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-champagne-gold to-champagne-gold-dark rounded-full" style={{ width: "88%" }}></div>
            </div>
            <p className="text-sm text-foreground/60 mb-4">
              Monto pre-aprobado: <span className="font-semibold text-midnight">$8,500,000 MXN</span>
            </p>
            <Button variant="gold" className="w-full group-hover:shadow-md transition-shadow">
              Ver Detalles
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Propiedades Section - Two Cards Side by Side */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* En Venta */}
          <Card className="border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-blue-50">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">2 activas</span>
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">En Venta</h3>
              <p className="text-sm text-foreground/60 mb-4">Propiedades que estás vendiendo actualmente</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg text-sm">
                  <span className="text-midnight">Casa en Querétaro</span>
                  <span className="text-champagne-gold font-medium">$4.2M</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-muted/20 rounded-lg text-sm">
                  <span className="text-midnight">Depto en CDMX</span>
                  <span className="text-champagne-gold font-medium">$2.8M</span>
                </div>
              </div>
              <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                Gestionar Propiedades
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Proceso de Compra */}
          <Card className="border border-border/30 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">1 en proceso</span>
              </div>
              <h3 className="text-lg font-semibold text-midnight mb-2">Proceso de Compra</h3>
              <p className="text-sm text-foreground/60 mb-4">Propiedades que estás adquiriendo</p>
              <div className="space-y-2 mb-4">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-midnight font-medium">Casa en Polanco</span>
                    <span className="text-champagne-gold font-medium text-sm">$12.5M</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                    <span className="text-xs text-foreground/50">60%</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                Ver Estado
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity - Full Width */}
      <Card className="border border-border/30 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-midnight mb-5">Actividad Reciente</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-champagne-gold/5 to-transparent rounded-xl border border-champagne-gold/10 hover:border-champagne-gold/20 transition-colors">
              <div className="p-2.5 bg-champagne-gold/10 rounded-xl flex-shrink-0">
                <CreditCard className="w-5 h-5 text-champagne-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-midnight">Score Legal Generado</p>
                <p className="text-sm text-foreground/60 truncate">Casa en Querétaro - Score: 98/100</p>
              </div>
              <span className="text-xs text-foreground/40 whitespace-nowrap">Hace 2 días</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-xl border border-border/20 hover:border-champagne-gold/20 transition-colors">
              <div className="p-2.5 bg-green-50 rounded-xl flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-midnight">Crédito Pre-aprobado</p>
                <p className="text-sm text-foreground/60 truncate">Monto: $8,500,000 MXN</p>
              </div>
              <span className="text-xs text-foreground/40 whitespace-nowrap">Hace 5 días</span>
            </div>

            <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-xl border border-border/20 hover:border-champagne-gold/20 transition-colors">
              <div className="p-2.5 bg-blue-50 rounded-xl flex-shrink-0">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-midnight">Propiedad Agregada</p>
                <p className="text-sm text-foreground/60 truncate">Departamento en CDMX</p>
              </div>
              <span className="text-xs text-foreground/40 whitespace-nowrap">Hace 1 semana</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;
