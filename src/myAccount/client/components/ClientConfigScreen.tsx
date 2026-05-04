import { ArrowLeft, User, Bell, Shield, ChevronRight, Camera } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useState } from "react";
import { useClientConfig } from "@/myAccount/client/hooks/use-client-config.client.hook";
import type { NotificationPreferences } from "@/myAccount/client/types/client.types";
import ClientProfileEditForm from "./ClientProfileEditForm";

interface ClientConfigScreenProps {
  onBack: () => void;
}

const ClientConfigScreen = ({ onBack }: ClientConfigScreenProps) => {
  const [activeTab, setActiveTab] = useState("datos");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const { profile, profileLoading, phone } = useClientConfig();
  const notifPrefs = undefined as NotificationPreferences | undefined;

  const initials =
    [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .map((n) => (n as string).trim()[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  if (isEditingProfile) {
    return <ClientProfileEditForm onBack={() => setIsEditingProfile(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-foreground/60 hover:text-champagne-gold transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al Dashboard
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-champagne-gold to-champagne-gold-dark flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {initials}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-champagne-gold/30 flex items-center justify-center shadow-md hover:scale-110 transition-transform">
            <Camera className="w-3.5 h-3.5 text-champagne-gold" />
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-midnight">Configuración</h1>
          <p className="text-sm text-foreground/60">Administra tu perfil y preferencias</p>
        </div>
      </div>

      <Card className="border border-border/30 bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 pt-6 pb-0 border-b border-border/20">
              <TabsList className="w-full grid grid-cols-3 bg-muted/30 p-1 rounded-lg">
                <TabsTrigger
                  value="datos"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Datos
                </TabsTrigger>
                <TabsTrigger
                  value="alertas"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Alertas
                </TabsTrigger>
                <TabsTrigger
                  value="seguridad"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Seguridad
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Datos */}
            <TabsContent value="datos" className="p-6 pt-5 m-0">
              <div className="space-y-5">
                {profileLoading && (
                  <p className="text-sm text-foreground/50">Cargando perfil...</p>
                )}
                {!profileLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Nombre", value: profile?.first_name ?? "-" },
                      { label: "Apellido", value: profile?.last_name ?? "-" },
                      { label: "Correo electrónico", value: profile?.email ?? "-" },
                      { label: "Teléfono", value: phone || "-" },
                      { label: "Ciudad", value: profile?.city ?? "-" },
                    ].map((field) => (
                      <div key={field.label} className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground/50 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <div className="px-4 py-3 bg-muted/20 rounded-xl text-sm font-medium text-midnight border border-border/20">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button 
                  variant="gold" 
                  className="w-full sm:w-auto mt-2"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Editar Perfil
                </Button>
              </div>
            </TabsContent>

            {/* Alertas */}
            <TabsContent value="alertas" className="p-6 pt-5 m-0">
              <div className="space-y-3">
                {profileLoading && (
                  <p className="text-sm text-foreground/50">Cargando...</p>
                )}
                {!profileLoading &&
                  [
                    { label: "Nuevas propiedades", enabled: notifPrefs?.new_properties ?? false },
                    { label: "Actualizaciones de precio", enabled: notifPrefs?.price_updates ?? false },
                    { label: "Recordatorios de citas", enabled: notifPrefs?.appointment_reminders ?? false },
                    { label: "Ofertas y promociones", enabled: notifPrefs?.offers ?? false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/10"
                    >
                      <div className="flex items-center gap-3">
                        <Bell
                          className={`w-4 h-4 ${item.enabled ? "text-champagne-gold" : "text-foreground/30"}`}
                        />
                        <span className="text-sm font-medium text-midnight">{item.label}</span>
                      </div>
                      <div
                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                          item.enabled ? "bg-champagne-gold" : "bg-muted/50"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            item.enabled ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* Seguridad */}
            <TabsContent value="seguridad" className="p-6 pt-5 m-0">
              <div className="space-y-3">
                {[
                  { label: "Cambiar contraseña", desc: "Última actualización hace 3 meses" },
                  { label: "Verificación en dos pasos", desc: "No activada" },
                  { label: "Sesiones activas", desc: "1 dispositivo conectado" },
                  { label: "Eliminar cuenta", desc: "Esta acción es permanente" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex items-center justify-between w-full p-4 bg-muted/20 rounded-xl border border-border/10 hover:border-champagne-gold/30 hover:bg-champagne-gold/5 transition-all text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-midnight">{item.label}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30" />
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientConfigScreen;
